type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const PREFIX = '[Arcanea Media]';

let currentLevel: LogLevel = 'info';

export function setLogLevel(level: LogLevel): void {
  currentLevel = level;
}

function shouldLog(level: LogLevel): boolean {
  return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[currentLevel];
}

function formatArgs(module: string, msg: string, data?: unknown): unknown[] {
  const args: unknown[] = [`${PREFIX}[${module}] ${msg}`];
  if (data !== undefined) args.push(data);
  return args;
}

export function createLogger(module: string) {
  return {
    debug(msg: string, data?: unknown) {
      if (shouldLog('debug')) console.debug(...formatArgs(module, msg, data));
    },
    info(msg: string, data?: unknown) {
      if (shouldLog('info')) console.info(...formatArgs(module, msg, data));
    },
    warn(msg: string, data?: unknown) {
      if (shouldLog('warn')) console.warn(...formatArgs(module, msg, data));
    },
    error(msg: string, data?: unknown) {
      if (shouldLog('error')) console.error(...formatArgs(module, msg, data));
    },
  };
}
