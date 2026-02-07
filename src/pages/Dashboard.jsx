// src/pages/Dashboard.jsx
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { TrendingUp, Users, AlertTriangle, Clock, Zap } from "lucide-react";

// Stat Card Component (Light Mode)
const StatCard = ({ icon: Icon, label, value, trend, color, bg }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-white border border-slate-100 p-6 rounded-3xl shadow-[0_2px_20px_-10px_rgba(0,0,0,0.05)] relative overflow-hidden group"
    >
        <div className={`absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity rounded-full ${bg}`}>
            <Icon size={80} />
        </div>

        <div className="relative z-10">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${bg} bg-opacity-10`}>
                <Icon size={24} className={color} />
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-1 tracking-tight">{value}</h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{label}</p>

            <div className="mt-4 flex items-center gap-2 text-xs font-bold">
                <span className="text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <TrendingUp size={12} /> {trend}
                </span>
                <span className="text-slate-400">vs last month</span>
            </div>
        </div>
    </motion.div>
);

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <DashboardLayout>

            {/* Welcome Hero (Light Premium) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-xl shadow-indigo-100/50"
            >
                {/* Decorative Gradients */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-50 via-fuchsia-50 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-80 pointer-events-none" />

                <div className="relative z-10 max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-3 mb-6"
                    >
                        <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-indigo-500/30">
                            Clearance Level 5
                        </span>
                        <span className="text-slate-400 text-xs font-bold tracking-widest uppercase">
              // WELCOME_BACK_AGENT
                        </span>
                    </motion.div>

                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4 leading-tight">
                        Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600">{user?.name.split(' ')[0]}</span>.
                    </h2>
                    <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-lg">
                        Global chaos levels are stable at 84%. There are <span className="text-slate-900 font-bold">3 active missions</span> requiring your immediate attention. Don't forget the coffee.
                    </p>

                    <div className="mt-8 flex gap-4">
                        <button className="px-8 py-3.5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/20 transition-all active:scale-95">
                            View Directives
                        </button>
                        <button className="px-8 py-3.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95">
                            Report Incident
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={Zap}
                    label="Active Pranks"
                    value="12"
                    trend="+24%"
                    color="text-amber-500"
                    bg="bg-amber-500"
                />
                <StatCard
                    icon={Users}
                    label="Total Agents"
                    value="8"
                    trend="+0%"
                    color="text-indigo-500"
                    bg="bg-indigo-500"
                />
                <StatCard
                    icon={AlertTriangle}
                    label="Chaos Score"
                    value="98.5"
                    trend="+12%"
                    color="text-rose-500"
                    bg="bg-rose-500"
                />
                <StatCard
                    icon={Clock}
                    label="Uptime"
                    value="99.9%"
                    trend="+0.1%"
                    color="text-emerald-500"
                    bg="bg-emerald-500"
                />
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Chart Placeholder */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Mission Trajectory</h3>
                        <select className="bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold rounded-lg px-3 py-2 outline-none">
                            <option>Last 7 Days</option>
                            <option>Last Month</option>
                        </select>
                    </div>
                    <div className="h-64 flex items-center justify-center text-slate-400 bg-slate-50 border border-dashed border-slate-200 rounded-2xl font-medium">
                        Chart Component Coming Soon
                    </div>
                </div>

                {/* Live Feed */}
                <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-6">Live Feed</h3>
                    <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex gap-4 group cursor-pointer">
                                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    AG
                                </div>
                                <div className="pt-1">
                                    <p className="text-sm text-slate-600 font-medium leading-snug">
                                        <span className="text-slate-900 font-bold">Agent Gajjar</span> deployed a whoopee cushion in Sector 7.
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1 font-bold">2 mins ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </DashboardLayout>
    );
}