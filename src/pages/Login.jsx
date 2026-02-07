import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Lock, ChevronLeft, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { members } from '../data';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [selectedUser, setSelectedUser] = useState(null);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setPassword('');
        setError('');
    };

    const handleBackToGrid = () => {
        setSelectedUser(null);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        await new Promise(resolve => setTimeout(resolve, 800));

        if (selectedUser.password === password) {
            login(selectedUser);
            navigate('/dashboard');
        } else {
            setError('Access Denied: Invalid Credentials');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen h-screen bg-slate-50 flex items-center justify-center p-4 lg:p-8 font-sans relative selection:bg-fuchsia-500/30 overflow-hidden">

            {/* --- No Scrollbar Hack --- */}
            <style>{`
                ::-webkit-scrollbar { display: none; }
                * { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            {/* --- Pro Back Button --- */}
            <motion.button
                onClick={() => navigate('/')}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ width: "auto" }}
                className="fixed top-8 left-8 z-50 group flex items-center gap-3 bg-white/80 backdrop-blur-xl px-2 py-2 pr-4 rounded-full shadow-lg shadow-indigo-500/10 border border-white/50 hover:border-indigo-200 transition-all duration-300"
            >
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                    <ArrowLeft size={18} className="text-slate-600 group-hover:text-indigo-600 transition-colors" />
                </div>
                <div className="flex flex-col items-start overflow-hidden whitespace-nowrap">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-indigo-400 transition-colors">
                        Return
                    </span>
                    <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                        To Universe
                    </span>
                </div>
            </motion.button>

            {/* --- Main Card --- */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row h-auto lg:h-[750px] border border-slate-100"
            >
                {/* --- Left Column: Gradient Branding --- */}
                <div className="lg:w-5/12 relative overflow-hidden p-12 lg:p-16 flex flex-col justify-between shrink-0 bg-blue-600">
                    
                    {/* Mesh Gradient Emulation */}
                    <div className="absolute inset-0 pointer-events-none">
                        {/* Cyan/Blue Top Left */}
                        <div className="absolute -top-[10%] -left-[10%] w-[80%] h-[80%] bg-[#00C6FF] rounded-full mix-blend-screen blur-[100px] opacity-60"></div>
                        {/* Purple Top Right */}
                        <div className="absolute -top-[10%] -right-[20%] w-[70%] h-[70%] bg-[#9D00FA] rounded-full mix-blend-screen blur-[120px] opacity-70"></div>
                        {/* Deep Blue Bottom Left */}
                        <div className="absolute -bottom-[20%] -left-[10%] w-[80%] h-[80%] bg-[#0055FF] rounded-full mix-blend-screen blur-[100px] opacity-80"></div>
                        {/* White/Pink Glow Bottom Right */}
                        <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-[#FF5ACD] rounded-full mix-blend-screen blur-[100px] opacity-50"></div>
                        {/* White Hotspot */}
                        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-white rounded-full mix-blend-overlay blur-[60px] opacity-60"></div>
                    </div>

                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>

                    <div className="relative z-10">
                        <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center p-0.5 shadow-xl shadow-indigo-500/10 mb-8 border border-white/40">
                            <div className="bg-white/40 w-full h-full rounded-[14px] flex items-center justify-center border border-white/50">
                                <span className="font-bold text-xl text-white drop-shadow-md">B</span>
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black font-display tracking-tight leading-tight mb-6 text-white drop-shadow-sm">
                            Secure <br />
                            <span className="text-white drop-shadow-md">
                                Access Point.
                            </span>
                        </h1>
                        <p className="text-white/90 text-lg leading-relaxed max-w-sm font-medium drop-shadow-sm">
                            Identify yourself to access the command center. <br />
                            <span className="text-white font-bold opacity-100">Security protocols active.</span>
                        </p>
                    </div>

                    <div className="relative z-10 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-indigo-900 bg-white/30 w-fit px-4 py-2 rounded-full backdrop-blur-md border border-white/40 shadow-lg">
                        <ShieldCheck size={14} className="text-indigo-800" />
                        System v2.4.0 Active
                    </div>
                </div>



                {/* --- Right Column: Interaction Area --- */}
                <div className="lg:w-7/12 p-8 lg:p-20 bg-white relative flex flex-col justify-center overflow-y-auto">
                    <div className="max-w-md mx-auto w-full">
                        <AnimatePresence mode="wait">
                            {!selectedUser ? (
                                <motion.div
                                    key="user-grid"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h2 className="text-3xl font-black text-slate-900 mb-8 font-display tracking-tight">Select Identity</h2>

                                    <div className="grid grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 pb-2">
                                        {members.map((member) => (
                                            <button
                                                key={member.id}
                                                onClick={() => handleUserSelect(member)}
                                                className="group flex flex-col items-center p-6 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-100 transition-all duration-300 relative overflow-hidden"
                                            >
                                                <div className="w-16 h-16 rounded-full overflow-hidden mb-4 ring-4 ring-white shadow-md group-hover:scale-110 transition-transform duration-300 relative z-10">
                                                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                                </div>
                                                <span className="font-bold text-slate-700 group-hover:text-slate-900 transition-colors text-sm relative z-10">{member.name}</span>
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1 group-hover:text-indigo-500 transition-colors relative z-10">{member.role.split('&')[0]}</span>

                                                {/* Hover Gradient BG */}
                                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="password-form"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <button
                                        onClick={handleBackToGrid}
                                        className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 text-xs font-bold uppercase tracking-widest mb-8 transition-colors group"
                                    >
                                        <div className="p-1.5 rounded-full bg-slate-100 group-hover:bg-indigo-50 transition-colors">
                                            <ChevronLeft size={14} />
                                        </div>
                                        Switch User
                                    </button>

                                    <div className="flex items-center gap-6 mb-10">
                                        <div className="w-24 h-24 rounded-[2rem] overflow-hidden ring-4 ring-slate-50 shadow-2xl shadow-indigo-500/10">
                                            <img src={selectedUser.image} alt={selectedUser.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black font-display text-slate-900 tracking-tight">{selectedUser.name}</h2>
                                            <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                                                <span className="font-bold text-indigo-600 uppercase tracking-widest text-[10px]">{selectedUser.title}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Security Passcode</label>
                                            <div className="relative group">
                                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                                    <Lock size={20} />
                                                </div>
                                                <input
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="w-full bg-slate-50 border-2 border-slate-100 text-slate-900 text-lg font-bold rounded-2xl py-5 pl-14 pr-4 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-300"
                                                    placeholder="••••••••"
                                                    autoFocus
                                                />
                                            </div>
                                        </div>

                                        {error && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-2xl flex items-center gap-3 border border-red-100"
                                            >
                                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                                {error}
                                            </motion.div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full py-5 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed mt-4 bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500"
                                        >
                                            {isLoading ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            ) : (
                                                <>
                                                    <span>Authenticate</span>
                                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}