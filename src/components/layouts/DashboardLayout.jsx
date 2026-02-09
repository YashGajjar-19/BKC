// src/components/layouts/DashboardLayout.jsx
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Users, Zap, Settings, LogOut, Search, Menu, X, Globe, ChevronRight, MessageSquare, Bell } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/images/grp_bit/Logo.png";

const NavItem = ({ icon: Icon, label, path, isActive, isCollapsed }) => (
    <Link to={path} title={isCollapsed ? label : ""}>
        <div className={`relative flex items-center ${isCollapsed ? 'justify-center py-4' : 'gap-4 px-4 py-3'} my-2 rounded-xl transition-all duration-300 group ${
            isActive
                ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
        }`}>
            <Icon size={20} strokeWidth={isActive ? 2 : 1.5} className={`shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-900'}`} />

            {!isCollapsed && (
                <span className={`text-sm tracking-wide ${isActive ? 'font-semibold' : 'font-medium'}`}>
                    {label}
                </span>
            )}
        </div>
    </Link>
);

export default function DashboardLayout({ children }) {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
        { icon: Zap, label: "Directives", path: "/dashboard/missions" },
        { icon: Users, label: "Agents", path: "/dashboard/team" },
        { icon: Settings, label: "Global Settings", path: "/dashboard/settings" },
    ];

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white flex overflow-hidden">
            
            {/* --- SIDEBAR (Desktop) --- */}
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? 80 : 260 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="h-screen hidden md:flex flex-col border-r border-slate-200 bg-white relative z-50 shrink-0"
            >
                {/* Header / Logo */}
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'px-6'} h-20 border-b border-slate-100/50`}>
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center shrink-0 text-white shadow-md shadow-slate-900/10 transition-transform group-hover:scale-105 overflow-hidden">
                            <img src={logo} alt="Logo" className="w-full h-full object-cover" />
                        </div>
                        {!isCollapsed && (
                            <div className="flex flex-col">
                                <span className="font-bold text-sm text-slate-900 leading-tight">Console</span>
                                <span className="text-[10px] font-medium text-slate-400">Workspace</span>
                            </div>
                        )}
                    </Link>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 overflow-y-auto py-8 flex flex-col gap-8 px-5 custom-scrollbar">
                    
                    {/* Main Menu */}
                    <div>
                        {!isCollapsed && <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-2 opacity-80">Workspace</div>}
                        <div className="space-y-1">
                            {navItems.map((item) => (
                                <NavItem
                                    key={item.path}
                                    {...item}
                                    isActive={location.pathname === item.path}
                                    isCollapsed={isCollapsed}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Shortcuts / Other */}
                    <div>
                       {!isCollapsed && <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-2 opacity-80">Quick Access</div>}
                       <div className="space-y-1">
                           <NavItem icon={Globe} label="Public Site" path="/" isActive={false} isCollapsed={isCollapsed} />
                           <NavItem icon={MessageSquare} label="Comm Channel" path="/chat" isActive={false} isCollapsed={isCollapsed} />
                       </div>
                    </div>

                </div>

                {/* Footer / User Profile */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/30">
                     <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
                        <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-200">
                             <img src={user?.image || `https://ui-avatars.com/api/?name=${user?.name}`} alt="User" className="w-full h-full object-cover" />
                        </div>
                        
                        {!isCollapsed && (
                             <div className="flex-1 min-w-0">
                                 <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
                                 <p className="text-xs text-slate-500 truncate">{user?.role || "Agent"}</p>
                             </div>
                        )}
                        
                        {!isCollapsed && (
                             <button onClick={handleLogout} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Sign Out">
                                 <LogOut size={16} />
                             </button>
                        )}
                     </div>

                     {/* Collapse Toggle */}
                     <button 
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="absolute -right-3 top-24 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 shadow-sm z-50"
                     >
                         <ChevronRight size={14} className={`transition-transform duration-300 ${isCollapsed ? '' : 'rotate-180'}`} />
                     </button>
                </div>
            </motion.aside>

            {/* --- MOBILE NAVIGATION DRAWER --- */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] md:hidden"
                        />
                        {/* Drawer */}
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed top-0 left-0 bottom-0 w-[280px] bg-white z-[70] md:hidden shadow-2xl flex flex-col border-r border-slate-100"
                        >
                            <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100 shrink-0">
                                <Link to="/" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
                                    <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-md overflow-hidden">
                                        <img src={logo} alt="Logo" className="w-full h-full object-cover" />
                                    </div>
                                    <span className="font-bold text-lg text-slate-900 tracking-tight">Console</span>
                                </Link>
                                <button 
                                    onClick={() => setIsMobileMenuOpen(false)} 
                                    className="p-2 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-2 opacity-80 mt-2">Menu</div>
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block"
                                        >
                                            <div className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${
                                                isActive
                                                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium"
                                            }`}>
                                                <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                                                <span className="text-sm font-medium">{item.label}</span>
                                            </div>
                                        </Link>
                                    );
                                })}

                                <div className="my-6 border-t border-slate-100/50"></div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-2 opacity-80">Quick Access</div>
                                
                                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block">
                                    <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors font-medium">
                                        <Globe size={20} strokeWidth={1.5} />
                                        <span className="text-sm">Public Site</span>
                                    </div>
                                </Link>
                                <Link to="/chat" onClick={() => setIsMobileMenuOpen(false)} className="block">
                                    <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors font-medium">
                                        <MessageSquare size={20} strokeWidth={1.5} />
                                        <span className="text-sm">Comm Channel</span>
                                    </div>
                                </Link>
                            </div>

                            <div className="p-4 border-t border-slate-100 bg-slate-50/50 shrink-0 safe-area-bottom">
                                <button
                                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-200 transition-colors font-bold text-sm shadow-sm"
                                >
                                    <LogOut size={16} />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">

                {/* Top Bar (Simplified) */}
                <header className="h-20 px-6 md:px-10 flex items-center justify-between shrink-0 bg-white/50 backdrop-blur-sm border-b border-slate-200/50 sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                            {navItems.find(i => i.path === location.pathname)?.label || "Dashboard"}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
                        </button>
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 bg-slate-100">
                             <img src={user?.image || `https://ui-avatars.com/api/?name=${user?.name}`} alt="User" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto px-6 md:px-10 py-8 scroll-smooth">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>

            </main>
        </div>
    );
}