import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import groupSelfie from "../../assets/images/grp_bit/Group.png";

export default function Hero() {
    return (
        <section className="relative h-screen min-h-[130px] w-full flex flex-col items-center overflow-hidden bg-white">

            {/* --- Background Ambient (Subtle) --- */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(120,119,198,0.1),transparent_50%)]" />

            {/* --- Main Content Container --- */}
            <div className="relative z-10 w-full max-w-[1600px] px-6 flex flex-col items-center h-full pt-20 md:pt-28">

                {/* 1. Badge (More Premium, Less Gadgety) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-6"
                >
                    <span className="px-5 py-2 rounded-full border border-slate-200 bg-white/50 backdrop-blur-sm text-slate-500 text-[11px] font-bold uppercase tracking-[0.2em] shadow-sm">
                        Est. 2026 • The Bakchodi International
                    </span>
                </motion.div>

                {/* 2. Headline (Magazine Style - Massive & Tight) */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center relative z-20"
                >
                    <h1 className="text-[12vw] md:text-[8rem] lg:text-[10rem] font-black text-slate-900 leading-[0.85] tracking-tighter flex flex-col items-center select-none">
                        <span className="block">SERIOUSLY</span>
                        <span className="block text-transparent bg-clip-text bg-gradient-to-b from-indigo-500 to-indigo-700 opacity-90">
                            UNSERIOUS.
                        </span>
                    </h1>
                </motion.div>

                {/* 3. Subtext & CTA (positioned well above the potential image head-level) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="mt-8 md:mt-10 flex flex-col items-center gap-8 relative z-30"
                >
                    <p className="hidden md:block text-slate-500 font-medium text-lg max-w-xl text-center leading-relaxed">
                        We are the architects of chaos. The engineers of entropy. <br/>
                        Building the future, one broken rule at a time.
                    </p>
                </motion.div>
            </div>

            {/* --- Hero Image (Full Width, Bottom Anchor) --- */}
            {/* Optimized for layout: Anchored bottom, absolute, taking full width. z-index managed to sit nicely. */}
            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                transition={{ delay: 0.2, duration: 1, type: "spring", damping: 20, stiffness: 90 }}
                className="absolute bottom-0 left-0 right-0 w-full z-10 flex justify-center pointer-events-none"
            >
                <img 
                    src={groupSelfie} 
                    alt="Team Group Selfie" 
                    className="w-full h-[65vh] md:h-[75vh] lg:h-[120vh] object-cover object-top drop-shadow-2xl"
                />
            </motion.div>
            
            {/* Optional Gradient Overlay at bottom to blend image if it's not a perfect cutout, 
                or to add depth. Removed for now to keep it clean 'magazine' style per user feedback. */}
        </section>
    );
}