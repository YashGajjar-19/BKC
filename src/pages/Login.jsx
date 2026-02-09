// src/pages/Login.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ShieldCheck, Loader2, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { members } from '../lib/data';
import logo from '../assets/images/grp_bit/Logo.png';

export default function Login ()
{
    const navigate = useNavigate();
    const { loginWithGoogle } = useAuth();

    const [ selectedUser, setSelectedUser ] = useState( null );
    const [ error, setError ] = useState( '' );
    const [ isLoading, setIsLoading ] = useState( false );

    const handleUserSelect = ( user ) =>
    {
        setSelectedUser( user );
        setError( '' );
    };

    const handleBackToGrid = () =>
    {
        setSelectedUser( null );
        setError( '' );
    };

    // Unified Login Handler
    const handleLogin = async ( isCoreLogin ) =>
    {
        setError( '' );
        setIsLoading( true );

        // Pass ID if it's a Core member, otherwise null (which triggers auto-signup)
        const result = await loginWithGoogle( isCoreLogin ? selectedUser.id : null );

        if ( result.success )
        {
            navigate( '/dashboard' );
        } else
        {
            setError( result.error );
            setIsLoading( false );
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center lg:p-8 font-sans relative selection:bg-fuchsia-500/30 overflow-hidden">

            {/* --- No Scrollbar Hack --- */ }
            <style>{ `
                ::-webkit-scrollbar { display: none; }
                * { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            {/* --- Pro Back Button --- */ }
            <motion.button
                onClick={ () => navigate( '/' ) }
                initial={ { opacity: 0, x: -20 } }
                animate={ { opacity: 1, x: 0 } }
                className="fixed top-6 left-6 z-[60] group flex items-center justify-center rounded-full transition-all duration-300 w-12 h-12 lg:w-14 lg:h-14 shadow-lg border border-white/20 hover:scale-105 active:scale-95 bg-white/20 backdrop-blur-md text-white lg:bg-blue-600 lg:text-white lg:border-white/50 lg:shadow-indigo-500/10"
            >
                <ChevronLeft size={ 24 } />
            </motion.button>

            <motion.div className="w-full max-w-6xl bg-white lg:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row h-screen lg:h-[720px] border-none lg:border border-slate-100">

                {/* --- Left Column: Gradient Branding (SAME AS BEFORE) --- */ }
                <div className="w-full lg:w-5/12 h-[50vh] lg:h-auto relative overflow-hidden p-8 lg:p-16 flex flex-col justify-end lg:justify-between shrink-0 bg-blue-600 pb-16 lg:pb-16 transition-all duration-500">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute -top-[10%] -left-[10%] w-[80%] h-[80%] bg-[#00C6FF] rounded-full mix-blend-screen blur-[100px] opacity-60"></div>
                        <div className="absolute -top-[10%] -right-[20%] w-[70%] h-[70%] bg-[#9D00FA] rounded-full mix-blend-screen blur-[120px] opacity-70"></div>
                        <div className="absolute -bottom-[20%] -left-[10%] w-[80%] h-[80%] bg-[#0055FF] rounded-full mix-blend-screen blur-[100px] opacity-80"></div>
                        <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-[#FF5ACD] rounded-full mix-blend-screen blur-[100px] opacity-50"></div>
                        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-white rounded-full mix-blend-overlay blur-[60px] opacity-60"></div>
                    </div>
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>

                    <div className="relative z-10 w-full">
                        <div className="h-12 w-12 lg:h-14 lg:w-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-xl shadow-indigo-500/10 mb-6 lg:mb-8 border border-white/40 overflow-hidden">
                            <img src={ logo } alt="Logo" className="w-full h-full object-cover" />
                        </div>

                        <span>
                            <h1 className="text-3xl lg:text-5xl font-black font-display tracking-tight leading-tight mb-4 lg:mb-6 text-white drop-shadow-sm">
                                Welcome to the <br />
                                <span className="text-white drop-shadow-md">BKC Command Center</span>
                            </h1>
                        </span>

                        <p className="text-white/90 text-sm lg:text-lg leading-relaxed max-w-sm font-medium drop-shadow-sm hidden md:block">
                            Identify yourself to access the command center.
                        </p>
                    </div>
                </div>

                {/* --- Right Column: Interaction Area --- */ }
                <div className="flex-1 lg:w-7/12 bg-white relative z-20 rounded-t-[2.5rem] -mt-12 lg:mt-0 lg:rounded-none flex flex-col overflow-hidden shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] lg:shadow-none">
                    <div className="h-full overflow-y-auto p-6 md:p-8 lg:p-12 scroll-smooth">
                        <div className="max-w-md mx-auto w-full min-h-full flex flex-col justify-center">
                            <AnimatePresence mode="wait">

                                { !selectedUser ? (
                                    <motion.div
                                        key="user-grid"
                                        initial={ { opacity: 0, y: 20 } }
                                        animate={ { opacity: 1, y: 0 } }
                                        exit={ { opacity: 0, y: -20 } }
                                        className="py-4"
                                    >
                                        <h2 className="text-2xl lg:text-3xl font-black text-slate-900 mb-6 lg:mb-8 font-display tracking-tight text-center lg:text-left">Select Identity</h2>

                                        {/* Core Team Grid */ }
                                        <div className="grid grid-cols-2 gap-3 lg:gap-4 mb-8">
                                            { members.map( ( member ) => (
                                                <button
                                                    key={ member.id }
                                                    onClick={ () => handleUserSelect( member ) }
                                                    className="group flex flex-col items-center p-4 lg:p-5 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-100 transition-all duration-300 relative overflow-hidden"
                                                >
                                                    <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full overflow-hidden mb-3 ring-4 ring-white shadow-md group-hover:scale-110 transition-transform duration-300 relative z-10">
                                                        <img src={ member.image } alt={ member.name } className="w-full h-full object-cover" />
                                                    </div>
                                                    <span className="font-bold text-slate-700 group-hover:text-slate-900 transition-colors text-xs lg:text-sm relative z-10">{ member.name }</span>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1 group-hover:text-indigo-500 transition-colors relative z-10 text-center">{ member.role.split( '&' )[ 0 ] }</span>
                                                </button>
                                            ) ) }
                                        </div>

                                        {/* Separator */ }
                                        <div className="relative mb-6">
                                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                                            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400 font-bold tracking-widest">Or</span></div>
                                        </div>

                                        {/* GENERAL LOGIN / SIGNUP BUTTON */ }
                                        <button
                                            onClick={ () => handleLogin( false ) }
                                            disabled={ isLoading }
                                            className="w-full py-4 bg-white border-2 border-slate-100 text-slate-600 font-bold rounded-xl hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-3 group disabled:opacity-70"
                                        >
                                            { isLoading ? (
                                                <Loader2 size={ 20 } className="animate-spin text-indigo-600" />
                                            ) : (
                                                <>
                                                    <Users size={ 20 } className="group-hover:scale-110 transition-transform" />
                                                    <span>Agent Login / Sign Up</span>
                                                </>
                                            ) }
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="auth-form"
                                        initial={ { opacity: 0, x: 20 } }
                                        animate={ { opacity: 1, x: 0 } }
                                        exit={ { opacity: 0, x: -20 } }
                                        className="py-4"
                                    >
                                        <button
                                            onClick={ handleBackToGrid }
                                            className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 text-xs font-bold uppercase tracking-widest mb-8 transition-colors group"
                                        >
                                            <div className="p-1.5 rounded-full bg-slate-100 group-hover:bg-indigo-50 transition-colors">
                                                <ChevronLeft size={ 14 } />
                                            </div>
                                            Switch User
                                        </button>

                                        <div className="flex items-center gap-6 mb-10">
                                            <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-[2rem] overflow-hidden ring-4 ring-slate-50 shadow-2xl shadow-indigo-500/10">
                                                <img src={ selectedUser.image } alt={ selectedUser.name } className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl lg:text-3xl font-black font-display text-slate-900 tracking-tight">{ selectedUser.name }</h2>
                                                <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                                                    <span className="font-bold text-indigo-600 uppercase tracking-widest text-[10px]">{ selectedUser.title }</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
                                                <p className="text-slate-500 text-sm font-medium mb-4">
                                                    Verify identity via Google Workspace.
                                                </p>

                                                { error && (
                                                    <motion.div initial={ { opacity: 0 } } animate={ { opacity: 1 } } className="p-3 mb-4 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100">
                                                        { error }
                                                    </motion.div>
                                                ) }

                                                <button
                                                    onClick={ () => handleLogin( true ) }
                                                    disabled={ isLoading }
                                                    className="w-full py-4 text-white font-bold rounded-xl shadow-xl shadow-indigo-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group disabled:opacity-70 bg-slate-900 hover:bg-slate-800"
                                                >
                                                    { isLoading ? <Loader2 size={ 20 } className="animate-spin text-white" /> : "Authenticate" }
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) }
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}