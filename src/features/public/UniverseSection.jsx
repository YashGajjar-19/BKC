// src/features/public/UniverseSection.jsx
import { motion } from "framer-motion";
import { Globe, Rocket, Zap, Radio, Building2 } from "lucide-react";

// --- FAKE DATA ---
const EARTH_CITIES = [
    "Mumbai (HQ)", "New York", "London", "Tokyo", "Dubai", "Singapore",
    "Paris", "Berlin", "Toronto", "Sydney", "Ahmedabad", "Bangalore",
    "Los Angeles", "Hong Kong", "Moscow", "Rio de Janeiro"
];

const SPACE_BASES = [
    { name: "Mars Colony Alpha", type: "Research", icon: Rocket, desc: "Terraforming & Chaos Theory." },
    { name: "Moon Base Z", type: "Logistics", icon: Globe, desc: "Low-gravity R&D facility." },
    { name: "Titan Outpost", type: "Storage", icon: Building2, desc: "Storing infinite potential energy." },
    { name: "ISS (Acquired)", type: "Command", icon: Radio, desc: " orbital command center." },
    { name: "Saturn Ring Station", type: "Holiday", icon: Zap, desc: "Executive retreat & spa." }
];

const MULTIVERSE_LOCATIONS = [
    { name: "Earth-616", origin: "Marvel", status: "Active" },
    { name: "Gotham City", origin: "DC", status: "Surveillance" },
    { name: "Bikini Bottom", origin: "Oceanic", status: "Liquidated" },
    { name: "Hidden Leaf", origin: "Ninja World", status: "Mining" },
    { name: "The TVA", origin: "Timeline", status: "Pruned" },
    { name: "Los Santos", origin: "GTA", status: "5 Stars" },
];

export default function UniverseSection() {
    return (
        <section id="universe" className="pt-20 pb-10 overflow-hidden">

            {/* --- HERO SECTION --- */}
            <div className="relative text-center max-w-4xl mx-auto px-6 mb-32">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-widest border border-indigo-100 mb-8">
                    <Globe size={14} className="animate-pulse" />
                    Global & Galactic Presence
                </div>
                <h2 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter mb-6">
                    We are <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 animate-gradient-x">Everywhere.</span>
                </h2>
                <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
                    From the streets of Mumbai to the craters of Mars. If it exists, we have an office there.
                </p>
            </div>

            {/* --- LAYER 1: EARTH (Infinite Marquee) --- */}
            <div className="mb-40 relative group">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                <div className="py-16 bg-slate-50/50 backdrop-blur-sm border-y border-slate-100">
                    <div className="flex overflow-hidden relative">
                        <motion.div
                            className="flex gap-16 whitespace-nowrap px-12"
                            animate={{ x: ["0%", "-50%"] }}
                            transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
                        >
                            {[...EARTH_CITIES, ...EARTH_CITIES].map((city, i) => (
                                <div key={i} className="flex items-center gap-4 text-5xl font-black text-slate-200 uppercase tracking-tighter hover:text-indigo-600 transition-colors duration-500 cursor-default select-none">
                                    {city} <span className="w-3 h-3 rounded-full bg-slate-200 group-hover:bg-indigo-200 transition-colors" />
                                </div>
                            ))}
                        </motion.div>

                        {/* Fade Edges */}
                        <div className="absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                        <div className="absolute inset-y-0 right-0 w-32 md:w-64 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
                    </div>
                </div>
                <div className="text-center mt-6 text-xs font-bold uppercase tracking-widest text-slate-400">
                    Operating in 195+ Countries
                </div>
            </div>

            {/* --- LAYER 2: SPACE (Carousel) --- */}
            <div className="mb-40 max-w-7xl mx-auto px-6">
                <div className="flex items-end justify-between mb-16">
                    <h3 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
                        Off-World <span className="text-indigo-600">HQs.</span>
                    </h3>
                    <p className="text-right text-slate-500 font-bold hidden md:block uppercase tracking-widest text-xs">
                        Drag to explore <br /> solar operations
                    </p>
                </div>

                {/* Carousel Container */}
                <motion.div className="cursor-grab active:cursor-grabbing overflow-hidden -mx-6 px-6 py-10">
                    <motion.div
                        drag="x"
                        dragConstraints={{ right: 0, left: -900 }}
                        className="flex gap-8"
                    >
                        {SPACE_BASES.map((base, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -10 }}
                                className="min-w-[320px] md:min-w-[400px] bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_50px_-12px_rgba(79,70,229,0.2)] transition-all duration-500 relative overflow-hidden group select-none"
                            >
                                <div className="absolute -right-20 -top-20 w-60 h-60 bg-indigo-50/50 rounded-full blur-3xl group-hover:bg-indigo-100/50 transition-colors duration-500" />

                                <div className="relative z-10 flex flex-col h-full justify-between">
                                    <div>
                                        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl shadow-slate-900/10 group-hover:scale-110 transition-transform duration-500">
                                            <base.icon size={28} />
                                        </div>
                                        <h4 className="text-3xl font-black text-slate-900 mb-2 leading-none">{base.name}</h4>
                                        <div className="inline-block px-3 py-1 bg-slate-50 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-400 mb-6 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                                            {base.type}
                                        </div>
                                    </div>
                                    <p className="text-slate-500 font-medium text-lg leading-relaxed group-hover:text-slate-700 transition-colors">"{base.desc}"</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>

            {/* --- LAYER 3: MULTIVERSE (Bento Grid) --- */}
            <div className="max-w-7xl mx-auto px-6 relative">
                {/* Background Decor */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none mix-blend-multiply" />

                <div className="text-center mb-20 relative z-10">
                    <span className="inline-block px-4 py-1.5 bg-fuchsia-100 text-fuchsia-700 text-[10px] font-bold uppercase tracking-widest border border-fuchsia-200 rounded-full mb-6">
                        Classified Clearance Only
                    </span>
                    <h3 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter">
                        Multiverse <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-indigo-600">Expansion.</span>
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                    {MULTIVERSE_LOCATIONS.map((loc, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="bg-white/60 backdrop-blur-xl border border-white shadow-lg hover:shadow-xl hover:shadow-fuchsia-500/10 p-8 rounded-[2rem] transition-all duration-300 group cursor-default"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <h4 className="text-2xl font-black text-slate-900 group-hover:text-fuchsia-700 transition-colors">{loc.name}</h4>
                                <div className={`w-3 h-3 rounded-full ${loc.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse' : 'bg-slate-200'}`} />
                            </div>
                            <div className="flex justify-between items-end border-t border-slate-100/50 pt-6">
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-600 transition-colors">
                                    {loc.origin}
                                </span>
                                <span className="text-[10px] font-bold text-fuchsia-600 bg-fuchsia-50 px-3 py-1.5 rounded-full group-hover:bg-fuchsia-600 group-hover:text-white transition-all">
                                    {loc.status}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

        </section>
    );
}
