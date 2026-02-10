import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import { 
    collection, 
    addDoc, 
    query, 
    onSnapshot, 
    serverTimestamp,
    limit,
    where,
    doc,
    getDoc,
    setDoc,
    updateDoc
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { members as staticMembers } from '../../../lib/data';
import { useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

// --- Imported Components ---
import { Modal, GroupSettings } from "./components/ChatModals";
import { NewChatList } from "./components/NewChatList";
import { SidebarList } from "./components/SidebarList";
import { MessageFeed } from "./components/MessageFeed";
import { ChatInput } from "./components/ChatInput";
import { ChatHeader, EmptyChat } from "./components/ChatHeader";


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

    // Helper: Get consistent Chat ID for 1-1 chats
    const getChatId = (uid1, uid2) => {
        return [uid1, uid2].sort().join("_");
    };

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

    return (
        <div className="h-[calc(100vh-80px)] md:h-screen bg-white flex w-full overflow-hidden font-sans selection:bg-indigo-500 selection:text-white relative">
            
            <SidebarList 
                showMobileChat={showMobileChat}
                setIsNewChatOpen={setIsNewChatOpen}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filteredChats={filteredChats}
                activeChat={activeChat}
                handleSelectChat={handleSelectChat}
                user={user}
            />

            {/* --- MAIN CHAT AREA --- */}
            <div className={`flex-1 flex flex-col bg-slate-50/50 relative w-full h-full ${showMobileChat ? 'flex' : 'hidden md:flex'}`}>
                
                {activeChat ? (
                    <>
                        <ChatHeader 
                            activeChatUser={activeChatUser}
                            setShowMobileChat={setShowMobileChat}
                            messages={messages}
                            setIsSettingsOpen={setIsSettingsOpen}
                        />

                        <MessageFeed 
                            messages={messages}
                            user={user}
                            activeChatUser={activeChatUser}
                            handleScroll={handleScroll}
                            messagesEndRef={messagesEndRef}
                        />

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

                        <ChatInput 
                            newMessage={newMessage}
                            setNewMessage={setNewMessage}
                            handleSendMessage={handleSendMessage}
                            activeChatUser={activeChatUser}
                            showEmojiPicker={showEmojiPicker}
                            setShowEmojiPicker={setShowEmojiPicker}
                            onEmojiClick={onEmojiClick}
                        />
                    </>
                ) : (
                    <EmptyChat />
                )}
            </div>
            
            {/* Modals */}
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
