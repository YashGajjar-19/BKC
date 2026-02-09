// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, DollarSign, Sparkles, Briefcase, User, Target, CheckCircle2, Clock, Image, Edit2, Save, X } from "lucide-react";
import { collection, query, where, getDocs, orderBy, doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";

export default function Profile ()
{
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, members } = useAuth(); // Get global members state
    const [ missions, setMissions ] = useState( [] );
    const [ loading, setLoading ] = useState( true );
    
    // Edit Mode State (for admins)
    const [ isEditing, setIsEditing ] = useState( false );
    const [ newEmail, setNewEmail ] = useState( "" );
    const [ isSaving, setIsSaving ] = useState( false );

    // Find member by ID (ensure type safety with parseInt)
    // Use the dynamic 'members' not the static one
    const member = members.find( ( m ) => m.id === parseInt( id ) );

    // Initialize editing state
    useEffect(() => {
        if (member) setNewEmail(member.email || "");
    }, [member]);

    const handleUpdateEmail = async () => {
        if (!newEmail || !member) return;
        setIsSaving(true);
        try {
            const memberRef = doc(db, "members", String(member.id));
            await updateDoc(memberRef, { email: newEmail });
            // Ideally should update local state via context refresh, but for now strict reload or optimistic update needed?
            // Since context fetches on mount, we might need to rely on the fact that if we update DB,
            // next refresh will be correct. For immediate UI feedback, we should update locally or reload.
            alert("Email updated successfully! The user needs to re-login.");
            setIsEditing(false);
            window.location.reload(); // Simple way to refresh context
        } catch (error) {
            console.error("Error updating email:", error);
            alert("Failed to update email.");
        } finally {
            setIsSaving(false);
        }
    };

    // Fetch Member's Missions
    useEffect( () =>
    {
        if ( !member ) return;

        const fetchMissions = async () =>
        {
            try
            {
                let fetchedMissions = [];

                if ( member.isAdmin )
                {
                    // For Admins: Fetch tasks assigned TO them AND tasks assigned BY them
                    const q1 = query( collection( db, "missions" ), where( "assignedTo", "==", member.name ) );
                    const q2 = query( collection( db, "missions" ), where( "assignedBy", "==", member.name ) );

                    const [ snap1, snap2 ] = await Promise.all( [ getDocs( q1 ), getDocs( q2 ) ] );

                    const docsMap = new Map();
                    [ ...snap1.docs, ...snap2.docs ].forEach( doc =>
                    {
                        docsMap.set( doc.id, { id: doc.id, ...doc.data() } );
                    } );
                    fetchedMissions = Array.from( docsMap.values() );
                } else
                {
                    // For Non-Admins: Only tasks assigned TO them
                    const q = query(
                        collection( db, "missions" ),
                        where( "assignedTo", "==", member.name )
                    );
                    const querySnapshot = await getDocs( q );
                    fetchedMissions = querySnapshot.docs.map( doc => ( {
                        id: doc.id,
                        ...doc.data()
                    } ) );
                }

                // Sort by createdAt descending (Client-side to handle merged lists)
                fetchedMissions.sort( ( a, b ) =>
                {
                    const getMillis = ( t ) => t?.toMillis ? t.toMillis() : t?.seconds ? t.seconds * 1000 : new Date( t ).getTime();
                    return getMillis( b.createdAt ) - getMillis( a.createdAt );
                } );

                setMissions( fetchedMissions );
            } catch ( error )
            {
                console.error( "Error fetching missions:", error );
            } finally
            {
                setLoading( false );
            }
        };

        fetchMissions();
    }, [ member ] );

    if ( !member ) return <div className="text-center py-20 font-bold text-slate-500">Agent Not Found</div>;

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
            <div className="pt-12 pb-20 relative">

                {/* --- Background Ambient Light --- */ }
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-indigo-50/50 to-transparent blur-3xl -z-10 pointer-events-none" />

                {/* --- Navigation --- */ }
                <div className="max-w-7xl mx-auto px-6">
                    <button
                        onClick={ () => navigate( "/" ) }
                        className="mb-8 flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-md border border-white rounded-full text-slate-600 font-bold hover:bg-slate-900 hover:text-white hover:shadow-lg transition-all active:scale-95 group"
                    >
                        <ArrowLeft size={ 18 } className="group-hover:-translate-x-1 transition-transform" /> <span className="text-xs uppercase tracking-widest">Return to Base</span>
                    </button>

                    {/* --- THE BENTO GRID --- */ }
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]">

                        {/* 1. PROFILE PIC CARD (2x2) - Left Side */ }
                        <motion.div
                            initial={ { opacity: 0, x: -20 } } animate={ { opacity: 1, x: 0 } }
                            className="md:col-span-2 md:row-span-3 relative rounded-[2.5rem] overflow-hidden group shadow-2xl shadow-indigo-500/10"
                        >
                            <img
                                src={ member.image }
                                alt={ member.name }
                                className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent" />

                            <div className="absolute bottom-8 left-8 text-white">
                                <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">{ member.name }</h1>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/10">
                                    <Briefcase size={ 14 } className="text-indigo-300" />
                                    <span className="text-xs font-bold uppercase tracking-widest">{ member.role }</span>
                                </div>
                                { /* Admin Controls to Edit Email */ }
                                { user?.isAdmin && (
                                    <div className="mt-4">
                                        { isEditing ? (
                                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-2 rounded-lg border border-white/20">
                                                <input 
                                                    type="email" 
                                                    value={newEmail}
                                                    onChange={(e) => setNewEmail(e.target.value)}
                                                    className="bg-transparent text-white placeholder-white/50 text-xs font-bold w-full outline-none"
                                                    placeholder="Enter Google Email"
                                                />
                                                <button onClick={handleUpdateEmail} disabled={isSaving} className="p-1 hover:bg-white/20 rounded-full transition-colors text-emerald-400">
                                                    <Save size={14} />
                                                </button>
                                                <button onClick={() => setIsEditing(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors text-rose-400">
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => setIsEditing(true)}
                                                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-indigo-200 hover:text-white transition-colors"
                                            >
                                                <Edit2 size={12} /> Edit Email Access
                                            </button>
                                        )}
                                        <p className="text-[10px] text-white/50 mt-1 font-mono">{member.email}</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* 2. STAT: DOB (1x1) */ }
                        <motion.div
                            initial={ { opacity: 0, scale: 0.9 } } animate={ { opacity: 1, scale: 1 } } transition={ { delay: 0.1 } }
                            className="bg-fuchsia-50 rounded-[2.5rem] p-8 flex flex-col justify-between border border-fuchsia-100/50 hover:border-fuchsia-200 transition-colors"
                        >
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-fuchsia-500 shadow-sm">
                                <Calendar size={ 20 } />
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Born On</p>
                                <p className="text-xl font-black text-slate-900 leading-tight">{ member.dob?.split( ',' )[ 0 ] || 'Unknown' }</p>
                                <p className="text-xs font-bold text-slate-500">{ member.dob?.split( ',' )[ 1 ] || '' }</p>
                            </div>
                        </motion.div>

                        {/* 3. STAT: AGE (1x1) */ }
                        <motion.div
                            initial={ { opacity: 0, scale: 0.9 } } animate={ { opacity: 1, scale: 1 } } transition={ { delay: 0.2 } }
                            className="bg-indigo-50 rounded-[2.5rem] p-8 flex flex-col justify-between border border-indigo-100/50 hover:border-indigo-200 transition-colors"
                        >
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-indigo-500 shadow-sm">
                                <User size={ 20 } />
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Age</p>
                                <p className="text-4xl font-black text-slate-900">{ member.age }</p>
                            </div>
                        </motion.div>

                        {/* 4. STAT: CURRENT POST (1x1) */ }
                        <motion.div
                            initial={ { opacity: 0, scale: 0.9 } } animate={ { opacity: 1, scale: 1 } } transition={ { delay: 0.3 } }
                            className="bg-sky-50 rounded-[2.5rem] p-8 flex flex-col justify-between border border-sky-100/50 hover:border-sky-200 transition-colors"
                        >
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-sky-500 shadow-sm">
                                <Briefcase size={ 20 } />
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Current Post</p>
                                <p className="text-sm font-black text-slate-900 leading-tight mb-1 line-clamp-2">{ member.role }</p>
                                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white rounded-full border border-sky-100">
                                    <span className={ `w-1.5 h-1.5 rounded-full ${ member.isAdmin ? 'bg-amber-500' : 'bg-emerald-500' }` } />
                                    <span className="text-[10px] font-bold text-sky-800 uppercase tracking-widest">{ member.title }</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* 5. STAT: SALARY (1x1) */ }
                        <motion.div
                            initial={ { opacity: 0, scale: 0.9 } } animate={ { opacity: 1, scale: 1 } } transition={ { delay: 0.4 } }
                            className="bg-emerald-50 rounded-[2.5rem] p-8 flex flex-col justify-between border border-emerald-100/50 hover:border-emerald-200 transition-colors"
                        >
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-emerald-500 shadow-sm">
                                <DollarSign size={ 20 } />
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Bounty</p>
                                <p className="text-2xl font-black text-slate-900 tracking-tight">{ member.salary }</p>
                            </div>
                        </motion.div>

                        {/* 6. DESCRIPTION (Full Width) */ }
                        <motion.div
                            initial={ { opacity: 0, y: 20 } } animate={ { opacity: 1, y: 0 } } transition={ { delay: 0.5 } }
                            className="md:col-span-2 bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-center relative overflow-hidden"
                        >
                            {/* Decor */ }
                            <Sparkles className="absolute top-8 right-8 text-yellow-400 animate-pulse" size={ 32 } />

                            <h3 className="text-xl font-black text-slate-900 mb-4">Classified File</h3>
                            <p className="text-lg text-slate-500 font-medium leading-relaxed">
                                "{ member.description }"
                            </p>
                        </motion.div>

                        {/* 6. MISSIONS FEED (Replacing Posts) */ }
                        <div className="md:col-span-4 mt-8">
                            <div className="flex items-end justify-between mb-8 px-4">
                                <div>
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Assigned Directives</h3>
                                    <p className="text-slate-500 font-medium">real-time mission log from headquarters.</p>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-widest">
                                    <Target size={ 14 } />
                                    { missions.length } Missions
                                </div>
                            </div>

                            { loading ? (
                                <div className="text-center py-12 text-slate-400 font-bold animate-pulse">Retrieving classified data...</div>
                            ) : missions.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    { missions.map( ( mission, idx ) => (
                                        <motion.div
                                            key={ mission.id }
                                            initial={ { opacity: 0, y: 20 } } animate={ { opacity: 1, y: 0 } } transition={ { delay: 0.5 + ( idx * 0.1 ) } }
                                            className={ `p-8 rounded-[2.5rem] border transition-all hover:shadow-lg ${ mission.status === 'completed'
                                                ? 'bg-emerald-50/50 border-emerald-100'
                                                : 'bg-white border-slate-100 hover:border-indigo-100'
                                                }` }
                                        >
                                            <div className="flex justify-between items-start mb-6">
                                                <span className={ `px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${ mission.priority === 'high' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                    mission.priority === 'medium' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                        'bg-slate-100 text-slate-500 border-slate-200'
                                                    }` }>
                                                    { mission.priority }
                                                </span>
                                                { mission.status === 'completed' ? (
                                                    <CheckCircle2 className="text-emerald-500" size={ 20 } />
                                                ) : (
                                                    <Clock className="text-slate-300" size={ 20 } />
                                                ) }
                                            </div>

                                            <h4 className={ `text-lg font-bold text-slate-900 mb-2 leading-tight ${ mission.status === 'completed' && 'line-through text-slate-400' }` }>
                                                { mission.title }
                                            </h4>

                                            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                                                { mission.assignedBy === member.name ? (
                                                    // If current user assigned it, show who it's assigned TO
                                                    <>
                                                        <span className="text-slate-400 font-bold uppercase tracking-wider">Assigned To</span>
                                                        <span className="font-bold text-slate-700">{ mission.assignedTo }</span>
                                                    </>
                                                ) : (
                                                    // Otherwise show who assigned it (Assigned By)
                                                    <>
                                                        <span className="text-slate-400 font-bold uppercase tracking-wider">Assigned By</span>
                                                        <span className="font-bold text-slate-700">{ mission.assignedBy }</span>
                                                    </>
                                                ) }
                                            </div>
                                        </motion.div>
                                    ) ) }
                                </div>
                            ) : (
                                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-[2.5rem]">
                                    <p className="text-slate-400 font-bold">No active directives found assigned to this agent.</p>
                                </div>
                            ) }
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
