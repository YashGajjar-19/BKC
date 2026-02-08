// src/features/dashboard/Missions.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import
    {
        Plus, CheckCircle2, Clock, AlertTriangle,
        Trash2, MoreVertical, Target, ShieldAlert
    } from "lucide-react";
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";
import { members } from "../../data";

export default function Missions ()
{
    const { user } = useAuth();
    const [ missions, setMissions ] = useState( [] );
    const [ isModalOpen, setIsModalOpen ] = useState( false );
    const [ loading, setLoading ] = useState( true );

    // Form State
    const [ newTask, setNewTask ] = useState( "" );
    const [ targetAgent, setTargetAgent ] = useState( "" );
    const [ priority, setPriority ] = useState( "medium" );

    const isAdmin = user?.role?.includes( "Founder" ) || user?.role?.includes( "Admin" );

    // 1. Real-time Listener
    useEffect( () =>
    {
        const q = query( collection( db, "missions" ), orderBy( "createdAt", "desc" ) );
        const unsubscribe = onSnapshot( q, ( snapshot ) =>
        {
            setMissions( snapshot.docs.map( doc => ( { id: doc.id, ...doc.data() } ) ) );
            setLoading( false );
        } );
        return () => unsubscribe();
    }, [] );

    // 2. Add Mission (Admin Only)
    const handleDeploy = async ( e ) =>
    {
        e.preventDefault();
        if ( !newTask || !targetAgent ) return;

        await addDoc( collection( db, "missions" ), {
            title: newTask,
            assignedTo: targetAgent, // Store the ID or Name
            assignedBy: user.name,
            status: "pending", // pending, active, completed
            priority,
            createdAt: new Date(),
        } );

        setIsModalOpen( false );
        setNewTask( "" );
        setTargetAgent( "" );
    };

    // 3. Update Status
    const toggleStatus = async ( mission ) =>
    {
        const nextStatus = mission.status === "pending" ? "completed" : "pending";
        await updateDoc( doc( db, "missions", mission.id ), { status: nextStatus } );
    };

    // 4. Delete (Admin Only)
    const handleDelete = async ( id ) =>
    {
        if ( !isAdmin ) return;
        await deleteDoc( doc( db, "missions", id ) );
    };

    // Helper to get Agent Image
    const getAgentImage = ( nameOrId ) =>
    {
        const agent = members.find( m => m.name === nameOrId || m.id === nameOrId );
        return agent ? agent.image : null;
    };

    return (
        <div className="space-y-8">

            {/* --- Header --- */ }
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Active Directives</h2>
                    <p className="text-slate-500 font-medium">
                        Manage and execute tactical prank operations.
                    </p>
                </div>

                { isAdmin && (
                    <button
                        onClick={ () => setIsModalOpen( true ) }
                        className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-xl shadow-indigo-500/20 hover:bg-indigo-600 transition-all active:scale-95"
                    >
                        <Plus size={ 20 } /> Deploy Directive
                    </button>
                ) }
            </div>

            {/* --- Mission Grid --- */ }
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    { missions.map( ( mission ) => (
                        <motion.div
                            layout
                            initial={ { opacity: 0, scale: 0.95 } }
                            animate={ { opacity: 1, scale: 1 } }
                            exit={ { opacity: 0, scale: 0.95 } }
                            key={ mission.id }
                            className={ `group relative bg-white border rounded-3xl p-6 transition-all duration-300 ${ mission.status === 'completed'
                                    ? 'border-emerald-100 bg-emerald-50/30'
                                    : 'border-slate-200 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5'
                                }` }
                        >
                            {/* Header: Priority & Actions */ }
                            <div className="flex justify-between items-start mb-4">
                                <span className={ `px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${ mission.priority === 'high'
                                        ? 'bg-red-50 text-red-600 border-red-100'
                                        : mission.priority === 'medium'
                                            ? 'bg-amber-50 text-amber-600 border-amber-100'
                                            : 'bg-slate-100 text-slate-500 border-slate-200'
                                    }` }>
                                    { mission.priority } Priority
                                </span>

                                { isAdmin && (
                                    <button
                                        onClick={ () => handleDelete( mission.id ) }
                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={ 16 } />
                                    </button>
                                ) }
                            </div>

                            {/* Title */ }
                            <h3 className={ `text-lg font-bold text-slate-900 mb-6 leading-snug ${ mission.status === 'completed' ? 'line-through text-slate-400' : ''
                                }` }>
                                { mission.title }
                            </h3>

                            {/* Footer: Assignee & Checkbox */ }
                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white shadow-sm">
                                        <img
                                            src={ getAgentImage( mission.assignedTo ) || "https://via.placeholder.com/150" }
                                            alt="Agent"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Operative</span>
                                        <span className="text-xs font-bold text-slate-700">{ mission.assignedTo }</span>
                                    </div>
                                </div>

                                <button
                                    onClick={ () => toggleStatus( mission ) }
                                    className={ `w-10 h-10 rounded-full flex items-center justify-center transition-all ${ mission.status === 'completed'
                                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                            : 'bg-slate-100 text-slate-300 hover:bg-indigo-600 hover:text-white'
                                        }` }
                                >
                                    <CheckCircle2 size={ 20 } />
                                </button>
                            </div>
                        </motion.div>
                    ) ) }
                </AnimatePresence>
            </div>

            { missions.length === 0 && !loading && (
                <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-3xl">
                    <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900">All Clear</h3>
                    <p className="text-slate-500">No active operations. The world is safe... for now.</p>
                </div>
            ) }

            {/* --- ADD MISSION MODAL --- */ }
            <AnimatePresence>
                { isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={ { opacity: 0 } } animate={ { opacity: 1 } } exit={ { opacity: 0 } }
                            onClick={ () => setIsModalOpen( false ) }
                            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={ { scale: 0.95, opacity: 0 } } animate={ { scale: 1, opacity: 1 } } exit={ { scale: 0.95, opacity: 0 } }
                            className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 overflow-hidden"
                        >
                            <h2 className="text-2xl font-black text-slate-900 mb-6">Deploy New Directive</h2>

                            <form onSubmit={ handleDeploy } className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold uppercase text-slate-500 ml-1">Mission Details</label>
                                    <textarea
                                        autoFocus
                                        placeholder="e.g. Replace all of Rahul's desktop icons with screenshots..."
                                        className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-xl p-4 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 h-32 resize-none"
                                        value={ newTask }
                                        onChange={ ( e ) => setNewTask( e.target.value ) }
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold uppercase text-slate-500 ml-1">Assign Agent</label>
                                        <select
                                            className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-slate-700 outline-none focus:border-indigo-500"
                                            value={ targetAgent }
                                            onChange={ ( e ) => setTargetAgent( e.target.value ) }
                                        >
                                            <option value="">Select Operative</option>
                                            { members.map( m => (
                                                <option key={ m.id } value={ m.name }>{ m.name }</option>
                                            ) ) }
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold uppercase text-slate-500 ml-1">Priority Level</label>
                                        <select
                                            className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-slate-700 outline-none focus:border-indigo-500"
                                            value={ priority }
                                            onChange={ ( e ) => setPriority( e.target.value ) }
                                        >
                                            <option value="low">Low (Casual)</option>
                                            <option value="medium">Medium (Standard)</option>
                                            <option value="high">High (Code Red)</option>
                                        </select>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-indigo-600 transition-colors shadow-lg mt-4"
                                >
                                    Initiate Operation
                                </button>
                            </form>
                        </motion.div>
                    </div>
                ) }
            </AnimatePresence>
        </div>
    );
}   