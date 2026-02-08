import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { LogIn, Menu, X, Rocket, Users, Globe } from 'lucide-react';

export default function Header() {
    const { user } = useAuth();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Scroll Effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/', icon: Globe },
        { name: 'Universe', path: '/universe', icon: Rocket },
        { name: "The Crew", path: "/#crew", icon: Users },
    ];

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300 ${
                    scrolled ? 'pt-4' : 'pt-6'
                }`}
            >
                {/* 
                   Dynamic Width Container 
                   - Full width on mobile/scroll? No, let's keep it floating island style mostly.
                   - On scroll, it becomes a bit wider and more opaque.
                */}
                <div 
                    className={`relative transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex items-center justify-between ${
                        scrolled 
                            ? 'w-[90%] max-w-[80rem] bg-white/70 backdrop-blur-xl border border-white/40 shadow-sm rounded-full py-2 px-3 md:px-4' 
                            : 'w-[95%] max-w-6xl bg-transparent border-transparent py-4 px-0'
                    }`}
                >
                    
                    {/* --- Logo Area --- */}
                    <div className="flex items-center gap-0">
                         <Link to="/" className={`flex items-center gap-3 group px-4 py-2 ${!scrolled && 'bg-white/40 backdrop-blur-md rounded-full border border-white/40 ring-1 ring-white/50 shadow-sm'}`}>
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center font-black text-lg group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-inner">
                                B
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="font-black text-slate-900 tracking-tight text-sm">BAKCHODI</span>
                                <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase group-hover:text-indigo-600 transition-colors">International</span>
                            </div>
                         </Link>
                    </div>

                    {/* --- Desktop Navigation (Floating Pill) --- */}
                    <nav className={`hidden md:flex items-center gap-1 p-1.5 rounded-full border border-white/20 shadow-sm transition-all duration-300 ${
                        !scrolled ? 'bg-white/40 backdrop-blur-xl ring-1 ring-white/60' : 'bg-transparent shadow-none border-transparent'
                    }`}>
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            const Icon = link.icon;
                            
                            return (
                                <Link 
                                    key={link.name} 
                                    to={link.path}
                                    className={`relative px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 group overflow-hidden ${
                                        isActive 
                                            ? 'text-white shadow-md shadow-indigo-500/20' 
                                            : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                                    }`}
                                >
                                    {isActive && (
                                        <motion.div 
                                            layoutId="navbar-active"
                                            className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full z-0"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10 flex items-center gap-2">
                                        <Icon size={16} strokeWidth={2.5} className={`transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-6`} />
                                        {link.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* --- Auth / User User (Right Side) --- */}
                    <div className="flex items-center gap-3">
                         {/* Theme Toggle or Extra Action could go here */}
                         
                         {user ? (
                            <Link to="/dashboard" className="flex items-center gap-2 pl-1 pr-4 py-1 rounded-full bg-white/50 border border-white/60 hover:bg-white hover:border-indigo-100 transition-all group backdrop-blur-md shadow-sm">
                                <img src={user.image} alt="User" className="w-9 h-9 rounded-full border-2 border-white shadow-sm group-hover:scale-105 transition-transform" />
                                <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 hidden md:block">
                                    {user.name.split(' ')[0]}
                                </span>
                            </Link>
                         ) : (
                             <Link 
                                to="/login"
                                className="relative overflow-hidden px-6 py-2.5 rounded-full bg-slate-900 text-white text-sm font-bold shadow-lg shadow-slate-900/20 group hover:shadow-indigo-500/30 transition-all hover:-translate-y-0.5"
                             >
                                 <span className="relative z-10 flex items-center gap-2">
                                     Login <ArrowUpRight size={14} />
                                 </span>
                                 <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                             </Link>
                         )}

                        {/* Mobile Menu Button */}
                        <button 
                            onClick={() => setMobileMenuOpen(true)}
                            className="md:hidden p-3 bg-white/50 backdrop-blur-md rounded-full text-slate-700 hover:bg-white transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                    </div>

                </div>
            </motion.header>

            {/* --- Mobile Menu Overlay --- */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[60]"
                        />
                        <motion.div
                            initial={{ y: "-100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed top-0 left-0 right-0 z-[70] bg-white rounded-b-[2.5rem] p-6 shadow-2xl border-b border-indigo-50"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-2">
                                     <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">B</div>
                                     <span className="font-black text-lg text-slate-900">Menu</span>
                                </div>
                                <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-500">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="grid gap-3">
                                {navLinks.map((link) => (
                                    <Link 
                                        key={link.name}
                                        to={link.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50 font-bold text-slate-600 hover:text-indigo-600 transition-all group"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 group-hover:text-indigo-500 shadow-sm border border-slate-100 group-hover:border-indigo-100 transition-colors">
                                            <link.icon size={20} />
                                        </div>
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

// Helper component for Icon (since we modified the import)
function ArrowUpRight({ size = 16, className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M7 7h10v10" />
            <path d="M7 17 17 7" />
        </svg>
    )
}