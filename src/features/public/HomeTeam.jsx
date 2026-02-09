// src/features/public/HomeTeam.jsx
import { motion } from "framer-motion";
import { Sparkles, Crown, ArrowUpRight, Zap, ArrowRight, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { members } from "../../lib/data";

export default function HomeTeam() {
  const navigate = useNavigate();


  // Helper to determine grid span
  const getGridSpan = (index) => {
    if (index === 0) return "col-span-2 md:col-span-2 md:row-span-2 h-[450px] md:h-auto md:min-h-[500px]"; // Founder (Big)
    if (index === 1) return "col-span-1 md:col-span-1 md:row-span-2 h-[280px] md:h-auto"; // Tall
    if (index === members.length - 1) return "col-span-2 md:col-span-2 md:row-span-1 h-[280px] md:h-auto md:min-h-[300px]"; // Last item spans 2
    return "col-span-1 md:col-span-1 md:row-span-1 h-[280px] md:h-auto md:min-h-[300px]"; // Standard
  };

  return (
    <section id="crew" className="py-16 md:py-32 relative overflow-hidden bg-slate-50">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-indigo-100/50 rounded-full blur-[80px] md:blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-fuchsia-100/50 rounded-full blur-[80px] md:blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2 pointer-events-none mix-blend-multiply" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 md:mb-16 gap-6 md:gap-8">
          <div className="space-y-3 md:space-y-4">
             <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white text-indigo-600 text-[10px] md:text-xs font-bold uppercase tracking-widest border border-indigo-100 shadow-sm"
              >
                <Crown size={12} className="md:w-3.5 md:h-3.5" />
                Hall of Fame
             </motion.div>
             <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl sm:text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9]"
             >
                Meet the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600">Legends.</span>
             </motion.h2>
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-base md:text-xl text-slate-500 font-medium max-w-sm md:text-right leading-relaxed"
          >
            The brilliant minds behind the chaos. Select a profile to authenticate.
          </motion.p>
        </div>

        {/* --- THE BENTO GRID --- */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
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
                className={`group relative rounded-[1.5rem] md:rounded-[2.5rem] flex flex-col justify-between overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 ${gridSpan} ${bgClass}`}
              >
                
                {/* --- IMAGE LAYER --- */}
                {/* Improved positioning: using flex to align image to bottom */}
                <div className="absolute inset-0 z-0 flex items-end justify-center overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem]">
                   
                   {/* Background Gradient behind image to make it pop */}
                   <div className={`absolute inset-0 ${
                       idx === 0 ? 'bg-gradient-to-b from-transparent to-slate-900/90' : 'bg-gradient-to-b from-transparent via-transparent to-slate-900/10'
                   }`} />
                   
                   {/* Image - Better Object Position */}
                   <img 
                     src={member.image} 
                     alt={member.name}
                     className={`w-full h-full object-cover object-top transition-all duration-700 ease-out ${
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
                <div className="relative z-20 p-4 md:p-6 flex justify-between items-start w-full">
                   {idx === 0 && (
                      <div className="px-2 py-1 md:px-3 md:py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[8px] md:text-[10px] font-bold uppercase tracking-widest shadow-lg animate-pulse">
                         System Admin
                      </div>
                   )}
                   <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 group-hover:scale-110 ml-auto border ${
                      idx === 0 ? 'bg-white/20 text-white border-white/20' : 'bg-white/90 text-slate-900 border-white/50 shadow-sm'
                   }`}>
                      {idx === 0 ? <Crown size={14} className="md:w-4 md:h-4" /> : <ArrowUpRight size={14} className="md:w-[18px] md:h-[18px]" />}
                   </div>
                </div>

                {/* --- CONTENT LAYER (Bottom) --- */}
                <div className="relative z-20 p-4 md:p-6 pt-0 mt-auto transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
                   
                   {/* Role Tag */}
                   <div className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                      <span className={`inline-flex items-center gap-1 md:gap-1.5 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                          idx === 0 ? 'bg-indigo-500/20 text-indigo-200 border border-indigo-500/30' : 'bg-white/20 text-white border border-white/20'
                      }`}>
                         <Sparkles size={8} className="md:w-[10px] md:h-[10px]" />
                         {member.title}
                      </span>
                   </div>

                   {/* Name & Title */}
                   <div>
                      <h3 className={`font-black leading-none mb-1 tracking-tight text-white ${
                          idx === 0 ? 'text-2xl md:text-5xl' : 'text-lg md:text-2xl'
                      }`}>
                         {member.name}
                      </h3>
                      <p className="text-white/70 text-[10px] md:text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                         {member.role}
                      </p>
                   </div>
                </div>

              </motion.div>
            );
          })}

        </div>
      </div>
    </section>
  );
}