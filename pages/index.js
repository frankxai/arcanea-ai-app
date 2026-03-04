
import React, { useEffect, useState, Suspense } from 'react';
import Head from 'next/head';
import { motion, useScroll, useTransform } from 'framer-motion';
import ArcaneaLogo from '../src/components/ArcaneaLogo';
import dynamic from 'next/dynamic';

const ThreeScene = dynamic(() => import('../src/components/ThreeScene'), { ssr: false });
const Mascot3D = dynamic(() => import('../src/components/Mascot3D'), { ssr: false });

const LandingPage = () => {
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="min-h-screen bg-[#050510] text-white overflow-hidden selection:bg-purple-500 selection:text-white relative">
            <Head>
                <title>Arcanea | The Next Evolution of Intelligence</title>
                <meta name="description" content="Redefining AI with multi-dimensional analysis and guardian systems." />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* 3D Background Layer */}
            <Suspense fallback={null}>
                <ThreeScene />
            </Suspense>

            {/* Dynamic Overlay Effect */}
            <div
                className="fixed inset-0 pointer-events-none z-10 opacity-30 mix-blend-screen"
                style={{
                    background: `
            radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.2) 0%, transparent 60%)
          `
                }}
            />

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 py-6 backdrop-blur-md border-b border-white/5 bg-black/20">
                <div className="flex items-center gap-3">
                    <ArcaneaLogo size={32} />
                    <span className="text-xl font-bold tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 font-mono">
                        ARCANEA
                    </span>
                </div>
                <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
                    <a href="#vision" className="hover:text-white transition-colors relative group">
                        Vision
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all group-hover:w-full"></span>
                    </a>
                    <a href="#technology" className="hover:text-white transition-colors relative group">
                        Technology
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all group-hover:w-full"></span>
                    </a>
                    <a href="#guardians" className="hover:text-white transition-colors relative group">
                        Guardians
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all group-hover:w-full"></span>
                    </a>
                </div>
                <button className="px-6 py-2 rounded-full border border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-500 transition-all duration-300 text-sm backdrop-blur-sm">
                    Access Portal
                </button>
            </nav>

            {/* Hero Section */}
            <section className="relative h-screen flex flex-col justify-center items-center text-center px-4 z-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="max-w-5xl relative"
                >
                    {/* Integration of 3D Mascot */}
                    <div className="absolute -top-40 left-1/2 transform -translate-x-1/2 opacity-80 pointer-events-none">
                        <Suspense fallback={null}>
                            <Mascot3D />
                        </Suspense>
                    </div>

                    <h1 className="text-7xl md:text-9xl font-black mb-2 tracking-tighter leading-none mix-blend-overlay opacity-50 absolute top-0 left-0 right-0 pointer-events-none select-none">
                        INTELLIGENCE
                    </h1>

                    <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tight leading-tight relative mt-20">
                        Intelligence <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-indigo-400 to-cyan-400 animate-gradient-x drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                            Reimagined
                        </span>
                    </h1>

                    <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed font-light tracking-wide backdrop-blur-sm p-4 rounded-xl border border-white/5 bg-black/30">
                        The era of linear thought is over. Welcome to Arcanea—where <span className="text-cyan-400 font-bold">38 Guardian Intelligences</span> converge to synthesize reality across <span className="text-purple-400 font-bold">7 dimensions</span>.
                    </p>

                    <div className="flex gap-6 justify-center">
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(139, 92, 246, 0.6)" }}
                            whileTap={{ scale: 0.95 }}
                            className="px-10 py-4 bg-white text-black font-bold rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all flex items-center gap-2 group"
                        >
                            Start Evolution
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05, borderColor: '#06b6d4', color: '#06b6d4' }}
                            whileTap={{ scale: 0.95 }}
                            className="px-10 py-4 border border-gray-600 text-gray-300 font-medium rounded-full hover:bg-white/5 transition-all backdrop-blur-sm"
                        >
                            View Documentation
                        </motion.button>
                    </div>
                </motion.div>

                {/* Floating Scroll Indicator */}
                <motion.div
                    style={{ y }}
                    className="absolute bottom-10 opacity-70 pointer-events-none flex flex-col items-center gap-2"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <span className="text-xs tracking-[0.3em] text-gray-500 uppercase">Scroll to Explore</span>
                    <div className="w-px h-12 bg-gradient-to-b from-purple-500 to-transparent"></div>
                </motion.div>
            </section>

            {/* Feature Grid with Glassmorphism */}
            <section id="technology" className="py-32 px-4 relative z-20">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {[
                            { title: "Multi-Dimensional", desc: "Analyzing data across 7 distinct vectors of truth simultaneously, revealing hidden patterns invisible to linear AI.", color: "from-purple-500 to-indigo-600", icon: "🌌" },
                            { title: "Guardian System", desc: "38 specialized autonomous agents working in perfect harmony, each a master of its own domain.", color: "from-cyan-500 to-teal-600", icon: "🛡️" },
                            { title: "Hyper-Speed Synthesis", desc: "Instantaneous fusion of complex knowledge graphs into actionable intelligence.", color: "from-fuchsia-500 to-pink-600", icon: "⚡" }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -15, scale: 1.02 }}
                                className="group relative p-10 rounded-3xl bg-[#0e0e12]/80 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl hover:shadow-[0_0_50px_rgba(139,92,246,0.2)] transition-all duration-500"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                                <div className="text-4xl mb-6 bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 group-hover:border-white/30 transition-colors">
                                    {feature.icon}
                                </div>

                                <h3 className="text-2xl font-bold mb-4 font-mono tracking-tight">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed group-hover:text-gray-200 transition-colors">{feature.desc}</p>

                                {/* Decorative Elements */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full pointer-events-none" />
                                <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 border-t border-white/5 text-center text-gray-500 text-sm relative z-20 bg-black/80 backdrop-blur-md">
                <div className="max-w-4xl mx-auto px-4">
                    <ArcaneaLogo size={48} className="mx-auto mb-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500" />
                    <p className="mb-4">© 2026 Arcanea Inc. Building the future of cognition.</p>
                    <div className="flex justify-center gap-6 text-xs uppercase tracking-widest text-gray-600">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">System Status</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
