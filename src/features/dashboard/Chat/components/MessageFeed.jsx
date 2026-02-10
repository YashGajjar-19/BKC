import { motion } from "framer-motion";

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

export const MessageFeed = ({ messages, user, activeChatUser, handleScroll, messagesEndRef }) => {
    let lastDate = null;

    return (
        <div 
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4 md:p-8 space-y-2 custom-scrollbar pb-24 md:pb-8"
        >
            {messages.map((msg, idx) => {
                const isMe = msg.senderId === user?.uid;
                
                // Grouping Logic:
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
                                    {msg.fileUrl && (
                                        <div className="mb-2 rounded-lg overflow-hidden border border-slate-700/20">
                                            {msg.fileType?.startsWith('image/') ? (
                                                <img src={msg.fileUrl} alt="Attachment" className="max-w-full h-auto max-h-60 object-cover cursor-pointer hover:scale-105 transition-transform" />
                                            ) : msg.fileType?.startsWith('video/') ? (
                                                <video src={msg.fileUrl} controls className="max-w-full h-auto max-h-60" />
                                            ) : (
                                                <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 bg-slate-800/10 hover:bg-slate-800/20 rounded-lg transition-colors">
                                                    <span className="text-xs font-bold underline">Download File</span>
                                                </a>
                                            )}
                                        </div>
                                    )}
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
    );
};
