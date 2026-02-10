import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import
    {
        Github, Twitter, Instagram, Heart,
        ArrowUpRight, Globe, Zap, Activity
    } from "lucide-react";
import logo from '../../assets/images/grp_bit/Logo.png';

const Footer = () =>
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
                { name: "Twitter", href: "/#", icon: Twitter },
                { name: "GitHub", href: "/#", icon: Github },
                { name: "Instagram", href: "/#", icon: Instagram },
            ]
        }
    ];

    return (
        <footer className="bg-white border-t border-slate-200 pt-20 pb-10 relative overflow-hidden">

            {/* --- Pixel 17 decoration --- */ }
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">

                    {/* Brand Column (Span 5) */ }
                    <div className="lg:col-span-5 space-y-8">
                        <div className="flex items-center gap-4">
                            <motion.div
                                whileHover={ { rotate: 180 } }
                                transition={ { duration: 0.6, ease: "anticipate" } }
                                className="w-15 h-15 rounded-xl bg-slate-900 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20"
                            >
                                <img src={ logo } alt="Logo" className="w-12 h-12 object-contain" />
                            </motion.div>
                            <div>
                                <h2 className="font-display text-2xl font-bold text-slate-900 tracking-tight leading-none">
                                    Bakchodi <br />
                                    <span className="text-slate-400">International.</span>
                                </h2>
                            </div>
                        </div>

                        <p className="text-slate-500 text-lg max-w-sm leading-relaxed">
                            We do bakchodi, masti, and make the unexpected happen.
                            <span className="text-slate-900 font-medium block mt-2">The world is boring; we make it interesting.</span>
                        </p>

                        <div className="flex flex-wrap items-center gap-3">
                            <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Systems Normal
                            </span>
                            <span className="px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                <Globe size={ 12 } />
                                Global - Earth
                            </span>
                        </div>
                    </div>

                    {/* Links Columns (Span 4) */ }
                    <div className="lg:col-span-4 grid grid-cols-2 gap-8">
                        { footerLinks.slice( 0, 2 ).map( ( section, idx ) => (
                            <div key={ idx } className="space-y-6">
                                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">{ section.title }</h4>
                                <ul className="space-y-4">
                                    { section.links.map( ( link, lIdx ) => (
                                        <li key={ lIdx }>
                                            <a
                                                href={ link.href }
                                                className="group inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors text-sm font-medium"
                                            >
                                                { link.name }
                                                {/* <ArrowUpRight size={12} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" /> */ }
                                            </a>
                                        </li>
                                    ) ) }
                                </ul>
                            </div>
                        ) ) }
                    </div>

                    {/* Newsletter & Action (Span 3) */ }
                    <div className="lg:col-span-3 space-y-8">

                        {/* System Status Card (Replaces Newsletter) */ }
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-5 transition-all hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Activity size={ 18 } className="text-indigo-500" />
                                    <h4 className="font-bold text-slate-900 text-sm">System Status</h4>
                                </div>
                                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-50 border border-emerald-100">
                                    <span className="relative flex h-1.5 w-1.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                                    </span>
                                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">Live</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Metric 1 */ }
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-medium text-slate-500">
                                        <span>Core Stability</span>
                                        <span className="text-indigo-600 font-bold">98.2%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={ { width: 0 } }
                                            whileInView={ { width: "98.2%" } }
                                            transition={ { duration: 1.5, ease: "easeOut" } }
                                            className="h-full bg-indigo-500 rounded-full relative"
                                        >
                                            <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Metric 2 */ }
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-medium text-slate-500">
                                        <span>Global Entropy</span>
                                        <span className="text-pink-600 font-bold">Critical</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={ { width: 0 } }
                                            whileInView={ { width: "85%" } }
                                            transition={ { duration: 1.5, ease: "easeOut", delay: 0.2 } }
                                            className="h-full bg-pink-500 rounded-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* High Voltage Card */ }
                        <div className="group relative overflow-hidden rounded-2xl bg-amber-50 border border-amber-100 p-5 transition-all hover:shadow-lg hover:shadow-amber-500/10 cursor-none">
                            <div className="flex items-center gap-3 relative z-10">
                                <div className="p-2.5 bg-white rounded-lg shadow-sm text-amber-500">
                                    <Zap size={ 18 } fill="currentColor" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 text-sm">High Voltage</p>
                                    <p className="text-amber-600/80 text-xs">Handle with care</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="h-px w-full bg-slate-100 mb-8" />

                <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm">
                    <p className="text-slate-500 font-medium">
                        &copy; { currentYear } Bakchodi International.
                    </p>

                    <div className="flex items-center gap-6">
                        <div className="flex gap-4">
                            { footerLinks[ 2 ].links.map( ( social, idx ) => (
                                <a key={ idx } href={ social.href } className="text-slate-400 hover:text-slate-900 transition-colors">
                                    { social.icon && <social.icon size={ 18 } /> }
                                </a>
                            ) ) }
                        </div>
                        <div className="h-4 w-px bg-slate-200 hidden md:block" />
                        <p className="text-slate-500 flex items-center gap-1.5">
                            Built by <span className="font-bold text-slate-900">Antigravity</span>
                        </p>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
