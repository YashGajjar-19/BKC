import { ArrowLeft, Hash, Settings, MessageSquare } from "lucide-react";

export const ChatHeader = ( { activeChatUser, setShowMobileChat, messages, setIsSettingsOpen } ) =>
{
    return (
        <div className="h-16 md:h-20 px-4 md:px-8 border-b border-slate-200 bg-white/80 backdrop-blur-md flex justify-between items-center sticky top-0 z-10 transition-all">
            <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                <button
                    onClick={ () => setShowMobileChat( false ) }
                    className="p-1 -ml-2 text-slate-400 hover:text-slate-900 md:hidden"
                >
                    <ArrowLeft size={ 24 } />
                </button>

                <div className="flex items-center gap-3 overflow-hidden" onClick={ () => ( activeChatUser?.isGroup ) && setIsSettingsOpen( true ) }>
                    <div className={ `w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden shadow-sm border border-slate-200 relative shrink-0 ${ activeChatUser?.isGroup ? 'cursor-pointer hover:opacity-80' : '' }` }>
                        { activeChatUser?.isGroup && !activeChatUser.avatar ? (
                            <div className="w-full h-full bg-indigo-50 flex items-center justify-center text-indigo-500"><Hash size={ 18 } /></div>
                        ) : (
                            <img src={ activeChatUser?.image || activeChatUser?.avatar || `https://ui-avatars.com/api/?name=${ activeChatUser?.name }` } className="w-full h-full object-cover" />
                        ) }
                    </div>
                    <div className={ `min-w-0 ${ activeChatUser?.isGroup ? 'cursor-pointer' : '' }` }>
                        <h3 className="font-bold text-base md:text-lg text-slate-900 leading-tight truncate flex items-center gap-2">
                            { activeChatUser?.name || "Loading..." }
                            { activeChatUser?.isGroup && <Settings size={ 14 } className="text-slate-300" /> }
                        </h3>
                        <div className="flex items-center gap-1.5 cursor-default">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span className="text-[10px] md:text-[11px] font-semibold text-slate-500 truncate">
                                { activeChatUser?.isGroup ? `${ messages.length } Messages` : "Active Now" }
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const EmptyChat = () => (
    <div className="flex-1 flex items-center justify-center p-8 text-center opacity-50 select-none">
        <div>
            <MessageSquare size={ 48 } className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-400">Select a conversation</h3>
            <p className="text-slate-400 max-w-xs mx-auto mt-2">Choose from the list or start a new chat using the + button.</p>
        </div>
    </div>
);
