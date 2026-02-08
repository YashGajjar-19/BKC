// src/features/dashboard/Overview.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { TrendingUp, Users, AlertTriangle, Clock, Zap, ArrowUpRight, MoreHorizontal, Globe } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

// Android 17 / Material You Style Widget
const Widget = ({ children, className = "", delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, type: "spring", stiffness: 100, damping: 20 }}
        className={`bg-white rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}
    >
        {children}
    </motion.div>
);

const StatPill = ({ icon: Icon, label, value, trend, color, bg }) => (
    <Widget className="relative overflow-hidden group !p-0">
        <div className={`absolute inset-0 opacity-10 ${bg}`} />
        <div className="relative p-6 flex flex-col justify-between h-40">
             <div className="flex justify-between items-start">
                 <div className={`w-12 h-12 rounded-full ${bg} bg-opacity-20 flex items-center justify-center text-${color.split('-')[1]}-600`}>
                     <Icon size={24} />
                 </div>
                 <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full text-xs font-bold shadow-sm">
                     <TrendingUp size={12} className="text-emerald-600" />
                     <span className="text-emerald-600">{trend}</span>
                 </div>
             </div>
             <div>
                 <h3 className="text-4xl font-normal text-[#1F1F1F] tracking-tight">{value}</h3>
                 <p className="text-slate-500 font-medium text-sm mt-1">{label}</p>
             </div>
        </div>
    </Widget>
);

export default function Overview() {
    const { user } = useAuth();
    const date = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <div className="space-y-6">
            
            {/* Top Row: Welcome & Main Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Hero Widget */}
                <Widget className="lg:col-span-2 !bg-[#D3E3FD] !text-[#041E49] relative overflow-hidden min-h-[300px] flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4 opacity-70">
                            <span className="text-xs font-bold uppercase tracking-widest">{date}</span>
                            <div className="h-1 w-1 rounded-full bg-current" />
                            <span className="text-xs font-bold uppercase tracking-widest">HQ: Active</span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-normal leading-tight">
                            Good Morning,<br />
                            <span className="font-bold">{user?.name.split(' ')[0]}</span>.
                        </h2>
                    </div>

                    <div className="relative z-10 grid grid-cols-2 gap-4 mt-8">
                         <Link to="/dashboard/missions" className="group bg-[#041E49] text-white px-6 py-4 rounded-[1.5rem] flex items-center justify-between hover:bg-opacity-90 transition-all">
                             <span className="font-medium text-lg">View Directives</span>
                             <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                         </Link>
                         <button className="bg-white/40 backdrop-blur-md px-6 py-4 rounded-[1.5rem] text-[#041E49] font-medium text-lg hover:bg-white/50 transition-all text-left">
                             Report Incident
                         </button>
                    </div>
                </Widget>

                {/* Status / Quick Glance */}
                <div className="flex flex-col gap-6">
                     <Widget className="flex-1 !bg-[#C2E7FF] flex flex-col justify-center items-center text-center gap-2">
                         <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[#001D35] mb-2 shadow-sm">
                             <Zap size={32} />
                         </div>
                         <div className="text-4xl font-bold text-[#001D35]">84%</div>
                         <div className="text-[#001D35] font-medium opacity-80">Chaos Stability</div>
                     </Widget>

                     <Widget className="flex-1 !bg-[#E8DEF8] flex flex-row items-center justify-between px-8">
                         <div>
                             <div className="text-3xl font-bold text-[#1D192B]">3</div>
                             <div className="text-[#1D192B] opacity-70 font-medium">Active Missions</div>
                         </div>
                         <Clock size={40} className="text-[#1D192B] opacity-20" />
                     </Widget>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <StatPill
                    icon={Users} label="Total Agents" value="8" trend="+1" 
                    color="text-indigo-600" bg="bg-indigo-600"
                />
                <StatPill
                    icon={AlertTriangle} label="Prank Ratio" value="1.4" trend="+12%" 
                    color="text-rose-600" bg="bg-rose-600"
                />
                 <StatPill
                    icon={Zap} label="Energy Output" value="9GW" trend="Stable" 
                    color="text-amber-600" bg="bg-amber-600"
                />
                 <StatPill
                    icon={Globe} label="Global Reach" value="12" trend="+2" 
                    color="text-emerald-600" bg="bg-emerald-600"
                />
            </div>

            {/* Content Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity List */}
                <Widget className="lg:col-span-2 min-h-[400px]">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-normal text-[#1F1F1F]">Live Intelligence</h3>
                        <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <MoreHorizontal size={24} className="text-slate-400" />
                        </button>
                    </div>
                    
                    <div className="space-y-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-4 hover:bg-[#F2F6FC] rounded-[1.5rem] transition-colors cursor-pointer group">
                                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold group-hover:bg-white group-hover:shadow-md transition-all">
                                    AG
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-[#1F1F1F] text-sm">Agent Gajjar</h4>
                                        <span className="text-xs font-bold text-slate-400">10m ago</span>
                                    </div>
                                    <p className="text-slate-600 text-sm mt-1">Updated the cafeteria menu to only include "Invisible Sandwich".</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Widget>

                 {/* Agent Roster Widget */}
                <Widget className="!bg-[#1F1F1F] !text-white flex flex-col">
                    <h3 className="text-xl font-normal mb-6">Top Agents</h3>
                    <div className="space-y-4 flex-1">
                        {[1, 2, 3].map((i) => (
                             <div key={i} className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-full bg-slate-700 border-2 border-slate-600" />
                                 <div>
                                     <div className="font-bold text-sm">Operative {i}</div>
                                     <div className="text-xs text-slate-400">Level 5 Clearance</div>
                                 </div>
                             </div>
                        ))}
                    </div>
                    <button className="mt-8 w-full py-4 bg-[#303030] rounded-2xl font-bold text-sm hover:bg-[#404040] transition-colors">
                        View Full Roster
                    </button>
                </Widget>
            </div>

        </div>
    );
}
