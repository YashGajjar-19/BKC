// src/features/dashboard/Missions.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, CheckCircle2, Trash2, ShieldAlert, Target, AlertTriangle } from "lucide-react";
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";
import { members } from "../../lib/data";

export default function Missions() {
    const { user } = useAuth();
    const [missions, setMissions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // Form State
    const [newTask, setNewTask] = useState("");
    const [targetAgent, setTargetAgent] = useState("");
    const [priority, setPriority] = useState("medium");

    const isAdmin = user?.role?.includes("Founder") || user?.role?.includes("Admin");

    // 1. Real-time Listener
    useEffect(() => {
        const q = query(collection(db, "missions"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMissions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // 2. Add Mission (Admin Only)
    const handleDeploy = async (e) => {
        e.preventDefault();
        if (!newTask || !targetAgent) return;

        await addDoc(collection(db, "missions"), {
            title: newTask,
            assignedTo: targetAgent, // Store the ID or Name
            assignedBy: user.name,
            status: "pending", // pending, active, completed
            priority,
            createdAt: new Date(),
        });

        setIsModalOpen(false);
        setNewTask("");
        setTargetAgent("");
    };

    // 3. Update Status
    const toggleStatus = async (mission) => {
        const nextStatus = mission.status === "pending" ? "completed" : "pending";
        await updateDoc(doc(db, "missions", mission.id), { status: nextStatus });
    };

    // 4. Delete (Admin Only)
    const handleDelete = async (id) => {
        if (!isAdmin) return;
        await deleteDoc(doc(db, "missions", id));
    };

    // Helper to get Agent Image
    const getAgentImage = (nameOrId) => {
        const agent = members.find(m => m.name === nameOrId || m.id === nameOrId);
        return agent ? agent.image : null;
    };

    return (
        <div className="space-y-8 pb-12">

            {/* --- Header --- */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Active Directives</h2>
                    <p className="text-slate-500 font-medium max-w-xl">
                        Manage tactical operations and chaos distribution.
                    </p>
                </div>

                {isAdmin && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="group flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-[1.2rem] font-bold shadow-xl shadow-slate-900/20 hover:bg-indigo-600 hover:shadow-indigo-500/30 transition-all hover:-translate-y-1"
                    >
                        <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Deploy Directive
                    </button>
                )}
            </div>

            {/* --- Mission Grid --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {missions.map((mission) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            key={mission.id}
                            className={`group relative bg-white border rounded-[2rem] p-8 transition-all duration-300 ${
                                mission.status === 'completed'
                                    ? 'border-emerald-100 bg-emerald-50/20 opacity-80'
                                    : 'border-white shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-50'
                            }`}
                        >
                            {/* Header: Priority & Actions */}
                            <div className="flex justify-between items-start mb-6">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                                    mission.priority === 'high'
                                        ? 'bg-rose-50 text-rose-600 border-rose-100'
                                        : mission.priority === 'medium'
                                            ? 'bg-amber-50 text-amber-600 border-amber-100'
                                            : 'bg-slate-100 text-slate-500 border-slate-200'
                                }`}>
                                    {mission.priority} Priority
                                </span>

                                {isAdmin && (
                                    <button
                                        onClick={() => handleDelete(mission.id)}
                                        className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>

                            {/* Title */}
                            <h3 className={`text-xl font-bold text-slate-900 mb-8 leading-snug ${
                                mission.status === 'completed' ? 'line-through text-slate-400' : ''
                            }`}>
                                {mission.title}
                            </h3>

                            {/* Footer: Assignee & Checkbox */}
                            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white shadow-sm bg-slate-100">
                                        <img
                                            src={getAgentImage(mission.assignedTo) || `https://ui-avatars.com/api/?name=${mission.assignedTo}&background=random`}
                                            alt="Agent"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Operative</span>
                                        <span className="text-xs font-bold text-slate-900">{mission.assignedTo}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => toggleStatus(mission)}
                                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                                        mission.status === 'completed'
                                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 rotate-0'
                                            : 'bg-slate-50 text-slate-300 hover:bg-indigo-600 hover:text-white hover:rotate-12'
                                    }`}
                                >
                                    <CheckCircle2 size={24} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {missions.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-6">
                        <ShieldAlert className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">All Clear</h3>
                    <p className="text-slate-500 font-medium">No active operations. The world is safe... for now.</p>
                </div>
            )}

            {/* --- ADD MISSION MODAL --- */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }} 
                            animate={{ scale: 1, opacity: 1, y: 0 }} 
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                            
                            <h2 className="text-3xl font-black text-slate-900 mb-1 relative z-10">New Directive</h2>
                            <p className="text-slate-500 text-sm font-medium mb-8 relative z-10">Assign a new task to a field agent.</p>

                            <form onSubmit={handleDeploy} className="space-y-6 relative z-10">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1 mb-2 block">Mission Details</label>
                                    <textarea
                                        autoFocus
                                        placeholder="Brief the agent on their objective..."
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 h-32 resize-none transition-all placeholder:text-slate-400"
                                        value={newTask}
                                        onChange={(e) => setNewTask(e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1 mb-2 block">Assign Agent</label>
                                        <div className="relative">
                                            <select
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-bold text-slate-700 outline-none focus:border-indigo-500 appearance-none transition-all"
                                                value={targetAgent}
                                                onChange={(e) => setTargetAgent(e.target.value)}
                                            >
                                                <option value="">Select Agent</option>
                                                {members.map(m => (
                                                    <option key={m.id} value={m.name}>{m.name}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                <Target size={16} />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1 mb-2 block">Priority</label>
                                        <div className="relative">
                                            <select
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-bold text-slate-700 outline-none focus:border-indigo-500 appearance-none transition-all"
                                                value={priority}
                                                onChange={(e) => setPriority(e.target.value)}
                                            >
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">Critical</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                <AlertTriangle size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="w-full py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-indigo-600 transition-colors shadow-lg shadow-slate-900/10"
                                    >
                                        Initiate
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}   