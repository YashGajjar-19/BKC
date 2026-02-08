// src/features/public/TeamGrid.jsx
import { motion } from "framer-motion";
import { members } from "../../data";
import { Sparkles, Crown, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TeamGrid ()
{
    const navigate = useNavigate();

    return (
        <section className="py-20 relative">
            <div className="max-w-7xl mx-auto">

                {/* Section Header */ }
                <div className="text-center mb-20 space-y-4">
                    <motion.div
                        initial={ { opacity: 0, y: 20 } }
                        whileInView={ { opacity: 1, y: 0 } }
                        viewport={ { once: true } }
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-widest border border-indigo-100 mb-4"
                    >
                        <Crown size={ 12 } />
                        Hall of Fame
                    </motion.div>
                    <motion.h2
                        initial={ { opacity: 0, y: 20 } }
                        whileInView={ { opacity: 1, y: 0 } }
                        viewport={ { once: true } }
                        transition={ { delay: 0.1 } }
                        className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter"
                    >
                        The <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600">Legends.</span>
                    </motion.h2>
                    <motion.p
                        initial={ { opacity: 0 } }
                        whileInView={ { opacity: 1 } }
                        viewport={ { once: true } }
                        transition={ { delay: 0.2 } }
                        className="text-xl text-slate-500 max-w-2xl mx-auto font-medium"
                    >
                        The brilliant minds behind the chaos. Select a profile to access the command center.
                    </motion.p>
                </div>

                {/* The Grid */ }
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                    { members.map( ( member, idx ) => (
                        <motion.div
                            key={ member.id }
                            initial={ { opacity: 0, y: 30 } }
                            whileInView={ { opacity: 1, y: 0 } }
                            viewport={ { once: true } }
                            transition={ { delay: idx * 0.1 } }
                            whileHover={ { y: -10 } }
                            onClick={ () => navigate( "/login" ) }
                            className="group relative bg-white rounded-[2.5rem] p-2 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 cursor-pointer overflow-hidden"
                        >
                            {/* Card Image Area */ }
                            <div className="relative h-64 w-full rounded-[2rem] overflow-hidden mb-4">
                                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors z-10" />
                                <img
                                    src={ member.image }
                                    alt={ member.name }
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                {/* Floating Action Button */ }
                                <div className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                                    <ArrowUpRight size={ 18 } className="text-indigo-600" />
                                </div>
                            </div>

                            {/* Card Content */ }
                            <div className="px-4 pb-6 text-center relative z-20">
                                <h3 className="text-xl font-black text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                                    { member.name }
                                </h3>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">
                                    { member.role }
                                </p>

                                <div className="h-px w-12 bg-slate-100 mx-auto mb-4 group-hover:w-full group-hover:bg-indigo-100 transition-all duration-500" />

                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-wider group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                    <Sparkles size={ 10 } />
                                    { member.title }
                                </div>
                            </div>

                            {/* Hover Glow Gradient */ }
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        </motion.div>
                    ) ) }
                </div>
            </div>
        </section>
    );
}