import { useRef, useEffect } from "react";
import { Smile, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import EmojiPicker from 'emoji-picker-react';

export const ChatInput = ({ 
    newMessage, 
    setNewMessage, 
    handleSendMessage, 
    activeChatUser, 
    showEmojiPicker, 
    setShowEmojiPicker,
    onEmojiClick
}) => {
    const emojiRef = useRef();

    // Close Emoji Picker on Click Outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiRef.current && !emojiRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setShowEmojiPicker]);

    return (
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
    );
};
