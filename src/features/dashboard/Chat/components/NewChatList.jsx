import { useState, useEffect } from "react";
import { query, collection, getDocs, doc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { members as staticMembers } from '../../../../lib/data';

export const NewChatList = ({ onSelect }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Fetch real users from Firestore
                const q = query(collection(db, "users"));
                const userSnaps = await getDocs(q);
                
                const realUsers = userSnaps.docs.map(d => ({ id: d.id, ...d.data() }));
                
                // Merge with static members who might not be in DB yet (optional, but good for demo)
                // Filter out duplicates based on email or ID
                const usedEmails = new Set(realUsers.map(u => u.email));
                const uniqueStatic = staticMembers.filter(m => !usedEmails.has(m.email));
                
                setUsers([...realUsers, ...uniqueStatic]);
            } catch (e) {
                console.error("Error fetching users", e);
                setUsers(staticMembers); // Fallback
            }
            setLoading(false);
        };
        fetchUsers();
    }, []);

    if (loading) return <div className="p-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">Loading agents...</div>;

    return (
        <div className="p-2 space-y-1 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {users.map(u => (
                <button 
                    key={u.id || u.uid}
                    onClick={() => onSelect(u)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors text-left group"
                >
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-100 relative bg-slate-200">
                        <img src={u.image || `https://ui-avatars.com/api/?name=${u.name}`} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">{u.name || "Unknown Agent"}</h4>
                        <p className="text-xs font-medium text-slate-400">{u.role || "Operative"}</p>
                    </div>
                </button>
            ))}
        </div>
    );
};
