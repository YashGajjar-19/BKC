// src/pages/Profile.jsx
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, DollarSign, Sparkles, Briefcase, User } from "lucide-react";
import { members } from "../data";
import PublicLayout from "../components/layouts/PublicLayout";

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Find member by ID (ensure type safety with parseInt)
  const member = members.find((m) => m.id === parseInt(id));

  if (!member) return <div className="text-center py-20">Agent Not Found</div>;

  return (
    <PublicLayout>
      <div className="pt-8 pb-20 relative">
        
        {/* --- Background Ambient Light --- */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-indigo-50/50 to-transparent blur-3xl -z-10 pointer-events-none" />

        {/* --- Navigation --- */}
        <div className="max-w-7xl mx-auto px-6">
            <button 
                onClick={() => navigate(-1)}
                className="mb-8 flex items-center gap-2 px-5 py-2 bg-white/50 backdrop-blur-md border border-white rounded-full text-slate-500 font-bold hover:bg-white hover:shadow-lg transition-all"
            >
            <ArrowLeft size={18} /> <span className="text-xs uppercase tracking-widest">Return to Base</span>
            </button>

            {/* --- THE BENTO GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[180px]">
            
            {/* 1. HERO CARD (2x2) - Image & Name */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="md:col-span-2 md:row-span-2 relative rounded-[2.5rem] overflow-hidden group shadow-2xl shadow-indigo-500/10"
            >
                <img 
                src={member.image} 
                alt={member.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                
                <div className="absolute bottom-8 left-8 text-white">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">{member.name}</h1>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg border border-white/10">
                    <Briefcase size={14} className="text-indigo-300" />
                    <span className="text-xs font-bold uppercase tracking-widest">{member.role}</span>
                </div>
                </div>
            </motion.div>

            {/* 2. STAT: AGE (1x1) */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
                className="bg-[#F0F4FF] rounded-[2.5rem] p-8 flex flex-col justify-between border border-indigo-100/50 hover:border-indigo-200 transition-colors"
            >
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-indigo-500 shadow-sm">
                    <User size={20} />
                </div>
                <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Agent Age</p>
                    <p className="text-4xl font-black text-slate-900">{member.age}</p>
                </div>
            </motion.div>

            {/* 3. STAT: DOB (1x1) */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                className="bg-[#FFF0F5] rounded-[2.5rem] p-8 flex flex-col justify-between border border-pink-100/50 hover:border-pink-200 transition-colors"
            >
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-pink-500 shadow-sm">
                    <Calendar size={20} />
                </div>
                <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Born On</p>
                    <p className="text-2xl font-black text-slate-900">{member.dob.split(',')[0]}</p>
                    <p className="text-sm font-bold text-slate-500">{member.dob.split(',')[1]}</p>
                </div>
            </motion.div>

            {/* 4. DESCRIPTION (2x1 or 2x2 based on text) */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="md:col-span-2 bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-center relative overflow-hidden"
            >
                {/* Decor */}
                <Sparkles className="absolute top-8 right-8 text-yellow-400 animate-pulse" size={32} />
                
                <h3 className="text-xl font-black text-slate-900 mb-4">Classified File</h3>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                    "{member.description}"
                </p>
            </motion.div>

            {/* 5. STAT: SALARY (1x1) */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
                className="bg-[#F0FFF4] rounded-[2.5rem] p-8 flex flex-col justify-between border border-emerald-100/50 hover:border-emerald-200 transition-colors"
            >
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-emerald-500 shadow-sm">
                    <DollarSign size={20} />
                </div>
                <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Bounty</p>
                    <p className="text-2xl font-black text-slate-900 tracking-tight">{member.salary}</p>
                </div>
            </motion.div>

            {/* 6. POSTS FEED (3x1 Wide) */}
            <div className="md:col-span-4 mt-8">
                <h3 className="text-2xl font-black text-slate-900 mb-6 px-4">Recent Activity</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {member.posts?.map((post, idx) => (
                    <motion.div 
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + (idx * 0.1) }}
                        className="group relative h-64 rounded-[2rem] overflow-hidden cursor-pointer"
                    >
                        <img src={post.image} alt="Post" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                            <p className="text-white font-bold text-sm">{post.caption}</p>
                        </div>
                    </motion.div>
                    ))}
                </div>
            </div>

            </div>
        </div>
      </div>
    </PublicLayout>
  );
}
