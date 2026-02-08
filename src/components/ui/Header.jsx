import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { User, LogIn, Menu, X, Rocket, Users, Globe } from 'lucide-react';

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
        { name: 'The Crew', path: '/crew', icon: Users },
    ];

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500 pointer-events-none ${scrolled ? 'pt-4' : 'pt-8'}`}
            >
                <div className="pointer-events-auto relative group">
                    
                    {/* --- Animated Glow Under-bar --- */}
                    {/* Replicating the Login.jsx gradient colors: #00C6FF (Cyan), #9D00FA (Purple), #0055FF (Deep Blue), #FF5ACD (Pink) */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00C6FF] via-[#9D00FA] to-[#FF5ACD] rounded-full blur-md opacity-40 group-hover:opacity-80 transition duration-500 animate-gradient-xy"></div>
                    
                    {/* --- Main Glass Navbar --- */}
                    <nav className={`
                        relative flex items-center justify-between
                        bg-white/90 backdrop-blur-xl border border-white/60
                        rounded-full shadow-lg shadow-indigo-500/10
                        transition-all duration-500 ease-out
                        ${scrolled ? 'px-6 py-3 scale-95' : 'px-8 py-4 scale-100'}
                        gap-4 md:gap-12
                    `}>
                        
                        {/* 1. Logo */}
                        <Link to="/" className="flex items-center gap-2 font-black text-xl tracking-tight text-slate-900 group/logo">
                            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center group-hover/logo:scale-110 transition-transform bg-gradient-to-br from-slate-900 to-indigo-900">
                                B
                            </div>
                            <span className="hidden md:block">BAKCHODI <span className="text-indigo-600">INTL.</span></span>
                        </Link>

                        {/* 2. Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => {
                                const isActive = location.pathname === link.path;
                                const Icon = link.icon;
                                
                                return (
                                    <Link 
                                        key={link.name} 
                                        to={link.path}
                                        className="relative px-5 py-2 rounded-full text-sm font-bold transition-all hover:bg-slate-100 overflow-hidden group/link"
                                    >
                                        <span className={`relative z-10 flex items-center gap-2 ${isActive ? 'text-indigo-600' : 'text-slate-600 group-hover/link:text-slate-900'}`}>
                                            {link.name}
                                        </span>
                                        {isActive && (
                                            <motion.div 
                                                layoutId="activeTab"
                                                className="absolute inset-0 bg-indigo-50 rounded-full"
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* 3. Auth Action */}
                        <div className="flex items-center gap-4">
                            {user ? (
                                <Link 
                                    to="/dashboard" 
                                    className="flex items-center gap-2 pl-1 pr-4 py-1 rounded-full bg-slate-100/50 border border-slate-200 hover:border-indigo-200 hover:bg-white transition-all group/user"
                                >
                                    <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white">
                                        <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-700 group-hover/user:text-indigo-600 max-w-[100px] truncate">
                                        {user.name.split(' ')[0]}
                                    </span>
                                </Link>
                            ) : (
                                <Link 
                                    to="/login"
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 text-white text-sm font-bold hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95"
                                >
                                    <LogIn size={16} />
                                    <span>Login</span>
                                </Link>
                            )}
                            
                            {/* Mobile Menu Toggle */}
                            <button 
                                onClick={() => setMobileMenuOpen(true)}
                                className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-full"
                            >
                                <Menu size={24} />
                            </button>
                        </div>
                    </nav>
                </div>
            </motion.header>

            {/* --- Mobile Menu Overlay --- */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[60]"
                        />
                        <motion.div
                            initial={{ y: "-100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 right-0 z-[70] bg-white rounded-b-[2rem] shadow-2xl p-6 border-b border-slate-100"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <span className="font-black text-xl text-slate-900">Menu</span>
                                <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-slate-100 rounded-full">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="flex flex-col gap-2">
                                {navLinks.map((link) => (
                                    <Link 
                                        key={link.name}
                                        to={link.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 font-bold text-slate-700 hover:text-indigo-600 transition-colors"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
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
