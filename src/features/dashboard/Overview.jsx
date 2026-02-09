// src/features/dashboard/Overview.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, Users, AlertTriangle, Zap, ArrowUpRight, Activity, Target, Shield } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { collection, query, orderBy, limit, onSnapshot, where } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { members } from "../../lib/data";
import { motion } from "framer-motion";

const Widget = ({ children, className = "", delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, type: "spring", stiffness: 100, damping: 20 }}
        className={`bg-white rounded-[2rem] p-8 border border-white shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 ${className}`}
    >
        {children}
    </motion.div>
);

const StatCard = ({ icon: Icon, label, value, trend, color, trendColor = "text-emerald-500" }) => (
    <Widget className="group relative overflow-hidden">
        <div className={`absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500 ${color}`}>
            <Icon size={64} />
        </div>
        <div className="relative z-10">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${color} bg-opacity-10 text-current`}>
                <Icon size={24} />
            </div>
            <h3 className="text-4xl font-black text-slate-900 tracking-tight mb-1">{value}</h3>
            <div className="flex items-center gap-2">
                <p className="text-slate-500 font-bold text-xs uppercase tracking-wider">{label}</p>
                {trend && (
                    <span className={`text-xs font-bold ${trendColor} bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1`}>
                        <TrendingUp size={10} /> {trend}
                    </span>
                )}
            </div>
        </div>
    </Widget>
);

export default function Overview() {
    const { user } = useAuth();
    const date = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    
    const [recentMissions, setRecentMissions] = useState([]);
    const [activeCount, setActiveCount] = useState(0);

    // Fetch Stats & Mission Log
    useEffect(() => {
        // 1. Recent Missions Log
        const qLog = query(collection(db, "missions"), orderBy("createdAt", "desc"), limit(5));
        const unsubLog = onSnapshot(qLog, (snapshot) => {
            setRecentMissions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        // 2. Active Count (Separate listener for accuracy, or derived if list is small)
        const qActive = query(collection(db, "missions"), where("status", "==", "pending"));
        const unsubActive = onSnapshot(qActive, (snapshot) => {
            setActiveCount(snapshot.size);
        });

        return () => {
            unsubLog();
            unsubActive();
        };
    }, []);

    // Get top 3 members (excluding current user if desired, or just first 3)
    const topBakchods = members.slice(0, 3);

    return (
        <div className="space-y-8 pb-12">
            
            {/* Top Row: Welcome & Main Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Hero Widget */}
                <Widget className="lg:col-span-2 relative overflow-hidden min-h-[340px] flex flex-col justify-between !bg-slate-900 !text-white !border-slate-800">
                    
                    {/* Background Gradients */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-fuchsia-600/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
                    
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border border-white/10">
                                    {date}
                                </span>
                                <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border border-emerald-500/20">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    HQ Online
                                </span>
                            </div>
                            <h2 className="text-5xl md:text-7xl font-thin tracking-tight leading-[0.9]">
                                Welcome back,<br />
                                <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">
                                    {user?.name.split(' ')[0]}.
                                </span>
                            </h2>
                        </div>
                    </div>

                    <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                         <Link to="/dashboard/missions" className="group bg-white text-slate-900 px-8 py-5 rounded-[1.5rem] flex items-center justify-between hover:bg-indigo-50 transition-all font-bold">
                             <span>View Directives</span>
                             <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform text-indigo-600" />
                         </Link>
                         <button className="bg-white/5 backdrop-blur-md px-8 py-5 rounded-[1.5rem] text-white border border-white/10 font-bold hover:bg-white/10 transition-all text-left flex items-center justify-between group">
                             <span>Report Incident</span>
                             <AlertTriangle className="opacity-50 group-hover:opacity-100 group-hover:text-amber-400 transition-all" />
                         </button>
                    </div>
                </Widget>

                {/* Status / Quick Glance */}
                <div className="flex flex-col gap-6">
                     <Widget className="flex-1 flex flex-col justify-center items-center text-center gap-4 group">
                         <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                             <Zap size={40} />
                         </div>
                         <div>
                             <div className="text-5xl font-black text-slate-900 tracking-tighter">98%</div>
                             <div className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">Chaos Stability</div>
                         </div>
                     </Widget>

                     <Widget className="flex-1 flex items-center justify-between px-8 !bg-indigo-600 !text-white !border-indigo-500">
                         <div>
                             <div className="text-5xl font-black text-white tracking-tighter">{activeCount}</div>
                             <div className="text-indigo-200 font-bold text-xs uppercase tracking-widest mt-1">Active Missions</div>
                         </div>
                         <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-white backdrop-blur-sm">
                            <Activity size={28} />
                         </div>
                     </Widget>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={Users} label="Total Bakchods" value={members.length} trend="+1" 
                    color="text-indigo-600"
                />
                <StatCard
                    icon={AlertTriangle} label="Prank Ratio" value="1.4" trend="+12%" 
                    color="text-rose-600" trendColor="text-rose-600"
                />
                 <StatCard
                    icon={Zap} label="Energy Output" value="9GW" trend="Stable" 
                    color="text-amber-500" trendColor="text-amber-600"
                />
                 <StatCard
                    icon={Target} label="Objectives" value={activeCount} trend="Active" 
                    color="text-emerald-500"
                />
            </div>

            {/* Content Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity List */}
                <Widget className="lg:col-span-2 min-h-[400px]">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Mission Log</h3>
                        <div className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold uppercase tracking-widest text-slate-500">
                            Live Feed
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        {recentMissions.length > 0 ? (
                            recentMissions.map((mission) => (
                                <div key={mission.id} className="flex items-start gap-5 p-4 hover:bg-slate-50 rounded-[1.5rem] transition-colors cursor-pointer group">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all shadow-sm ${
                                        mission.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-50 text-indigo-600'
                                    }`}>
                                        {mission.status === 'completed' ? <Shield size={20} /> : <Target size={20} />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-900">
                                                {mission.title}
                                            </h4>
                                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full uppercase tracking-wider">
                                                {mission.priority}
                                            </span>
                                        </div>
                                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wide">
                                            Assigned to <span className="text-indigo-600">{mission.assignedTo}</span> by {mission.assignedBy}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-slate-400 font-bold">No recent mission activity.</div>
                        )}
                    </div>
                </Widget>

                 {/* Agent Roster Widget */}
                <Widget className="flex flex-col bg-slate-50 !border-slate-100">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Top Bakchods</h3>
                        <Link to="/#crew" className="text-xs font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-800">View All</Link>
                    </div>
                    
                    <div className="space-y-4 flex-1">
                        {topBakchods.map((member) => (
                             <div key={member.id} className="flex items-center gap-4 p-3 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-default">
                                 <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                                     <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                 </div>
                                 <div className="overflow-hidden">
                                     <div className="font-bold text-sm text-slate-900 truncate">{member.name}</div>
                                     <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest truncate">{member.role}</div>
                                 </div>
                             </div>
                        ))}
                    </div>
                </Widget>
            </div>

        </div>
    );
}
