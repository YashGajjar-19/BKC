// src/features/public/HomeTeam.jsx
import { motion } from "framer-motion";
import { members } from "../../data";
import { Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MagicBento from "../../components/ui/MagicBento";

export default function HomeTeam ()
{
    const navigate = useNavigate();

    // Transform members data for the MagicBento component
    const bentoItems = members.map( member => ( {
        id: member.id,
        title: member.name,
        description: member.description,
        label: member.role.split( '&' )[ 0 ].trim(), // Taking the first part of the role
        color: '#ffffff', // Light theme background (though handled by CSS mostly)
        image: member.image
    } ) );

    return (
        <section id="crew" className="py-32 relative overflow-hidden bg-slate-50">
            {/* Background Decor - Subtle Grids */ }
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            <div className="max-w-[80rem] mx-auto px-6 relative z-10">

                {/* Section Header */ }
                <div className="text-center mb-20 space-y-6">
                    <motion.div
                        initial={ { opacity: 0, y: 20 } }
                        whileInView={ { opacity: 1, y: 0 } }
                        viewport={ { once: true } }
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-widest border border-indigo-100 shadow-sm"
                    >
                        <Crown size={ 12 } />
                        The Legends
                    </motion.div>

                    <motion.h2
                        initial={ { opacity: 0, y: 20 } }
                        whileInView={ { opacity: 1, y: 0 } }
                        viewport={ { once: true } }
                        transition={ { delay: 0.1 } }
                        className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter"
                    >
                        Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600">Minds.</span>
                    </motion.h2>

                    <motion.p
                        initial={ { opacity: 0 } }
                        whileInView={ { opacity: 1 } }
                        viewport={ { once: true } }
                        transition={ { delay: 0.2 } }
                        className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed"
                    >
                        The brilliant minds behind the chaos. Select a profile to authenticate and access the command center.
                    </motion.p>
                </div>

                {/* The Magic Bento Grid */ }
                <div className="w-full flex justify-center">
                    <div className="w-full max-w-[1400px]">
                        <MagicBento
                            items={ bentoItems }
                            textAutoHide={ false } // Keep text visible
                            enableStars={ true }
                            enableSpotlight={ true }
                            enableBorderGlow={ true } // Enhanced border glow
                            enableTilt={ true }
                            enableMagnetism={ true }
                            clickEffect={ true }
                            spotlightRadius={ 400 } // Larger spotlight
                            particleCount={ 20 } // More particles
                            glowColor="132, 0, 255" // The requested purple glow
                            disableAnimations={ false }
                            onCardClick={ ( item ) => navigate( `/profile/${ item.id }` ) }
                        />
                    </div>
                </div>

            </div>
        </section>
    );
}