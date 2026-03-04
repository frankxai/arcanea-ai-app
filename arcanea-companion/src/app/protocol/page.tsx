
import fs from 'fs';
import path from 'path';
import Link from 'next/link';

// Helper to read markdown
const getProtocolContent = () => {
    try {
        const protocolRoot = path.join(process.cwd(), '../starlight-protocol');

        // Constitution
        const constitutionPath = path.join(protocolRoot, '00_IDENTITY/LUMINOR_CONSTITUTION.md');
        const constitution = fs.existsSync(constitutionPath) ? fs.readFileSync(constitutionPath, 'utf8') : 'Constitution Not Found';

        // Agents
        const agentsDir = path.join(protocolRoot, '03_AGENCY');
        const departments = fs.existsSync(agentsDir) ? fs.readdirSync(agentsDir) : [];
        const agents = [];

        departments.forEach(dept => {
            const deptPath = path.join(agentsDir, dept);
            if (fs.statSync(deptPath).isDirectory()) {
                const files = fs.readdirSync(deptPath);
                files.forEach(file => {
                    if (file.endsWith('.md')) {
                        const content = fs.readFileSync(path.join(deptPath, file), 'utf8');
                        // Naive extraction of Title (first line)
                        const title = content.split('\n')[0].replace('# ', '').trim();
                        agents.push({
                            dept,
                            filename: file,
                            title,
                            content
                        });
                    }
                });
            }
        });

        // Strategies
        const strategiesDir = path.join(protocolRoot, '02_PROTOCOL/STRATEGIES');
        const strategies = [];
        if (fs.existsSync(strategiesDir)) {
            const files = fs.readdirSync(strategiesDir);
            files.forEach(file => {
                if (file.endsWith('.md')) {
                    const content = fs.readFileSync(path.join(strategiesDir, file), 'utf8');
                    const title = content.split('\n')[0].replace('# ', '').trim();
                    strategies.push({ filename: file, title, content });
                }
            });
        }

        return { constitution, agents, strategies };
    } catch (e) {
        console.error(e);
        return { constitution: 'Error reading protocol', agents: [], strategies: [] };
    }
};

export default function ProtocolPage() {
    const { constitution, agents, strategies } = getProtocolContent();

    return (
        <div className="min-h-screen bg-black text-white p-8 font-sans">

            {/* Header */}
            <header className="mb-12 border-b border-gray-800 pb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500 mb-2">
                        Starlight Protocol v1.0
                    </h1>
                    <p className="text-gray-400">The Context Operating System</p>
                </div>
                <Link href="/companion" className="px-4 py-2 rounded bg-gray-800 hover:bg-gray-700 transition">
                    Back to Companion
                </Link>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Column: Constitution */}
                <div className="lg:col-span-4">
                    <div className="bg-gray-900/50 border border-purple-500/30 rounded-xl p-6 h-full backdrop-blur-sm">
                        <h2 className="text-xl font-semibold text-purple-400 mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                            Luminor Constitution
                        </h2>
                        <div className="prose prose-invert prose-sm max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
                            <pre className="whitespace-pre-wrap font-mono text-xs text-gray-300">
                                {constitution}
                            </pre>
                        </div>
                    </div>
                </div>

                {/* Right Column: Agents & Strategies */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Active Agents */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <span className="text-blue-400">❖</span> Agency (Active Workforce)
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {agents.map((agent) => (
                                <div key={agent.filename} className="group relative bg-gray-900 border border-gray-800 hover:border-blue-500/50 rounded-lg p-5 transition-all">
                                    <div className="absolute top-2 right-2 text-xs font-mono text-gray-600 group-hover:text-blue-400">
                                        {agent.dept.replace('DEPT_', '')}
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-blue-300">
                                        {agent.title}
                                    </h3>
                                    <div className="text-xs font-mono text-gray-500 mb-4">{agent.filename}</div>
                                    <div className="px-3 py-1 bg-black/50 rounded text-xs text-gray-400 line-clamp-3 mb-4 font-mono">
                                        {agent.content.substring(0, 150)}...
                                    </div>
                                    <button
                                        className="w-full py-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 text-sm rounded transition border border-blue-500/30"
                                    >
                                        Active
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Cognitive Strategies */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <span className="text-green-400">⚡</span> Strategies (Thinking Models)
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {strategies.map((strat) => (
                                <div key={strat.filename} className="bg-gray-900 border border-gray-800 hover:border-green-500/50 rounded-lg p-4 transition-all">
                                    <h3 className="font-semibold text-white mb-2">{strat.title}</h3>
                                    <div className="text-xs text-gray-500 font-mono mb-2">{strat.filename}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
