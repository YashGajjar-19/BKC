// src/features/public/Hero.jsx
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";
import groupSelfie from "../../assets/images/grp_bit/Group.png";

export default function Hero ()
{
    const { scrollY } = useScroll();

    // Parallax: Text moves slightly slower than scroll to create depth
    const yText = useTransform( scrollY, [ 0, 500 ], [ 0, 150 ] );

    return (
        <section className="relative h-screen w-full flex flex-col items-center overflow-hidden bg-white">

            {/* --- BACKGROUND TEXTURE (Subtle) --- */ }
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(120,119,198,0.1),transparent_50%)]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-multiply" />
            </div>

            {/* --- MAIN CONTENT (Z-10 to sit behind image if needed, or adjust z-index to 30 to sit on top) --- */ }
            <motion.div
                style={ { y: yText } }
                className="relative z-0 w-full max-w-[1600px] px-6 flex flex-col items-center justify-center h-full pb-40 md:justify-start md:pt-32 md:pb-0"
            >
                {/* Badge */ }
                <motion.div
                    initial={ { opacity: 0, y: 20 } }
                    animate={ { opacity: 1, y: 0 } }
                    transition={ { duration: 0.6 } }
                    className="mb-6 md:mb-8"
                >
                    <span className="px-5 py-2 rounded-full border border-slate-200 bg-white/50 backdrop-blur-sm text-slate-500 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] shadow-sm flex items-center gap-2">
                        <Sparkles size={ 12 } className="text-indigo-500" />
                        Est. 2026 • Bakchodi Intl.
                    </span>
                </motion.div>

                {/* HEADLINE: The Magazine Look */ }
                <motion.div
                    initial={ { opacity: 0, y: 30 } }
                    animate={ { opacity: 1, y: 0 } }
                    transition={ { delay: 0.1, duration: 0.8, ease: [ 0.22, 1, 0.36, 1 ] } }
                    className="text-center relative z-20 flex flex-col items-center"
                >
                    <span className="block text-[15vw] sm:text-[12vw] md:text-[8rem] lg:text-[10rem] font-black text-slate-900 leading-[0.85] tracking-tighter select-none mix-blend-tighten">
                        SERIOUSLY
                    </span>
                    <span className="block text-[15vw] sm:text-[12vw] md:text-[8rem] lg:text-[10rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-indigo-500 to-indigo-700 opacity-90 leading-[0.85] tracking-tighter select-none">
                        UNSERIOUS.
                    </span>
                </motion.div>

                {/* Subtext */ }
                <motion.p
                    initial={ { opacity: 0 } }
                    animate={ { opacity: 1 } }
                    transition={ { delay: 0.3 } }
                    className="mt-6 md:mt-8 text-slate-500 font-medium text-sm md:text-lg max-w-xs md:max-w-xl text-center leading-relaxed px-4"
                >
                    We are the architects of chaos. The engineers of entropy. <br className="hidden md:block" />
                    Building the future, one broken rule at a time.
                </motion.p>
            </motion.div>

            {/* --- HERO IMAGE (Strictly Preserved) --- */ }
            <motion.div
                initial={ { y: "100%" } }
                animate={ { y: "0%" } }
                transition={ { delay: 0.2, duration: 1, type: "spring", damping: 20, stiffness: 90 } }
                className="absolute bottom-0 left-0 right-0 w-full z-10 flex justify-center pointer-events-none"
            >
                {/* EXACT classes from your inspiration file */ }
                <img
                    src={ groupSelfie }
                    alt="Team Group Selfie"
                    className="w-full h-[60vh] sm:h-[65vh] md:h-[75vh] lg:h-[120vh] object-cover object-top drop-shadow-2xl"
                />
            </motion.div>

            {/* --- SCROLL HINT (Floating on top of image) --- */ }
            <motion.div
                initial={ { opacity: 0 } }
                animate={ { opacity: 1, y: [ 0, 10, 0 ] } }
                transition={ { delay: 1, duration: 2, repeat: Infinity } }
                className="absolute bottom-10 z-30 text-white drop-shadow-md"
            >
                <ArrowDown size={ 32 } />
            </motion.div>

        </section>
    );
}