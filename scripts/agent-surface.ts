import { mkdir, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { collectLiveSurfaceSnapshot, summarizeLiveSurface } from '../packages/orchestrator/src/live-surfaces.ts';

interface CliOptions {
  watch: boolean;
  intervalMs: number;
}

const OUTPUT_DIR = join(homedir(), '.arcanea', 'machine');
const OUTPUT_PATH = join(OUTPUT_DIR, 'agent-surface-status.json');
const TEXT_PATH = join(OUTPUT_DIR, 'agent-surface-status.txt');

function parseArgs(argv: string[]): CliOptions {
  const watch = argv.includes('--watch');
  const intervalFlag = argv.find((arg) => arg.startsWith('--interval='));
  const intervalMs = intervalFlag ? Number(intervalFlag.split('=', 2)[1]) : 5000;
  return {
    watch,
    intervalMs: Number.isFinite(intervalMs) && intervalMs > 1000 ? intervalMs : 5000,
  };
}

async function emitSnapshot(): Promise<void> {
  console.error('[agent-surface] collecting snapshot');
  const snapshot = await collectLiveSurfaceSnapshot(process.cwd());
  const summary = summarizeLiveSurface(snapshot);

  await mkdir(OUTPUT_DIR, { recursive: true });
  await writeFile(OUTPUT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
  await writeFile(
    TEXT_PATH,
    [
      `timestamp: ${snapshot.timestamp}`,
      `claude: ${summary.claude.join(' · ') || '(idle or hidden)'}`,
      `antigravity: ${summary.antigravity.join(' · ') || '(idle or hidden)'}`,
      `processes: ${snapshot.processes.length}`,
    ].join('\n') + '\n',
    'utf8',
  );

  console.error(`[agent-surface] wrote ${OUTPUT_PATH}`);
  console.error(`claude: ${summary.claude.join(' · ') || '(idle or hidden)'}`);
  console.error(`antigravity: ${summary.antigravity.join(' · ') || '(idle or hidden)'}`);
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  console.error(`[agent-surface] mode=${options.watch ? 'watch' : 'once'} interval=${options.intervalMs}`);
  if (!options.watch) {
    await emitSnapshot();
    return;
  }

  let timer: NodeJS.Timeout | undefined;
  const loop = async (): Promise<void> => {
    try {
      await emitSnapshot();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[agent-surface] ${message}`);
    }
    timer = setTimeout(() => {
      void loop();
    }, options.intervalMs);
  };

  void loop();

  const shutdown = (): void => {
    if (timer) clearTimeout(timer);
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack ?? error.message : String(error));
  process.exit(1);
});
