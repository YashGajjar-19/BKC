// src/features/public/Hero.jsx
import { motion } from "framer-motion";

export default function Hero() {
    return (
        <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">

            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-50 to-white -z-10" />
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent" />

            <div className="max-w-5xl mx-auto px-6 text-center space-y-8">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-widest border border-purple-200"
                >
                    <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                    Hiring Pranksters
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9]"
                >
                    SERIOUSLY <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                        UNSERIOUS.
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed"
                >
                    Pioneering the future of organized chaos since 2026.
                    We take nothing seriously, except our jokes.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:scale-105 hover:bg-purple-600 transition-all shadow-xl shadow-purple-900/20">
                        Start Chaos
                    </button>
                    <button className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all">
                        View Our Team
                    </button>
                </motion.div>
            </div>

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-indigo-50/80 via-purple-50/50 to-transparent blur-3xl -z-10 rounded-[100%]" />
            </div>

            
        </section>
    );
}