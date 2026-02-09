// src/features/public/HomeTeam.jsx
import { motion } from "framer-motion";
import { members } from "../../lib/data";
import { Sparkles, Crown, ArrowUpRight, Zap, ArrowRight, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HomeTeam() {
  const navigate = useNavigate();

  // Helper to determine grid span
  const getGridSpan = (index) => {
    if (index === 0) return "md:col-span-2 md:row-span-2 min-h-[500px]"; // Founder (Big)
    if (index === 1) return "md:col-span-1 md:row-span-2"; // Tall
    return "md:col-span-1 md:row-span-1 min-h-[300px]"; // Standard
  };

  return (
    <section id="crew" className="py-32 relative overflow-hidden bg-slate-50">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-100/50 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-fuchsia-100/50 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2 pointer-events-none mix-blend-multiply" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
          <div className="space-y-4">
             <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-indigo-600 text-xs font-bold uppercase tracking-widest border border-indigo-100 shadow-sm"
              >
                <Crown size={14} className="text-indigo-600" />
                Hall of Fame
             </motion.div>
             <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9]"
             >
                Meet the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600">Legends.</span>
             </motion.h2>
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xl text-slate-500 font-medium max-w-sm md:text-right leading-relaxed"
          >
            The brilliant minds behind the chaos. Select a profile to authenticate.
          </motion.p>
        </div>

        {/* --- THE BENTO GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {members.map((member, idx) => {
            const gridSpan = getGridSpan(idx);
            // Dynamic Backgrounds for a richer feel
            const bgClass = idx === 0 ? "bg-slate-900" : (idx % 2 === 0 ? "bg-indigo-50" : "bg-white");
            
            return (
              <motion.div
                key={member.id}
                layoutId={`card-${member.id}`}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5, type: 'spring', bounce: 0.3 }}
                onClick={() => navigate(`/profile/${member.id}`)}
                whileHover={{ y: -8, scale: 1.01 }}
                className={`group relative rounded-[2.5rem] flex flex-col justify-between overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 border border-slate-100 ${gridSpan} ${bgClass}`}
              >
                
                {/* --- IMAGE LAYER --- */}
                {/* Improved positioning: using flex to align image to bottom */}
                <div className="absolute inset-0 z-0 flex items-end justify-center overflow-hidden rounded-[2.5rem]">
                   
                   {/* Background Gradient behind image to make it pop */}
                   <div className={`absolute inset-0 ${
                       idx === 0 ? 'bg-gradient-to-b from-transparent to-slate-900/90' : 'bg-gradient-to-b from-transparent via-transparent to-slate-900/10'
                   }`} />
                   
                   {/* Image - Better Object Position */}
                   <img 
                     src={member.image} 
                     alt={member.name}
                     className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 ${
                       idx === 0 
                        ? 'object-top' // Founder: Focus on top/center
                        : 'object-center md:object-cover scale-[0.85] translate-y-4 group-hover:translate-y-2' // Others: Slightly smaller to fit frame, move up on hover
                     } ${
                        // Refined Grayscale Logic: Color by default, vivid on hover.
                        // Or if user insists on grayscale:
                        // 'grayscale-[0.5] group-hover:grayscale-0' // Subtle grayscale
                        'filter saturate-[0.8] group-hover:saturate-100' // Better approach: slightly desaturated -> full color
                     }`} 
                   />
                   
                   {/* Text Protection Gradient */}
                   <div className={`absolute inset-0 z-10 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-80 transition-opacity duration-300 ${
                       idx === 0 ? 'via-slate-900/40' : 'from-slate-900/60'
                   }`} />
                </div>

                {/* --- FLOATING BADGE (Top Right) --- */}
                <div className="relative z-20 p-6 flex justify-between items-start w-full">
                   {idx === 0 && (
                      <div className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg animate-pulse">
                         System Admin
                      </div>
                   )}
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 group-hover:scale-110 ml-auto border ${
                      idx === 0 ? 'bg-white/20 text-white border-white/20' : 'bg-white/90 text-slate-900 border-white/50 shadow-sm'
                   }`}>
                      {idx === 0 ? <Crown size={16} /> : <ArrowUpRight size={18} />}
                   </div>
                </div>

                {/* --- CONTENT LAYER (Bottom) --- */}
                <div className="relative z-20 p-6 pt-0 mt-auto transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
                   
                   {/* Role Tag */}
                   <div className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                          idx === 0 ? 'bg-indigo-500/20 text-indigo-200 border border-indigo-500/30' : 'bg-white/20 text-white border border-white/20'
                      }`}>
                         <Sparkles size={10} />
                         {member.title}
                      </span>
                   </div>

                   {/* Name & Title */}
                   <div>
                      <h3 className={`font-black leading-none mb-1.5 tracking-tight text-white ${
                          idx === 0 ? 'text-4xl md:text-5xl' : 'text-2xl'
                      }`}>
                         {member.name}
                      </h3>
                      <p className="text-white/70 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
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
             className="md:col-span-1 md:row-span-1 rounded-[2.5rem] bg-indigo-600 p-8 flex flex-col items-center justify-center text-center text-white cursor-pointer hover:bg-indigo-500 transition-all group relative overflow-hidden shadow-xl shadow-indigo-600/30 hover:-translate-y-1"
          >
             {/* Abstract Shapes */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-[60px] opacity-20 group-hover:opacity-30 transition-opacity" />
             <div className="absolute bottom-0 left-0 w-32 h-32 bg-fuchsia-500 rounded-full blur-[60px] opacity-40 group-hover:opacity-50 transition-opacity" />
             
             <div className="relative z-10 w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/20 group-hover:scale-110 transition-transform rotate-3 group-hover:rotate-6">
                <Zap size={32} className="text-yellow-300 fill-yellow-300" />
             </div>
             
             <h3 className="text-2xl font-black mb-2">Join Us?</h3>
             <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest mb-6">
                Hiring chaos.
             </p>
             
             <div className="inline-flex items-center gap-2 text-sm font-bold bg-white text-indigo-600 px-6 py-3 rounded-xl hover:shadow-lg transition-all active:scale-95">
                Apply Now <ArrowRight size={16} />
             </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}