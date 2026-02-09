
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";
import {
    Send, Search, MoreHorizontal, Image, Smile, Shield,
    Hash, Plus, MessageSquare, ArrowLeft, Phone, Video, Paperclip, Bell,
    Settings, Users, Edit2, X, Check, Save
} from "lucide-react";
import { 
    collection, 
    addDoc, 
    query, 
    orderBy, 
    onSnapshot, 
    serverTimestamp,
    limit,
    where,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    getDocs
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { members as staticMembers } from '../../../lib/data';
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import EmojiPicker from 'emoji-picker-react';

// --- Components ---

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
            />
            <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="relative bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">{title}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-0 overflow-y-auto custom-scrollbar flex-1">
                    {children}
                </div>
            </motion.div>
        </div>
    );
};

const GroupSettings = ({ chatId, chatData, onClose }) => {
    const [name, setName] = useState(chatData.name || "");
    const [avatar, setAvatar] = useState(chatData.avatar || "");
    const [loading, setLoading] = useState(false);

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateDoc(doc(db, "chats", chatId), {
                name: name,
                avatar: avatar
            });
            onClose();
        } catch (error) {
            console.error("Error updating group:", error);
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSave} className="p-6 space-y-6">
            <div className="space-y-4">
                <div className="flex justify-center">
                    <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-300 relative overflow-hidden">
                         {avatar ? (
                             <img src={avatar} className="w-full h-full object-cover" />
                         ) : (
                             <Hash size={32} />
                         )}
                    </div>
                </div>
                
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Group Avatar URL</label>
                    <input 
                        value={avatar} onChange={(e) => setAvatar(e.target.value)}
                        placeholder="https://example.com/image.png"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                </div>
            </div>
            
            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Group Name</label>
                <input 
                    value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors"
                />
            </div>

            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-900/10 transition-all flex items-center justify-center gap-2">
                {loading ? "Saving..." : <><Save size={18} /> Save Settings</>}
            </button>
        </form>
    );
};

const NewChatList = ({ onSelect }) => {
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


// --- Main Component ---

// --- Helper Functions ---
const isSameDay = (d1, d2) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
};

const getMessageDateLabel = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (isSameDay(date, today)) return "Today";
    if (isSameDay(date, yesterday)) return "Yesterday";
    return date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
};

const CommChannel = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const uidParam = searchParams.get('uid');

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null); // Document ID or null
    const [activeChatUser, setActiveChatUser] = useState(null); // User info for display OR Group info
    const [searchTerm, setSearchTerm] = useState("");
    const [showMobileChat, setShowMobileChat] = useState(false);
    
    // UI States
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showScrollButton, setShowScrollButton] = useState(false);

    // Modals
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isNewChatOpen, setIsNewChatOpen] = useState(false);

    const scrollRef = useRef();
    const messagesEndRef = useRef();
    const emojiRef = useRef();

    // Helper: Get consistent Chat ID for 1-1 chats
    const getChatId = (uid1, uid2) => {
        return [uid1, uid2].sort().join("_");
    };

    // Close Emoji Picker on Click Outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiRef.current && !emojiRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Scroll Logic
    const scrollToBottom = (behavior = "smooth") => {
        messagesEndRef.current?.scrollIntoView({ behavior });
        setShowScrollButton(false);
    };

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
        setShowScrollButton(!isNearBottom);
    };


    // 0. Ensure "Bakchodi" Group Exists & User is in it
    useEffect(() => {
        if (!user) return;
        
        const ensureGroup = async () => {
            const groupId = "group_bakchodi";
            const groupRef = doc(db, "chats", groupId);
            
            try {
                const groupDoc = await getDoc(groupRef);
                if (!groupDoc.exists()) {
                    await setDoc(groupRef, {
                        type: "group",
                        name: "Bakchodi Only 🚫🧠",
                        participants: [user.uid], // Start with current user
                        createdAt: serverTimestamp(),
                        updatedAt: serverTimestamp(),
                        lastMessage: {
                           text: "Welcome to the layer (cake).",
                           senderId: "system",
                           createdAt: new Date().toISOString()
                        }
                    });
                } else {
                    const data = groupDoc.data();
                    if (!data.participants?.includes(user.uid)) {
                        await updateDoc(groupRef, {
                            participants: [...(data.participants || []), user.uid]
                        });
                    }
                }
            } catch (e) {
                console.error("Group init error:", e);
            }
        };
        
        ensureGroup();
    }, [user]);

    // 1. Load Chats List
    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, "chats"),
            where("participants", "array-contains", user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const chatList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            .sort((a, b) => { // Client-side sort to avoid index requirements
                const t1 = a.updatedAt?.seconds || 0;
                const t2 = b.updatedAt?.seconds || 0;
                return t2 - t1; // Descending
            });
            
            setChats(chatList);
        });

        return () => unsubscribe();
    }, [user]);

    // 2. Handle URL Param (Start/Open Chat)
    useEffect(() => {
        if (!user || !uidParam) return;

        const initChat = async () => {
            // Check if user is trying to open the GROUP
            if (uidParam === 'group_bakchodi') {
                const group = chats.find(c => c.id === 'group_bakchodi');
                if (group) {
                    setActiveChat(group.id);
                    setActiveChatUser({ ...group }); // It's a group object, not user
                    setShowMobileChat(true);
                    return;
                }
            }

            const targetUid = uidParam;
            const chatId = getChatId(user.uid, targetUid);

            // Check if chat exists in our loaded list first
            const existingChat = chats.find(c => c.id === chatId);

            if (existingChat) {
                setActiveChat(existingChat.id);
                const otherUser = existingChat.participantData?.[targetUid] || { name: "Unknown", image: null };
                setActiveChatUser({ uid: targetUid, ...otherUser });
                setShowMobileChat(true);
            } else {
                // New Chat
                let targetUser = staticMembers.find(m => String(m.id) === targetUid || m.uid === targetUid);
                
                if (!targetUser) {
                    try {
                         const userDoc = await getDoc(doc(db, "users", targetUid));
                         if (userDoc.exists()) {
                             targetUser = { uid: targetUid, ...userDoc.data() };
                         }
                    } catch (e) { console.error("Error fetching user", e); }
                }

                if (!targetUser) targetUser = { uid: targetUid, name: "Unknown User", image: null };

                setActiveChat(chatId); 
                setActiveChatUser(targetUser); 
                setShowMobileChat(true);
            }
        };

        const timer = setTimeout(initChat, 100); // Small delay to let chats load
        return () => clearTimeout(timer);
    }, [uidParam, user, chats]);

    // 3. Load Messages for Active Chat
    useEffect(() => {
        if (!activeChat) return;

        const q = query(
            collection(db, "chats", activeChat, "messages"),
            orderBy("createdAt", "asc"),
            limit(100)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setMessages(msgs);
            // Only auto-scroll if we are near bottom or just loaded
            setTimeout(() => scrollToBottom(), 100);
        });

        return () => unsubscribe();
    }, [activeChat]);


    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChat) return;

        const msgText = newMessage.trim();
        setNewMessage(""); // Optimistic clear
        setShowEmojiPicker(false);

        try {
            const chatRef = doc(db, "chats", activeChat);
            const chatDoc = await getDoc(chatRef);

            if (!chatDoc.exists()) {
                // Create Chat Doc First (Only for DM 1-on-1 mostly)
                const participantData = {
                    [user.uid]: { 
                        name: user.name || "Unknown", 
                        image: user.image || null 
                    },
                    [activeChatUser.uid || activeChatUser.id]: { 
                        name: activeChatUser.name || "Unknown", 
                        image: activeChatUser.image || null 
                    }
                };

                await setDoc(chatRef, {
                    type: "direct",
                    participants: [user.uid, String(activeChatUser.uid || activeChatUser.id)],
                    participantData,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                    lastMessage: {
                        text: msgText,
                        senderId: user.uid,
                        createdAt: new Date().toISOString()
                    }
                });
            } else {
                // Update existing chat
                await updateDoc(chatRef, {
                    lastMessage: {
                        text: msgText,
                        senderId: user.uid,
                        senderName: user.name, 
                        createdAt: new Date().toISOString()
                    },
                    updatedAt: serverTimestamp()
                });
            }

            // Add Message to Subcollection
            await addDoc(collection(db, "chats", activeChat, "messages"), {
                text: msgText,
                senderId: user.uid,
                createdAt: serverTimestamp(),
                senderName: user.name,
                senderImage: user.image || null
            });
            
            // Auto scroll to bottom on send
            setTimeout(() => scrollToBottom(), 50);

        } catch (error) {
            console.error("Error sending message:", error);
            alert("Failed to send message.");
        }
    };

    const handleSelectChat = (chat) => {
        setActiveChat(chat.id);
        
        if (chat.type === 'group' || chat.id === 'group_bakchodi') {
             setActiveChatUser({ ...chat, isGroup: true });
        } else {
            const otherId = chat.participants.find(p => p !== user.uid);
            const otherUser = chat.participantData?.[otherId] || { name: "Unknown", image: null };
            setActiveChatUser({ uid: otherId, ...otherUser });
        }
        setShowMobileChat(true);
        // Delay to allow view to switch before scrolling
        setTimeout(() => scrollToBottom("auto"), 100);
    };

    const handleNewChatSelect = (selectedUser) => {
        const uid = selectedUser.uid || selectedUser.id || selectedUser.email;
        navigate(`/chat?uid=${uid}`);
        setIsNewChatOpen(false);
    };

    // Filter Logic for Sidebar
    const filteredChats = chats.filter(c => {
        let name = c.name; // Group name or undefined
        if (!name) {
             const otherId = c.participants.find(p => p !== user.uid);
             name = c.participantData?.[otherId]?.name || "Unknown";
        }
        return name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const onEmojiClick = (emojiObject) => {
        setNewMessage(prev => prev + emojiObject.emoji);
    };

    // Message Grouping & Divider Logic
    let lastDate = null;

    return (
        <div className="h-[calc(100vh-80px)] md:h-screen bg-white flex w-full overflow-hidden font-sans selection:bg-indigo-500 selection:text-white relative">
            
            {/* --- SIDEBAR LIST --- */}
            <div className={`w-full md:w-[380px] flex flex-col border-r border-slate-200 bg-white shrink-0 relative z-20 ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
                
                {/* Header */}
                <div className="h-16 md:h-20 flex items-center justify-between px-4 md:px-6 border-b border-slate-100 shrink-0">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="p-2 -ml-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all">
                            <ArrowLeft size={20} />
                        </Link>
                        <h2 className="font-bold text-xl text-slate-900 tracking-tight">Messages</h2>
                    </div>
                    <button 
                        onClick={() => setIsNewChatOpen(true)}
                        className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-900/10 hover:scale-105 transition-transform"
                    >
                        <Plus size={18} />
                    </button>
                </div>

                {/* Search */}
                <div className="px-4 md:px-5 py-4 shrink-0">
                    <div className="relative group">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search conversations..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white rounded-xl py-3 pl-10 pr-4 text-sm font-semibold text-slate-700 placeholder:text-slate-400 border border-slate-200 focus:border-slate-300 focus:ring-4 focus:ring-slate-100 transition-all outline-none"
                        />
                    </div>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-4 space-y-1">
                    {filteredChats.length === 0 && (
                        <div className="p-8 text-center text-slate-400 text-sm font-medium">
                            No conversations yet.<br/>Start a new chat!
                        </div>
                    )}
                    
                    {filteredChats.map(chat => {
                        const isGroup = chat.type === 'group' || chat.id === 'group_bakchodi';
                        let displayName = chat.name;
                        let displayImage = chat.avatar;
                        let statusColor = 'bg-slate-300';
                        
                        if (!isGroup) {
                            const otherId = chat.participants.find(p => p !== user.uid);
                            const otherUser = chat.participantData?.[otherId] || { name: "Unknown", image: null };
                            displayName = otherUser.name;
                            displayImage = otherUser.image;
                            statusColor = 'bg-emerald-500'; // Assume active for DMs
                        } else {
                            statusColor = 'bg-indigo-500'; // Group active
                        }

                        const isActive = activeChat === chat.id;

                        return (
                            <div 
                                key={chat.id}
                                onClick={() => handleSelectChat(chat)}
                                className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200 group ${
                                    isActive 
                                    ? "bg-slate-900 shadow-md shadow-slate-900/10" 
                                    : "hover:bg-slate-50"
                                }`}
                            >
                                <div className="relative shrink-0">
                                    <div className={`w-12 h-12 rounded-full overflow-hidden border border-slate-100 relative ${isGroup ? 'bg-indigo-50 flex items-center justify-center' : 'bg-slate-200'}`}>
                                         {isGroup && !displayImage ? (
                                             <Hash size={20} className={isActive ? "text-indigo-200" : "text-indigo-500"} />
                                         ) : (
                                             <img src={displayImage || `https://ui-avatars.com/api/?name=${displayName}`} className="w-full h-full object-cover" />
                                         )}
                                    </div>
                                    <span className={`absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2 ${isActive ? `border-slate-900 ${statusColor}` : `border-white ${statusColor}`}`} />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <h4 className={`font-bold text-sm truncate ${isActive ? "text-white" : "text-slate-900"}`}>{displayName}</h4>
                                        <span className={`text-[10px] font-medium ${isActive ? "text-slate-400" : "text-slate-400"}`}>
                                            {chat.lastMessage?.createdAt ? new Date(chat.lastMessage.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : ''}
                                        </span>
                                    </div>
                                    <p className={`text-xs truncate ${isActive ? "text-slate-300 font-medium" : "font-medium text-slate-500"}`}>
                                        {chat.lastMessage?.senderId === user.uid ? "You: " : (isGroup && chat.lastMessage?.senderName ? `${chat.lastMessage.senderName.split(' ')[0]}: ` : "")}
                                        {chat.lastMessage?.text || "Started a chat"}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* --- MAIN CHAT AREA --- */}
            <div className={`flex-1 flex flex-col bg-slate-50/50 relative w-full h-full ${showMobileChat ? 'flex' : 'hidden md:flex'}`}>
                
                {activeChat ? (
                    <>
                        {/* Header */}
                        <div className="h-16 md:h-20 px-4 md:px-8 border-b border-slate-200 bg-white/80 backdrop-blur-md flex justify-between items-center sticky top-0 z-10 transition-all">
                            <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                                <button 
                                    onClick={() => setShowMobileChat(false)}
                                    className="p-1 -ml-2 text-slate-400 hover:text-slate-900 md:hidden"
                                >
                                    <ArrowLeft size={24} />
                                </button>
                            
                                <div className="flex items-center gap-3 overflow-hidden" onClick={() => (activeChatUser?.isGroup) && setIsSettingsOpen(true)}>
                                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden shadow-sm border border-slate-200 relative shrink-0 ${activeChatUser?.isGroup ? 'cursor-pointer hover:opacity-80' : ''}`}>
                                        {activeChatUser?.isGroup && !activeChatUser.avatar ? (
                                             <div className="w-full h-full bg-indigo-50 flex items-center justify-center text-indigo-500"><Hash size={18} /></div>
                                        ) : (
                                            <img src={activeChatUser?.image || activeChatUser?.avatar || `https://ui-avatars.com/api/?name=${activeChatUser?.name}`} className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                    <div className={`min-w-0 ${activeChatUser?.isGroup ? 'cursor-pointer' : ''}`}>
                                        <h3 className="font-bold text-base md:text-lg text-slate-900 leading-tight truncate flex items-center gap-2">
                                            {activeChatUser?.name || "Loading..."}
                                            {activeChatUser?.isGroup && <Settings size={14} className="text-slate-300" />}
                                        </h3>
                                        <div className="flex items-center gap-1.5 cursor-default">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            <span className="text-[10px] md:text-[11px] font-semibold text-slate-500 truncate">
                                                {activeChatUser?.isGroup ? `${messages.length} Messages` : "Active Now"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Messages Feed */}
                        <div 
                            onScroll={handleScroll}
                            className="flex-1 overflow-y-auto p-4 md:p-8 space-y-2 custom-scrollbar pb-24 md:pb-8"
                        >
                            
                            {messages.map((msg, idx) => {
                                const isMe = msg.senderId === user?.uid;
                                
                                // Grouping Logic:
                                // Show avatar ONLY if:
                                // 1. First message ever
                                // 2. Different sender from previous message
                                // 3. Previous message was > 5 mins ago (optional, but good)
                                const prevMsg = messages[idx - 1];
                                const isDifferentSender = !prevMsg || prevMsg.senderId !== msg.senderId;
                                const showAvatar = isDifferentSender; // Simplify for now
                                
                                const showName = (activeChatUser?.isGroup && !isMe && showAvatar);
                                
                                // Group styling: Add top margin if different sender
                                const mtClass = isDifferentSender && idx !== 0 ? "mt-4" : "mt-1";

                                // Date Dividers
                                const msgDate = msg.createdAt?.seconds ? new Date(msg.createdAt.seconds * 1000) : new Date();
                                let dateDivider = null;
                                
                                if (!lastDate || !isSameDay(lastDate, msgDate)) {
                                    dateDivider = (
                                        <div key={`date-${msg.id}`} className="flex justify-center my-6 sticky top-2 z-10">
                                            <span className="bg-slate-200/80 backdrop-blur text-slate-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                                                {getMessageDateLabel(msgDate)}
                                            </span>
                                        </div>
                                    );
                                    lastDate = msgDate;
                                }

                                return (
                                    <div key={msg.id}>
                                        {dateDivider}
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex gap-3 md:gap-4 ${isMe ? "flex-row-reverse" : "flex-row"} ${mtClass}`}
                                        >
                                            <div className="w-8 md:w-10 flex-shrink-0 flex flex-col justify-end">
                                                {showAvatar && !isMe ? (
                                                    <img src={msg.senderImage || `https://ui-avatars.com/api/?name=${msg.senderName}`} className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-slate-100 shadow-sm object-cover" />
                                                ) : <div className="w-8 md:w-10" />}
                                            </div>

                                            <div className={`max-w-[85%] md:max-w-[70%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                                                {showName && (
                                                    <span className="text-[10px] font-bold text-slate-400 ml-1 mb-1">{msg.senderName}</span>
                                                )}
                                                <div 
                                                    className={`px-4 py-2 md:px-5 md:py-3 text-[14px] md:text-[15px] leading-relaxed shadow-sm break-words relative group/msg ${
                                                        isMe 
                                                        ? "bg-slate-900 text-white rounded-2xl rounded-tr-none" 
                                                        : "bg-white text-slate-700 border border-slate-100 rounded-2xl rounded-tl-none"
                                                    }`}
                                                >
                                                    {msg.text}
                                                    <span className={`text-[9px] font-bold ml-2 opacity-50 inline-block translate-y-[1px] ${isMe ? "text-slate-300" : "text-slate-400"}`}>
                                                        {msg.createdAt?.seconds ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Scroll Button */}
                        <AnimatePresence>
                             {showScrollButton && (
                                 <motion.button
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    onClick={() => scrollToBottom()}
                                    className="absolute bottom-24 right-8 bg-slate-900 text-white p-3 rounded-full shadow-xl z-20 hover:scale-110 transition-transform"
                                 >
                                     <ArrowLeft size={20} className="-rotate-90" />
                                 </motion.button>
                             )}
                        </AnimatePresence>

                        {/* Input Area */}
                        <div className="p-3 md:p-6 bg-white border-t border-slate-200 relative">
                             {/* Emoji Picker Popover */}
                             <AnimatePresence>
                                {showEmojiPicker && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                        className="absolute bottom-full left-4 md:left-8 mb-4 z-50 shadow-2xl rounded-3xl overflow-hidden border border-slate-100"
                                        ref={emojiRef}
                                    >
                                        <EmojiPicker onEmojiClick={onEmojiClick} theme="light" searchDisabled={false} width={350} height={400} />
                                    </motion.div>
                                )}
                             </AnimatePresence>

                             <form 
                                onSubmit={handleSendMessage}
                                className="flex items-center gap-2 md:gap-3 max-w-4xl mx-auto"
                             >
                                 <div className="flex-1 bg-slate-50 hover:bg-slate-100 focus-within:bg-white border border-slate-200 focus-within:border-slate-300 focus-within:ring-4 focus-within:ring-slate-50 rounded-xl transition-all flex items-center px-3 py-2 md:px-4 md:py-3">
                                     <input 
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder={`Message ${activeChatUser?.isGroup ? activeChatUser.name : (activeChatUser?.name || "..." )}`}
                                        className="flex-1 bg-transparent border-none outline-none font-medium text-slate-700 placeholder:text-slate-400 text-sm md:text-base min-w-0"
                                    />
                                    <div className="flex items-center gap-2 md:gap-3 pl-2 border-l border-slate-200 ml-2">
                                        <button 
                                            type="button" 
                                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                            className={`transition-colors ${showEmojiPicker ? "text-indigo-500 scale-110" : "text-slate-400 hover:text-slate-600"}`}
                                        >
                                            <Smile size={20} />
                                        </button>
                                    </div>
                                 </div>

                                 <button 
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="p-3 md:p-3.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-300 transition-all shadow-lg shadow-slate-900/10 active:scale-95 flex items-center justify-center transform group shrink-0"
                                >
                                    <Send size={18} strokeWidth={2} className={newMessage.trim() ? "translate-x-0.5" : ""} />
                                </button>
                             </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center p-8 text-center opacity-50 select-none">
                        <div>
                            <MessageSquare size={48} className="mx-auto text-slate-300 mb-4" />
                            <h3 className="text-xl font-bold text-slate-400">Select a conversation</h3>
                            <p className="text-slate-400 max-w-xs mx-auto mt-2">Choose from the list or start a new chat using the + button.</p>
                        </div>
                    </div>
                )}
            </div>
            
            {/* ... Modal Code ... */}
            <AnimatePresence>
                {isSettingsOpen && activeChatUser?.isGroup && (
                    <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="Group Settings">
                        <GroupSettings 
                            chatId={activeChat} 
                            chatData={activeChatUser} 
                            onClose={() => setIsSettingsOpen(false)} 
                        />
                    </Modal>
                )}
                {isNewChatOpen && (
                    <Modal isOpen={isNewChatOpen} onClose={() => setIsNewChatOpen(false)} title="New Message">
                        <NewChatList onSelect={handleNewChatSelect} />
                    </Modal>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CommChannel;
