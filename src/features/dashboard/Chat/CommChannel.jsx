// src/features/dashboard/Chat/CommChannel.jsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";
import {
    Send, Search, MoreHorizontal, Image, Smile, Shield,
    Hash, Plus, MessageSquare, ArrowLeft, Phone, Video, Paperclip, Bell
} from "lucide-react";
import { 
    collection, 
    addDoc, 
    query, 
    orderBy, 
    onSnapshot, 
    serverTimestamp,
    limit,
    where
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { members } from '../../../lib/data';
import { Link, useNavigate } from "react-router-dom";

const CommChannel = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [activeChat, setActiveChat] = useState("bakchodi-main"); 
    const [searchTerm, setSearchTerm] = useState("");
    const scrollRef = useRef();

    // Initialize Chats with Bakchodi Group + Members
    const [chats, setChats] = useState([
        { 
            id: "bakchodi-main", 
            name: "Bakchodi Only 🚫🧠", 
            type: "group", 
            avatar: null, 
            lastMessage: "Who changed the wifi password?", 
            time: "Now", 
            unread: 3,
            isGroup: true,
            isOnline: true
        },
        ...members.map(m => ({
            id: `dm-${m.id}`,
            name: m.name,
            type: "direct",
            avatar: m.image,
            lastMessage: "Sent you an image.",
            time: "2h",
            unread: 0,
            isGroup: false,
            memberId: m.id,
            isOnline: Math.random() > 0.3 // Simulate 70% online
        }))
    ]);

    const activeChatData = chats.find(c => c.id === activeChat) || chats[0];

    const filteredChats = chats.filter(chat => 
        chat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 1. Initial Load & Real-time Listeners
    useEffect(() => {
        if (!activeChat) return;

        let q;
        if(activeChat === 'bakchodi-main') {
            q = query(
                collection(db, "messages"),
                orderBy("createdAt", "asc"),
                limit(50)
            );
        } else {
            setMessages([]);
            return;
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages(msgs);
            setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        });

        return () => unsubscribe();
    }, [activeChat]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        if (activeChat === 'bakchodi-main') {
            await addDoc(collection(db, "messages"), {
                text: newMessage,
                createdAt: serverTimestamp(),
                uid: user.uid,
                displayName: user.name,
                photoURL: user.image,
                chatId: 'bakchodi-main'
            });
        } else {
            const tempMsg = {
                id: Date.now(),
                text: newMessage,
                uid: user.uid,
                displayName: user.name,
                photoURL: user.image,
                createdAt: null
            };
            setMessages(prev => [...prev, tempMsg]);
        }
        setNewMessage("");
    };

    return (
        <div className="h-screen bg-white flex w-full overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
            
            {/* --- SIDEBAR LIST --- */}
            <div className="w-[380px] flex flex-col border-r border-slate-200 bg-white shrink-0 relative z-20">
                
                {/* Header */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100 shrink-0">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="p-2 -ml-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all">
                            <ArrowLeft size={20} />
                        </Link>
                        <h2 className="font-bold text-xl text-slate-900 tracking-tight">Messages</h2>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-900/10">
                        <MessageSquare size={16} />
                    </div>
                </div>

                {/* Search */}
                <div className="px-5 py-4 shrink-0">
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
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-2 mt-2">All Chats</div>
                    {filteredChats.map(chat => (
                        <div 
                            key={chat.id}
                            onClick={() => setActiveChat(chat.id)}
                            className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200 group ${
                                activeChat === chat.id 
                                ? "bg-slate-900 shadow-md shadow-slate-900/10" 
                                : "hover:bg-slate-50"
                            }`}
                        >
                            <div className="relative shrink-0">
                                {chat.isGroup ? (
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-sm ${activeChat === chat.id ? 'bg-slate-800 text-white border border-slate-700' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}>
                                        <Hash size={20} />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-100 relative">
                                         <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
                                    </div>
                                )}
                                {chat.isOnline && (
                                    <span className={`absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2 ${activeChat === chat.id ? 'border-slate-900 bg-emerald-400' : 'border-white bg-emerald-500'}`} />
                                )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-0.5">
                                    <h4 className={`font-bold text-sm truncate ${activeChat === chat.id ? "text-white" : "text-slate-900"}`}>{chat.name}</h4>
                                    <span className={`text-[10px] font-medium ${activeChat === chat.id ? "text-slate-400" : "text-slate-400"}`}>{chat.time}</span>
                                </div>
                                <p className={`text-xs truncate ${activeChat === chat.id ? "text-slate-300 font-medium" : chat.unread > 0 ? "font-bold text-slate-800" : "font-medium text-slate-500"}`}>
                                    {chat.id === 'bakchodi-main' && activeChat !== chat.id ? user?.name.split(' ')[0] + ': ' : ''}{chat.lastMessage}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- MAIN CHAT AREA --- */}
            <div className="flex-1 flex flex-col bg-slate-50/50 relative">
                
                {/* Header */}
                <div className="h-20 px-8 border-b border-slate-200 bg-white/80 backdrop-blur-md flex justify-between items-center sticky top-0 z-10">
                    <div 
                        className="flex items-center gap-4 cursor-pointer group"
                        onClick={() => !activeChatData.isGroup && navigate(`/profile/${activeChatData.memberId}`)}
                    >
                        <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm border border-slate-200 relative">
                            {activeChatData?.isGroup ? (
                                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-500">
                                    <Hash size={18} />
                                </div>
                            ) : (
                                <img src={activeChatData?.avatar} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-slate-900 leading-tight group-hover:underline decoration-slate-300 decoration-2 underline-offset-2">{activeChatData?.name}</h3>
                            <div className="flex items-center gap-1.5 cursor-default">
                                <span className={`w-1.5 h-1.5 rounded-full ${activeChatData.isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                <span className="text-[11px] font-semibold text-slate-500">
                                    {activeChatData.isOnline ? 'Active Now' : 'Offline'}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                         <button className="p-2.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all">
                             <Phone size={20} className="stroke-[1.5]" />
                         </button>
                         <button className="p-2.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all">
                             <Video size={20} className="stroke-[1.5]" />
                         </button>
                         <div className="w-px h-6 bg-slate-200 mx-2" />
                         <button className="p-2.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all">
                             <MoreHorizontal size={20} className="stroke-[1.5]" />
                         </button>
                    </div>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-4 custom-scrollbar">
                    {messages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center opacity-40 select-none">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4 animate-pulse">
                                <MessageSquare size={32} />
                            </div>
                            <p className="font-bold text-slate-500">Start the conversation</p>
                            <p className="text-sm font-medium text-slate-400">Encrypted • Secure • Private</p>
                        </div>
                    )}
                    
                    {messages.map((msg, idx) => {
                        const isMe = msg.uid === user?.uid;
                        const showAvatar = idx === 0 || messages[idx - 1]?.uid !== msg.uid;

                        return (
                            <motion.div 
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex gap-4 ${isMe ? "flex-row-reverse" : "flex-row"}`}
                            >
                                <div className="w-10 flex-shrink-0 flex flex-col justify-end">
                                    {showAvatar && !isMe && (
                                        <img src={msg.photoURL || `https://ui-avatars.com/api/?name=${msg.displayName}&background=random`} className="w-10 h-10 rounded-full border border-slate-100 shadow-sm object-cover" />
                                    )}
                                </div>

                                <div className={`max-w-[70%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                                    {showAvatar && !isMe && (
                                        <span className="text-[11px] font-bold text-slate-400 ml-1 mb-1">{msg.displayName}</span>
                                    )}
                                    <div 
                                        className={`px-5 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                                            isMe 
                                            ? "bg-slate-900 text-white rounded-tr-sm" 
                                            : "bg-white text-slate-700 border border-slate-100 rounded-tl-sm"
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-300 mt-1 mx-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {msg.createdAt?.seconds ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Just now'}
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })}
                    <div ref={scrollRef} />
                </div>

                {/* Input Area */}
                <div className="p-6 bg-white border-t border-slate-200">
                     <form 
                        onSubmit={handleSendMessage}
                        className="flex items-center gap-3 max-w-4xl mx-auto"
                     >
                         <button type="button" className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors border border-slate-100">
                             <Plus size={20} strokeWidth={2} />
                         </button>
                         
                         <div className="flex-1 bg-slate-50 hover:bg-slate-100 focus-within:bg-white border border-slate-200 focus-within:border-slate-300 focus-within:ring-4 focus-within:ring-slate-50 rounded-xl transition-all flex items-center px-4 py-3">
                             <input 
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder={`Message ${activeChatData?.name}...`}
                                className="flex-1 bg-transparent border-none outline-none font-medium text-slate-700 placeholder:text-slate-400"
                            />
                            <div className="flex items-center gap-3 pl-2 border-l border-slate-200 ml-2">
                                <button type="button" className="text-slate-400 hover:text-slate-600 transition-colors"><Smile size={18} /></button>
                                <button type="button" className="text-slate-400 hover:text-slate-600 transition-colors"><Paperclip size={18} /></button>
                            </div>
                         </div>

                         <button 
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="p-3.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-300 transition-all shadow-lg shadow-slate-900/10 active:scale-95 flex items-center justify-center transform group"
                        >
                            <Send size={20} strokeWidth={2} className={newMessage.trim() ? "translate-x-0.5" : ""} />
                        </button>
                     </form>
                </div>

            </div>
        </div>
    );
};

export default CommChannel;
