import { Link } from "react-router-dom";
import { Search, Plus, ArrowLeft, Hash } from "lucide-react";

export const SidebarList = ({ 
    showMobileChat, 
    setIsNewChatOpen, 
    searchTerm, 
    setSearchTerm, 
    filteredChats, 
    activeChat, 
    handleSelectChat, 
    user 
}) => {
    return (
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
    );
};
