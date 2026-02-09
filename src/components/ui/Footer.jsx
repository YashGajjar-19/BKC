import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    Github, Twitter, Instagram, Heart,
    ArrowUpRight, Globe, Zap
} from "lucide-react";
import logo from '../../assets/images/grp_bit/Logo.png';

export default function Footer ()
{
    const currentYear = new Date().getFullYear();

    const footerLinks = [
        {
            title: "Explore",
            links: [
                { name: "The Universe", href: "/#universe" },
                { name: "Our Crew", href: "/#crew" },
                { name: "Mission Control", href: "/dashboard" },
                { name: "Join Us", href: "/career" },
            ]
        },
        {
            title: "Legal",
            links: [
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms of Chaos", href: "/terms" },
                { name: "Code of Conduct", href: "/conduct" },
            ]
        },
        {
            title: "Connect",
            links: [
                { name: "Twitter", href: "#", icon: Twitter },
                { name: "GitHub", href: "#", icon: Github },
                { name: "Instagram", href: "#", icon: Instagram },
            ]
        }
    ];

    return (
        <footer className="bg-slate-900 pt-24 pb-12 relative overflow-hidden">
            {/* --- Ambient Background --- */ }
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* --- Top Section: Brand & Newsletter --- */ }
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">

                    {/* Brand */ }
                    <div className="space-y-6">
                        <motion.div
                            initial={ { opacity: 0, y: 20 } }
                            whileInView={ { opacity: 1, y: 0 } }
                            viewport={ { once: true } }
                            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 overflow-hidden"
                        >
                            <img src={logo} alt="Logo" className="w-full h-full object-cover" />
                        </motion.div>

                        <div>
                            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
                                Bakchodi <span className="text-slate-500">International.</span>
                            </h2>
                            <p className="text-slate-400 text-lg max-w-md leading-relaxed">
                                We engineer chaos, design disorder, and code the unexpected.
                                The world is boring; we are the glitch.
                            </p>
                        </div>

                        <div className="flex items-center gap-4 pt-4">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50 text-emerald-400 text-xs font-bold uppercase tracking-widest">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Systems Normal
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50 text-indigo-400 text-xs font-bold uppercase tracking-widest">
                                <Globe size={ 12 } />
                                Global - Earth
                            </div>
                        </div>
                    </div>

                    {/* Newsletter / CTA */ }
                    <div className="lg:pl-12">
                        <div className="bg-slate-800/30 border border-slate-700/50 rounded-[2rem] p-8 md:p-10 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <h3 className="text-xl font-bold text-white mb-2 relative z-10">Stay in the Loop</h3>
                            <p className="text-slate-400 mb-6 relative z-10">Get the latest updates on our chaotic experiments.</p>

                            <form className="flex gap-2 relative z-10" onSubmit={ ( e ) => e.preventDefault() }>
                                <input
                                    type="email"
                                    placeholder="agent@chaos.com"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                                />
                                <button className="px-5 bg-white text-slate-900 rounded-xl font-bold hover:bg-indigo-50 transition-colors flex items-center justify-center">
                                    <ArrowUpRight size={ 20 } />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* --- Divider --- */ }
                <div className="h-px w-full bg-slate-800 mb-16" />

                {/* --- Links Grid --- */ }
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-20">
                    { footerLinks.map( ( section, idx ) => (
                        <div key={ idx } className="space-y-6">
                            <h4 className="text-sm font-bold text-white uppercase tracking-widest">{ section.title }</h4>
                            <ul className="space-y-4">
                                { section.links.map( ( link, lIdx ) => (
                                    <li key={ lIdx }>
                                        <a
                                            href={ link.href }
                                            className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
                                        >
                                            { link.icon && <link.icon size={ 16 } className="group-hover:text-indigo-400 transition-colors" /> }
                                            { link.name }
                                        </a>
                                    </li>
                                ) ) }
                            </ul>
                        </div>
                    ) ) }

                    {/* Extra Column: Badge */ }
                    <div className="col-span-2 md:col-span-1 flex flex-col items-start justify-start">
                        <div className="w-full aspect-square rounded-[2rem] bg-slate-800/50 border border-slate-700/50 flex flex-col items-center justify-center text-center p-6 relative overflow-hidden group cursor-pointer hover:border-indigo-500/30 transition-colors">
                            <Zap size={ 40 } className="text-slate-600 group-hover:text-yellow-400 transition-colors mb-4" />
                            <p className="text-slate-300 font-bold mb-1">High Voltage</p>
                            <p className="text-slate-500 text-xs">Handle with care.</p>
                        </div>
                    </div>
                </div>

                {/* --- Bottom Bar --- */ }
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-800 text-sm">
                    <p className="text-slate-500 font-medium">
                        &copy; { currentYear } Bakchodi International. All wrongs reserved.
                    </p>

                    <div className="flex items-center gap-6">
                        <p className="text-slate-600 flex items-center gap-1.5">
                            Made with <Heart size={ 12 } className="text-rose-600 fill-rose-600" /> by <span className="text-slate-400 font-bold hover:text-white transition-colors cursor-pointer">Antigravity</span>
                        </p>
                    </div>
                </div>

            </div>
        </footer>
    );
}
