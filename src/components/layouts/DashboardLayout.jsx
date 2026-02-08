// src/components/layouts/DashboardLayout.jsx
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    LayoutDashboard, Users, Zap, Settings, LogOut,
    Search, Bell, Globe
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const SidebarItem = ({ icon: Icon, label, path, isActive, isCollapsed }) => (
    <Link to={path}>
        <div className={`relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group ${isActive
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            }`}>
            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />

            {!isCollapsed && (
                <span className="font-bold text-sm tracking-wide whitespace-nowrap">
                    {label}
                </span>
            )}

            {/* Hover Tooltip for Collapsed Mode */}
            {isCollapsed && (
                <div className="absolute left-14 px-3 py-1.5 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl font-bold">
                    {label}
                </div>
            )}
        </div>
    </Link>
);

export default function DashboardLayout({ children }) {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const navItems = [
        { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
        { icon: Zap, label: "Missions", path: "/dashboard/missions" },
        { icon: Users, label: "Agents", path: "/dashboard/team" },
        { icon: Settings, label: "Settings", path: "/dashboard/settings" },
        { icon: Globe, label: "Public Universe", path: "/" },
    ];

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500/20 flex overflow-hidden">

            {/* --- SIDEBAR --- */}
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? 80 : 280 }}
                className="h-screen bg-white border-r border-slate-200 flex flex-col justify-between relative z-50 shrink-0 shadow-sm"
            >
                {/* Logo Area */}
                <div className="h-20 flex items-center px-6 gap-3 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-fuchsia-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
                        <span className="font-bold text-white text-lg">B</span>
                    </div>
                    {!isCollapsed && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="font-black text-lg tracking-tight text-slate-900"
                        >
                            BAKCHODI <span className="text-indigo-600">INTL.</span>
                        </motion.span>
                    )}
                </div>

                {/* Navigation */}
                <div className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest px-4 mb-4">
                        {!isCollapsed ? "Command" : "Cmd"}
                    </div>
                    {navItems.map((item) => (
                        <SidebarItem
                            key={item.path}
                            {...item}
                            isActive={location.pathname === item.path}
                            isCollapsed={isCollapsed}
                        />
                    ))}
                </div>

                {/* User / Footer */}
                <div className="p-4 border-t border-slate-100">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-3 w-full px-3 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors ${isCollapsed ? "justify-center" : ""}`}
                    >
                        <LogOut size={20} />
                        {!isCollapsed && <span className="text-sm font-bold">Disconnect</span>}
                    </button>

                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="mt-4 flex items-center justify-center w-full py-2 text-slate-300 hover:text-slate-600 transition-colors"
                    >
                        <div className="w-8 h-1 bg-slate-200 rounded-full" />
                    </button>
                </div>
            </motion.aside>

            {/* --- MAIN CONTENT AREA --- */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">

                {/* Top Header */}
                <header className="h-20 border-b border-slate-200 bg-white/80 backdrop-blur-xl flex items-center justify-between px-8 shrink-0 relative z-40">

                    {/* Breadcrumb / Title */}
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                            {navItems.find(i => i.path === location.pathname)?.label || "Dashboard"}
                        </h1>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold uppercase tracking-wider">
                            System Active
                        </span>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-6">
                        {/* Search Bar */}
                        <div className="hidden md:flex items-center bg-slate-100 border border-slate-200 rounded-full px-4 py-2 w-64 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500/50 transition-all">
                            <Search size={16} className="text-slate-400 mr-3" />
                            <input
                                type="text"
                                placeholder="Search directives..."
                                className="bg-transparent border-none outline-none text-sm text-slate-900 placeholder:text-slate-400 w-full font-medium"
                            />
                        </div>

                        {/* Notifications */}
                        <button className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse border-2 border-white" />
                        </button>

                        {/* User Profile Pill */}
                        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                            <div className="text-right hidden md:block">
                                <div className="text-sm font-bold text-slate-900">{user?.name || "Agent Unknown"}</div>
                                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">{user?.role?.split('&')[0] || "Operative"}</div>
                            </div>
                            <div className="w-10 h-10 rounded-full ring-2 ring-slate-100 p-0.5 shadow-sm">
                                <img
                                    src={user?.image}
                                    className="w-full h-full rounded-full object-cover bg-slate-100"
                                    alt="Profile"
                                />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-8 relative scroll-smooth">
                    <div className="max-w-7xl mx-auto relative z-10 space-y-8">
                        {children}
                    </div>
                </div>

            </main>
        </div>
    );
}