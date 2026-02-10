// src/features/dashboard/Missions.jsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, CheckCircle2, Trash2, ShieldAlert, Target, AlertTriangle, ChevronDown, Users, Search } from "lucide-react";
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";
import { members } from "../../lib/data";

// --- Custom Checkbox Dropdown ---
const CustomDropdown = ({ label, options, value, onChange, icon: Icon, type = "text" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className="relative" ref={containerRef}>
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1 mb-2 block">{label}</label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full bg-slate-50 border ${isOpen ? 'border-indigo-500 ring-2 ring-indigo-500/10' : 'border-slate-200'} rounded-2xl p-4 flex items-center justify-between transition-all duration-300 group hover:border-indigo-300`}
            >
                <div className="flex items-center gap-3">
                    {type === "agent" && selectedOption?.image && (
                         <div className="w-6 h-6 rounded-full overflow-hidden border border-white shadow-sm">
                             <img src={selectedOption.image} alt="" className="w-full h-full object-cover" />
                         </div>
                    )}
                    {type === "agent" && !selectedOption?.image && selectedOption?.icon && (
                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                           <selectedOption.icon size={14} />
                        </div>
                    )}
                    
                    <span className={`font-bold ${value ? 'text-slate-900' : 'text-slate-400'}`}>
                        {selectedOption?.label || "Select..."}
                    </span>
                </div>
                <div className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`}>
                    <ChevronDown size={20} />
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-50 top-full mt-2 left-0 w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden max-h-60 overflow-y-auto custom-scrollbar"
                    >
                        <div className="p-1.5 space-y-1">
                            {options.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => { onChange(opt.value); setIsOpen(false); }}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                                        value === opt.value 
                                            ? 'bg-indigo-50 text-indigo-700' 
                                            : 'hover:bg-slate-50 text-slate-600'
                                    }`}
                                >
                                    {type === "agent" && (
                                        <div className={`w-8 h-8 rounded-full overflow-hidden flex items-center justify-center border ${value === opt.value ? 'border-indigo-200' : 'border-slate-100'}`}>
                                            {opt.image ? (
                                                <img src={opt.image} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="bg-slate-100 w-full h-full flex items-center justify-center text-slate-400">
                                                    {opt.icon ? <opt.icon size={16} /> : <Users size={16} />}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <span className="font-bold text-sm">{opt.label}</span>
                                    {value === opt.value && <CheckCircle2 size={16} className="ml-auto text-indigo-500" />}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function Tasks() {
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

    // 2. Add Task (Admin Only)
    const handleDeploy = async (e) => {
        e.preventDefault();
        if (!newTask || !targetAgent) return;

        // Create Task
        await addDoc(collection(db, "missions"), {
            title: newTask,
            assignedTo: targetAgent, // Store the ID or Name
            assignedBy: user.name,
            status: "pending", // pending, active, completed
            priority,
            createdAt: new Date(),
        });

        // Create Notification for the Agent(s)
        await addDoc(collection(db, "notifications"), {
            recipient: targetAgent, // "All Agents" or specific name
            message: `New Directive: ${newTask} (Priority: ${priority})`,
            type: "task",
            createdAt: new Date(),
            readBy: [] // Array of user IDs who have read this
        });

        setIsModalOpen(false);
        setNewTask("");
        setTargetAgent("");
        setPriority("medium");
    };

    // 3. Update Status
    const toggleStatus = async (mission) => {
        const nextStatus = mission.status === "pending" ? "completed" : "pending";
        await updateDoc(doc(db, "missions", mission.id), { status: nextStatus });

        // Notify the Assigner if Completed
        if (nextStatus === "completed" && mission.assignedBy) {
            await addDoc(collection(db, "notifications"), {
                recipient: mission.assignedBy,
                message: `Task Completed: "${mission.title}" by ${user.name}`,
                type: "alert",
                createdAt: new Date(),
                readBy: []
            });
        }
    };

    // 4. Delete (Admin Only)
    const handleDelete = async (id) => {
        if (!isAdmin) return;
        await deleteDoc(doc(db, "missions", id));
    };

    // Helper to get Agent Image
    const getAgentImage = (nameOrId) => {
        if (nameOrId === "All Agents") return null;
        const agent = members.find(m => m.name === nameOrId || m.id === nameOrId);
        return agent ? agent.image : null;
    };

    // Prepare Options
    const agentOptions = [
        { value: "All Agents", label: "All Agents", icon: Users },
        ...members.map(m => ({ value: m.name, label: m.name, image: m.image }))
    ];

    const priorityOptions = [
        { value: "low", label: "Low Priority" },
        { value: "medium", label: "Medium Priority" },
        { value: "high", label: "Critical Priority" },
    ];

    return (
        <div className="space-y-8 pb-12">

            {/* --- Header --- */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Task Board</h2>
                    <p className="text-slate-500 font-medium max-w-xl">
                        Manage tactical operations and tasks assignments.
                    </p>
                </div>

                {isAdmin && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="group flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-[1.2rem] font-bold shadow-xl shadow-slate-900/20 hover:bg-indigo-600 hover:shadow-indigo-500/30 transition-all hover:-translate-y-1"
                    >
                        <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Assign Task
                    </button>
                )}
            </div>

            {/* --- Task Grid --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
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
                                    {mission.priority}
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
                                    <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white shadow-sm bg-slate-100 flex items-center justify-center">
                                        {mission.assignedTo === "All Agents" ? (
                                            <Users size={20} className="text-slate-400" />
                                        ) : (
                                            <img
                                                src={getAgentImage(mission.assignedTo) || `https://ui-avatars.com/api/?name=${mission.assignedTo}&background=random`}
                                                alt="Agent"
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Agent</span>
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
                    <h3 className="text-2xl font-black text-slate-900 mb-2">No Active Tasks</h3>
                    <p className="text-slate-500 font-medium">Clear board. The team is awaiting orders.</p>
                </div>
            )}

            {/* --- ADD TASK MODAL --- */}
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
                            className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 overflow-visible"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                            
                            <h2 className="text-3xl font-black text-slate-900 mb-1 relative z-10">New Task</h2>
                            <p className="text-slate-500 text-sm font-medium mb-8 relative z-10">Assign a new objective to the team.</p>

                            <form onSubmit={handleDeploy} className="space-y-6 relative z-10">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1 mb-2 block">Task Details</label>
                                    <textarea
                                        autoFocus
                                        placeholder="Brief the agent on their objective..."
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 h-32 resize-none transition-all placeholder:text-slate-400"
                                        value={newTask}
                                        onChange={(e) => setNewTask(e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <CustomDropdown 
                                        label="Assign Agent"
                                        options={agentOptions}
                                        value={targetAgent}
                                        onChange={setTargetAgent}
                                        type="agent"
                                        icon={Target}
                                    />

                                    <CustomDropdown 
                                        label="Priority"
                                        options={priorityOptions}
                                        value={priority}
                                        onChange={setPriority}
                                        icon={AlertTriangle}
                                    />
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
                                        Assign
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