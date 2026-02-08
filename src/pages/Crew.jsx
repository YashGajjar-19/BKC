// src/pages/Crew.jsx
import PublicLayout from "../components/layouts/PublicLayout";
import TeamGrid from "../features/public/TeamGrid";
import { motion } from "framer-motion";

export default function Crew ()
{
    return (
        <PublicLayout>
            {/* Page Header / Hero for Crew */ }
            <section className="relative pt-20 pb-10 text-center">
                {/* Background Decoration */ }
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-50/50 rounded-full blur-3xl -z-10" />
            </section>

            <TeamGrid />

            {/* Call to Action */ }
            <section className="py-20 text-center">
                <motion.div
                    initial={ { opacity: 0, scale: 0.95 } }
                    whileInView={ { opacity: 1, scale: 1 } }
                    className="bg-slate-900 text-white rounded-[2.5rem] p-12 max-w-4xl mx-auto relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />

                    <h2 className="text-3xl md:text-5xl font-black mb-6 relative z-10">Think you have what it takes?</h2>
                    <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto relative z-10">
                        We are always looking for the next agent of chaos. If you are serious about being unserious, join us.
                    </p>
                    <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-indigo-50 transition-colors relative z-10">
                        Apply for Membership
                    </button>
                </motion.div>
            </section>
        </PublicLayout>
    );
}