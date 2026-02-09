// src/features/public/Hero.jsx
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative h-screen min-h-[850px] flex items-center justify-center overflow-hidden bg-slate-50">

            <div className="max-w-7xl mx-auto px-6 text-center space-y-10 relative z-10">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-indigo-100 shadow-sm transition-transform hover:scale-105 cursor-default"
                >
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-900">
                        The Bakchodi International
                    </span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.6 }}
                >
                    <h1 className="text-7xl md:text-9xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-4">
                        SERIOUSLY <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 animate-gradient-x">
                            UNSERIOUS.
                        </span>
                    </h1>
                </motion.div>
                
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-xl md:text-2xl text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed"
                >
                    Pioneering the future of organized chaos since 2026. 
                    <br className="hidden md:block" />
                    We build things that break things, beautifully.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
                >
                    <button className="group relative px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-lg overflow-hidden transition-all hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-1">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="relative z-10 flex items-center gap-2">
                            Start Chaos <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                    </button>
                    
                    <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-bold text-lg hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm hover:shadow-xl hover:-translate-y-1">
                        View The Team
                    </button>
                </motion.div>
            </div>
            
        </section>
    );
}