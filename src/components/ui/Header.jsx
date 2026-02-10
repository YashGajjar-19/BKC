// src/components/ui/Header.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, Rocket, Users, Globe, ArrowUpRight, MessageSquare } from 'lucide-react';
import logo from '../../assets/images/grp_bit/Logo.png';

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
        { name: "Universe", path: "/#universe", icon: Rocket },
        { name: "The Crew", path: "/#crew", icon: Users },
    ];

    const handleNavClick = (e, path) => {
        if (path.includes('#')) {
            const targetId = path.split('#')[1];
            if (location.pathname === '/') {
                e.preventDefault();
                const element = document.getElementById(targetId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        } else if (path === '/' && location.pathname === '/') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        setMobileMenuOpen(false);
    };

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300 pointer-events-none ${
                    scrolled ? 'pt-4' : 'pt-6'
                }`}
            >
                <div 
                    className={`relative pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex items-center justify-between ${
                        scrolled 
                            ? 'w-[90%] max-w-[80rem] bg-white/80 backdrop-blur-xl border border-white/40 shadow-lg shadow-slate-200/20 rounded-full py-2 px-3 md:px-4' 
                            : 'w-[95%] max-w-7xl bg-transparent border-transparent py-4 px-0'
                    }`}
                >
                    {/* --- Logo Area --- */}
                    <Link 
                        to="/" 
                        className={`flex items-center gap-3 group px-4 py-2 rounded-full transition-all ${
                            !scrolled ? 'bg-white/30 backdrop-blur-md border border-white/20 shadow-sm hover:bg-white/50' : ''
                        }`}
                    >
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center font-black text-lg group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-lg shadow-indigo-500/20">
                            B
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="font-black text-slate-900 tracking-tight text-sm">BAKCHODI</span>
                            <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase group-hover:text-indigo-600 transition-colors">International</span>
                        </div>
                    </Link>

                    {/* --- Desktop Navigation --- */}
                    <nav className={`hidden md:flex items-center gap-1 p-1 rounded-full transition-all duration-300 ${
                        !scrolled ? 'bg-white/30 backdrop-blur-md border border-white/20 shadow-sm' : ''
                    }`}>
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path || (link.path.includes('#') && location.hash === '#' + link.path.split('#')[1]);
                            const Icon = link.icon;
                            
                            return (
                                <Link 
                                    key={link.name} 
                                    to={link.path}
                                    onClick={(e) => handleNavClick(e, link.path)}
                                    className={`relative px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 group ${
                                        isActive ? 'text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                                    }`}
                                >
                                    {isActive && (
                                        <motion.div 
                                            layoutId="navbar-active"
                                            className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full shadow-lg shadow-indigo-500/30"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10 flex items-center gap-2">
                                        <Icon size={16} strokeWidth={2.5} className={`transition-transform duration-300 ${isActive ? '' : 'group-hover:-translate-y-0.5'}`} />
                                        {link.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* --- Auth / Mobile Toggle --- */}
                    <div className="flex items-center gap-3">
                         {user ? (
                            <div className="flex items-center gap-3">
                                <Link to="/chat" className="p-2.5 rounded-full bg-slate-900 text-white hover:bg-indigo-600 transition-colors shadow-lg shadow-slate-900/20 active:scale-95">
                                    <MessageSquare size={18} />
                                </Link>
                                <Link to="/dashboard" className="flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-white border border-slate-100 hover:border-indigo-100 hover:shadow-md transition-all group">
                                <img src={user.image || `https://ui-avatars.com/api/?name=${user.name}`} alt="User" className="w-9 h-9 rounded-full border border-slate-100 object-cover" />
                                <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 hidden md:block">
                                    {user.name.split(' ')[0]}
                                </span>
                            </Link>
                            </div>
                         ) : (
                             <Link 
                                to="/login"
                                className="group relative overflow-hidden px-6 py-2.5 rounded-full bg-slate-900 text-white text-sm font-bold shadow-xl shadow-slate-900/20 hover:shadow-indigo-500/30 transition-all hover:-translate-y-0.5"
                             >
                                 <span className="relative z-10 flex items-center gap-2 group-hover:gap-3 transition-all">
                                     Login <ArrowUpRight size={16} />
                                 </span>
                                 <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                             </Link>
                         )}

                        <button 
                            onClick={() => setMobileMenuOpen(true)}
                            className="md:hidden p-3 bg-white/80 backdrop-blur-md rounded-full text-slate-700 hover:bg-white hover:text-indigo-600 transition-all shadow-sm"
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
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl z-[60]"
                        />
                        <motion.div
                            initial={{ y: "-100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 right-0 z-[70] bg-white rounded-b-[3rem] p-6 shadow-2xl border-b border-indigo-50 overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                     <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-indigo-500/30 overflow-hidden">
                                         <img src={logo} alt="Logo" className="w-full h-full object-cover" />
                                     </div>
                                     <span className="font-black text-xl text-slate-900 tracking-tight">Navigation</span>
                                </div>
                                <button onClick={() => setMobileMenuOpen(false)} className="p-3 bg-slate-50 rounded-full hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>
                            
                            <div className="space-y-2">
                                {navLinks.map((link) => (
                                    <Link 
                                        key={link.name}
                                        to={link.path}
                                        onClick={(e) => handleNavClick(e, link.path)}
                                        className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50 font-bold text-slate-600 hover:text-indigo-600 transition-all group"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-slate-400 group-hover:text-indigo-600 shadow-sm border border-slate-100 group-hover:border-indigo-200 transition-all group-hover:scale-110">
                                            <link.icon size={24} />
                                        </div>
                                        <span className="text-lg">{link.name}</span>
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