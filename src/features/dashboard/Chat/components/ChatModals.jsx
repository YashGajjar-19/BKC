import { useState, useEffect } from "react";
import { X, Save, Hash } from "lucide-react";
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { motion, AnimatePresence } from "framer-motion";

export const Modal = ( { isOpen, onClose, title, children } ) =>
{
    if ( !isOpen ) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={ { opacity: 0 } } animate={ { opacity: 1 } } exit={ { opacity: 0 } }
                onClick={ onClose } className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
                initial={ { scale: 0.95, opacity: 0 } } animate={ { scale: 1, opacity: 1 } } exit={ { scale: 0.95, opacity: 0 } }
                className="relative bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">{ title }</h3>
                    <button onClick={ onClose } className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                        <X size={ 20 } />
                    </button>
                </div>
                <div className="p-0 overflow-y-auto custom-scrollbar flex-1">
                    { children }
                </div>
            </motion.div>
        </div>
    );
};

export const GroupSettings = ( { chatId, chatData, onClose } ) =>
{
    const [ name, setName ] = useState( chatData.name || "" );
    const [ avatar, setAvatar ] = useState( chatData.avatar || "" );
    const [ loading, setLoading ] = useState( false );

    const handleSave = async ( e ) =>
    {
        e.preventDefault();
        setLoading( true );
        try
        {
            await updateDoc( doc( db, "chats", chatId ), {
                name: name,
                avatar: avatar
            } );
            onClose();
        } catch ( error )
        {
            console.error( "Error updating group:", error );
        }
        setLoading( false );
    };

    return (
        <form onSubmit={ handleSave } className="p-6 space-y-6">
            <div className="space-y-4">
                <div className="flex justify-center">
                    <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-300 relative overflow-hidden">
                        { avatar ? (
                            <img src={ avatar } className="w-full h-full object-cover" />
                        ) : (
                            <Hash size={ 32 } />
                        ) }
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Group Avatar URL</label>
                    <input
                        value={ avatar } onChange={ ( e ) => setAvatar( e.target.value ) }
                        placeholder="https://example.com/image.png"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Group Name</label>
                <input
                    value={ name } onChange={ ( e ) => setName( e.target.value ) }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors"
                />
            </div>

            <button type="submit" disabled={ loading } className="w-full py-3 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-900/10 transition-all flex items-center justify-center gap-2">
                { loading ? "Saving..." : <><Save size={ 18 } /> Save Settings</> }
            </button>
        </form>
    );
};
