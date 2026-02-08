// src/features/public/HomeTeam.jsx
import { motion } from "framer-motion";
import { members } from "../../data";
import { Sparkles, Crown, ArrowUpRight, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HomeTeam() {
  const navigate = useNavigate();

  // Helper to determine grid span based on index
  const getGridSpan = (index) => {
    if (index === 0) return "md:col-span-2 md:row-span-2"; // Hero Card (Big)
    if (index === 1) return "md:col-span-1 md:row-span-2"; // Tall Card
    return "md:col-span-1 md:row-span-1"; // Standard Card
  };

  // Helper to determine background color style
  const getCardStyle = (index) => {
    if (index === 0) return "bg-slate-900 text-white border-slate-800"; // Dark Theme for Founder
    if (index === 1) return "bg-[#F0F4FF] text-slate-900 border-indigo-100"; // Light Indigo
    if (index % 3 === 0) return "bg-[#FFF0F5] text-slate-900 border-pink-100"; // Light Pink
    return "bg-white text-slate-900 border-slate-200"; // Standard White
  };

  return (
    <section id="crew" className="py-32 relative overflow-hidden bg-slate-50">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-50/50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-fuchsia-50/50 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
          <div className="space-y-6">
             <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-indigo-600 text-xs font-bold uppercase tracking-widest border border-indigo-100 shadow-sm"
              >
                <Crown size={12} />
                Hall of Fame
             </motion.div>
             <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9]"
             >
                Meet the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600">Legends.</span>
             </motion.h2>
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-lg text-slate-500 font-medium max-w-sm md:text-right leading-relaxed"
          >
            The brilliant minds behind the chaos. Select a profile to authenticate and access the command center.
          </motion.p>
        </div>

        {/* --- THE BENTO GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[minmax(280px,auto)]">
          {members.map((member, idx) => {
            const gridSpan = getGridSpan(idx);
            const cardStyle = getCardStyle(idx);
            
            return (
              <motion.div
                key={member.id}
                layoutId={`card-${member.id}`}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5, type: 'spring', bounce: 0.3 }}
                onClick={() => navigate(`/profile/${member.id}`)} // Go to Profile Page
                className={`group relative rounded-[2.5rem] p-6 flex flex-col justify-between overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-1 border ${gridSpan} ${cardStyle}`}
              >
                
                {/* --- IMAGE LAYER --- */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                   {/* Gradient Overlay for text readability */}
                   <div className={`absolute inset-0 z-10 transition-opacity duration-500 pointer-events-none ${
                      idx === 0 ? 'bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent opacity-90' : 'bg-gradient-to-t from-white/90 via-white/50 to-transparent opacity-0 group-hover:opacity-100'
                   }`} />
                   
                   {/* Image */}
                   <img 
                     src={member.image} 
                     alt={member.name}
                     className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${
                       idx === 0 ? 'opacity-80' : 'opacity-100' // Dark overlay for Founder, clear for others
                     }`} 
                   />
                </div>

                {/* --- FLOATING BADGE (Top Right) --- */}
                <div className="relative z-20 flex justify-between items-start w-full">
                   {idx === 0 && (
                      <div className="px-3 py-1 rounded-full bg-indigo-500/20 backdrop-blur-md border border-indigo-500/30 text-indigo-300 text-[10px] font-bold uppercase tracking-widest shadow-lg animate-pulse">
                         System Admin
                      </div>
                   )}
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 group-hover:scale-110 ml-auto ${
                      idx === 0 ? 'bg-white/10 text-white border border-white/10' : 'bg-white/80 text-indigo-600 shadow-sm border border-white/50'
                   }`}>
                      {idx === 0 ? <Crown size={18} /> : <ArrowUpRight size={18} />}
                   </div>
                </div>

                {/* --- CONTENT LAYER (Bottom) --- */}
                <div className={`relative z-20 transition-transform duration-300 transform translate-y-2 group-hover:translate-y-0`}>
                   
                   {/* Role Tag */}
                   <div className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                          idx === 0 ? 'bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 backdrop-blur-md' : 'bg-white text-indigo-600 shadow-sm border border-indigo-50'
                      }`}>
                         <Sparkles size={10} />
                         {member.title}
                      </span>
                   </div>

                   {/* Name & Title */}
                   <div>
                      <h3 className={`font-black leading-tight mb-1 ${
                          idx === 0 ? 'text-4xl md:text-5xl text-white drop-shadow-xl' : 'text-2xl text-slate-900'
                      }`}>
                         {member.name}
                      </h3>
                      <p className={`text-xs font-bold uppercase tracking-widest ${
                          idx === 0 ? 'text-indigo-300' : 'text-slate-500'
                      }`}>
                         {member.role}
                      </p>
                   </div>
                </div>

              </motion.div>
            );
          })}

          {/* --- "JOIN US" CTA CARD (Last Card) --- */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="md:col-span-1 md:row-span-1 rounded-[2.5rem] bg-indigo-600 p-8 flex flex-col items-center justify-center text-center text-white cursor-pointer hover:bg-indigo-700 transition-colors group relative overflow-hidden"
          >
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
             <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap size={32} className="text-yellow-300" />
             </div>
             <h3 className="text-2xl font-black mb-2">Join Us?</h3>
             <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest">
                We are hiring chaos.
             </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}