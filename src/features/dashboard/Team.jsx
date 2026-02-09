
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Users, Shield, Star, Award, Briefcase, 
    Edit2, Save, X, Trash2, MessageCircle,
    MoreHorizontal, CheckCircle, AlertCircle, Zap, ShieldCheck, MapPin
} from "lucide-react";
import { collection, query, onSnapshot, doc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { members as staticMembers } from "../../lib/data";
import { useAuth } from "../../context/AuthContext";

import { useNavigate } from "react-router-dom";

// --- Components ---

const Card = ({ children, className = "", delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, type: "spring", stiffness: 100, damping: 20 }}
        className={`bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 group ${className}`}
    >
        {children}
    </motion.div>
);

const StatBadge = ({ icon: Icon, label, value, color = "text-slate-600" }) => (
    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:shadow-md transition-all">
        <Icon size={16} className={`mb-1 ${color}`} />
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
        <span className="font-bold text-slate-900 text-sm">{value}</span>
    </div>
);

// --- Modals ---

const EditMemberModal = ({ isOpen, onClose, member, onSave }) => {
    const [formData, setFormData] = useState({ ...member });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (member) setFormData({ ...member });
    }, [member]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await onSave(formData);
        setLoading(false);
        onClose();
    };

    if (!isOpen || !member) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
            />
            <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Edit Agent Profile</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                        <X size={24} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                    
                    <div className="flex items-center gap-5 mb-8">
                        <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden border-2 border-slate-100 shadow-lg shrink-0">
                            <img src={formData.image || `https://ui-avatars.com/api/?name=${formData.name}`} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h4 className="text-2xl font-black text-slate-900 tracking-tight">{formData.name}</h4>
                            <p className="text-sm font-medium text-slate-500">{formData.email}</p>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mt-2 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-widest border border-indigo-100">
                                {formData.isAdmin ? "Administrator" : "Agent"}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Role (Display)</label>
                                <input 
                                    name="role" value={formData.role || ""} onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Official Post</label>
                                <input 
                                    name="posts" value={formData.posts || ""} onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Salary</label>
                                <input 
                                    name="salary" value={formData.salary || ""} onChange={handleChange}
                                    placeholder="$0"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Clearance Level</label>
                                <select 
                                    name="level" value={formData.level || "1"} onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                                >
                                    <option value="1">Level 1 - Intern</option>
                                    <option value="2">Level 2 - Agent</option>
                                    <option value="3">Level 3 - Handler</option>
                                    <option value="4">Level 4 - Executive</option>
                                    <option value="5">Level 5 - Founder</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Performance Rating (0-10)</label>
                            <input 
                                type="number" min="0" max="10" step="0.1"
                                name="rating" value={formData.rating || "0"} onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Bio / Description</label>
                            <textarea 
                                name="description" value={formData.description || ""} onChange={handleChange}
                                rows={4}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                            />
                        </div>
                    </div>

                </form>

                <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-3 rounded-2xl font-bold text-slate-500 hover:bg-slate-200 transition-colors text-sm">Cancel</button>
                    <button onClick={handleSubmit} disabled={loading} className="px-8 py-3 rounded-2xl font-bold text-white bg-slate-900 hover:bg-indigo-600 shadow-xl shadow-slate-900/10 hover:shadow-indigo-500/20 transition-all text-sm flex items-center gap-2">
                        {loading ? "Saving..." : <><Save size={18} /> Save Changes</>}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

// --- Main Component ---

export default function Team() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [allMembers, setAllMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingMember, setEditingMember] = useState(null);

    // Fetch Logic
    useEffect(() => {
        const fetchMembers = async () => {
            const q = query(collection(db, "users"));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const firestoreUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Merge Static & Firestore
                const combined = [...staticMembers];
                const staticEmailMap = new Map(combined.map(m => [m.email, m]));

                firestoreUsers.forEach(fUser => {
                    if (staticEmailMap.has(fUser.email)) {
                        const index = combined.findIndex(m => m.email === fUser.email);
                        combined[index] = { ...combined[index], ...fUser }; 
                    } else {
                        combined.push(fUser);
                    }
                });

                setAllMembers(combined);
                setLoading(false);
            });

            return () => unsubscribe();
        };

        fetchMembers();
    }, []);

    const handleUpdateMember = async (updatedData) => {
        try {
            let docId = updatedData.uid || updatedData.id;
            if (typeof docId === 'number') {
                docId = updatedData.email; 
            }
            const { id, ...dataToSave } = updatedData;
            await setDoc(doc(db, "users", String(docId)), dataToSave, { merge: true });
        } catch (error) {
            console.error("Error updating member:", error);
            alert("Failed to update profile. Check console.");
        }
    };

    if (loading) return <div className="min-h-[50vh] flex items-center justify-center text-slate-400 font-bold animate-pulse uppercase tracking-widest text-sm">Scanning Bio-Signatures...</div>;

    return (
        <div className="space-y-10 pb-24">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-end justify-between gap-6">
                <div>
                     <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-bold uppercase tracking-widest mb-4">
                        <Users size={12} />
                        Active Agents: {allMembers.length}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none mb-4">
                        The Crew.
                    </h1>
                    <p className="text-slate-500 font-medium text-lg max-w-2xl leading-relaxed">
                        The masterminds behind the chaos. Manage personnel profiles, security clearance, and payroll.
                    </p>
                </div>
            </div>

            {/* Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                <AnimatePresence>
                    {allMembers.map((member, idx) => (
                        <Card key={member.id || member.email} delay={idx * 0.05} className="relative flex flex-col h-full overflow-hidden">
                            
                            {/* Decorative Background Blob */}
                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />

                            <div className="relative z-10 flex items-start justify-between mb-6">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-4 border-slate-50 shadow-2xl group-hover:scale-105 transition-transform duration-500 bg-white">
                                        <img src={member.image || `https://ui-avatars.com/api/?name=${member.name}`} alt={member.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="absolute -bottom-3 -right-3 bg-slate-900 text-white text-[10px] font-black px-2.5 py-1 rounded-lg border-4 border-white shadow-sm flex items-center gap-1 z-20">
                                        <Briefcase size={10} className="text-indigo-400" />
                                        LVL {member.level || 1}
                                    </div>
                                </div>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => navigate(`/chat?uid=${member.uid || member.id}`)}
                                            className="p-3 bg-white hover:bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-2xl shadow-sm border border-slate-100 transition-all active:scale-95"
                                            title="Send Message"
                                        >
                                            <MessageCircle size={18} />
                                        </button>
                                        <button 
                                            onClick={() => setEditingMember(member)}
                                            className="p-3 bg-white hover:bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-2xl shadow-sm border border-slate-100 transition-all active:scale-95"
                                            title="Edit Profile"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                    </div>
                            </div>

                            <div className="relative z-10 mb-8">
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight mb-1">{member.name}</h3>
                                <p className="text-sm font-bold text-indigo-500 uppercase tracking-widest mb-3">{member.role}</p>
                                <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                                    {member.description || "No bio available for this agent."}
                                </p>
                            </div>

                            <div className="mt-auto pt-6 border-t border-slate-100 grid grid-cols-3 gap-3 relative z-10">
                                <StatBadge icon={Award} label="Rating" value={parseFloat(member.rating || 0).toFixed(1)} color="text-amber-500" />
                                <StatBadge icon={Star} label="Post" value={member.title?.split(' ')[0] || "Agent"} color="text-indigo-500" />
                                <StatBadge icon={ShieldCheck} label="Access" value={member.isAdmin ? "Admin" : "User"} color="text-emerald-500" />
                            </div>

                        </Card>
                    ))}
                </AnimatePresence>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {editingMember && (
                    <EditMemberModal 
                        isOpen={!!editingMember} 
                        member={editingMember} 
                        onClose={() => setEditingMember(null)} 
                        onSave={handleUpdateMember} 
                    />
                )}
            </AnimatePresence>

        </div>
    );
}
