// src/components/layouts/DashboardLayout.jsx
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import
    {
        LayoutDashboard, Users, Zap, Settings, LogOut,
        Search, Bell, Menu, X, Globe, ChevronRight
    } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const NavItem = ( { icon: Icon, label, path, isActive, isCollapsed } ) => (
    <Link to={ path }>
        <div className={ `relative flex items-center gap-4 px-4 py-3.5 my-1 rounded-full transition-all duration-300 group ${ isActive
            ? "bg-indigo-100 text-indigo-900"
            : "text-slate-500 hover:bg-slate-100/80 hover:text-slate-900"
            }` }>
            <Icon size={ 24 } strokeWidth={ isActive ? 2.5 : 2 } className={ `transition-transform duration-300 ${ isActive ? 'scale-110' : 'group-hover:scale-110' }` } />

            { !isCollapsed && (
                <motion.span
                    initial={ { opacity: 0, x: -10 } }
                    animate={ { opacity: 1, x: 0 } }
                    className="font-bold text-sm tracking-wide whitespace-nowrap"
                >
                    { label }
                </motion.span>
            ) }

            {/* Active Indicator Dot */ }

        </div>
    </Link>
);

export default function DashboardLayout ( { children } )
{
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [ isCollapsed, setIsCollapsed ] = useState( false );

    // Android 17 style: Often has a persistent bottom nav on mobile, rail on tablet/desktop. 
    // We'll stick to a responsive sidebar approach for desktop.

    const navItems = [
        { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
        { icon: Zap, label: "Missions", path: "/dashboard/missions" },
        { icon: Users, label: "Agents", path: "/dashboard/team" },
        { icon: Settings, label: "Settings", path: "/dashboard/settings" },
        { icon: Globe, label: "Public Universe", path: "/" },
    ];

    const handleLogout = () =>
    {
        logout();
        navigate( "/" );
    };

    return (
        <div className="min-h-screen bg-[#F2F6FC] text-[#1F1F1F] font-sans selection:bg-indigo-200 flex overflow-hidden">
            {/* 
               Background Color: #F2F6FC is a common Google Material 3 surface color (Surface Container Low).
               Text Color: #1F1F1F is standard Material OnSurface.
            */}

            {/* --- SIDEBAR (Navigation Rail / Drawer) --- */ }
            <motion.aside
                initial={ false }
                animate={ { width: isCollapsed ? 88 : 300 } }
                transition={ { type: "spring", stiffness: 300, damping: 30 } }
                className="h-screen py-4 pl-4 hidden md:flex flex-col relative z-50 shrink-0"
            >
                {/* Floating Sidebar Container */ }
                <div className="bg-white h-full w-full rounded-[2rem] shadow-sm flex flex-col justify-between overflow-hidden relative">

                    {/* Header / Logo */ }
                    <div className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#D3E3FD] flex items-center justify-center shrink-0 text-indigo-900 shadow-inner">
                            <span className="font-black text-xl">B</span>
                        </div>
                        { !isCollapsed && (
                            <motion.div
                                initial={ { opacity: 0 } }
                                animate={ { opacity: 1 } }
                                className="flex flex-col"
                            >
                                <span className="font-bold text-lg text-[#1F1F1F] tracking-tight">BKC Admin</span>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Workspace</span>
                            </motion.div>
                        ) }
                    </div>

                    {/* Navigation Items */ }
                    <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
                        { navItems.map( ( item ) => (
                            <NavItem
                                key={ item.path }
                                { ...item }
                                isActive={ location.pathname === item.path }
                                isCollapsed={ isCollapsed }
                            />
                        ) ) }
                    </div>

                    {/* Footer / User */ }
                    <div className="p-4 bg-[#F8FAFD] mt-auto">
                        <button
                            onClick={ handleLogout }
                            className={ `flex items-center gap-3 w-full px-4 py-4 rounded-2xl text-slate-500 hover:bg-[#FFDAD6] hover:text-[#BA1A1A] transition-colors group ${ isCollapsed ? "justify-center" : "" }` }
                        >
                            <LogOut size={ 24 } />
                            { !isCollapsed && <span className="font-bold">Sign Out</span> }
                        </button>

                        <button
                            onClick={ () => setIsCollapsed( !isCollapsed ) }
                            className="w-full flex items-center justify-center mt-2 p-2 text-slate-300 hover:text-slate-600"
                        >
                            <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
                        </button>
                    </div>
                </div>
            </motion.aside>

            {/* --- MAIN CONTENT --- */ }
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">

                {/* Top Bar (Floating Style) */ }
                <header className="h-24 px-8 flex items-center justify-between shrink-0">
                    {/* Page Title / Breadcrumbs */ }
                    <div className="flex flex-col">
                        <h1 className="text-3xl font-normal text-[#1F1F1F] tracking-tight flex items-center gap-2">
                            { navItems.find( i => i.path === location.pathname )?.label || "Dashboard" }
                        </h1>
                    </div>

                    {/* Actions Pill */ }
                    <div className="flex items-center gap-3 bg-white p-2 pr-6 pl-2 rounded-full shadow-sm">

                        {/* Search */ }
                        <div className="hidden md:flex items-center bg-[#F2F6FC] rounded-full px-4 py-2 w-64 focus-within:ring-2 ring-indigo-200 transition-all">
                            <Search size={ 20 } className="text-slate-400 mr-2" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-transparent border-none outline-none text-sm text-[#1F1F1F] placeholder:text-slate-400 w-full font-medium"
                            />
                        </div>

                        {/* User User */ }
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm ml-2">
                            <img src={ user?.image } alt="User" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </header>

                {/* Content Area */ }
                <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-8 scroll-smooth">
                    {/* 
                        Use a large container with rounded corners for the "Page Card" look 
                        typical of modern tablet UIs.
                    */}
                    <div className="max-w-[1600px] mx-auto min-h-full">
                        { children }
                    </div>
                </div>

            </main>
        </div>
    );
}