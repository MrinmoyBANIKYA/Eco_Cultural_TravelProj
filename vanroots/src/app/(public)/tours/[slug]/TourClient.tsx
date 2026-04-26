"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Users, Navigation, Home, Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6 }
};

interface Community {
  id?: string;
  slug?: string;
  name?: string;
  state?: string;
  coverImageUrl?: string | null;
}

export default function TourClient({ community }: { community: Community }) {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 300]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -200]);

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0d0d] text-white selection:bg-[#f6931e] selection:text-white font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="absolute top-0 w-full z-50 py-6 px-6 md:px-12 flex items-center justify-between border-b border-white/10 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-4">
           <Link href="/">
             <Button variant="ghost" size="icon" className="rounded-full bg-white/10 hover:bg-white/20 text-white">
                <ArrowLeft className="w-5 h-5" />
             </Button>
           </Link>
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#0d0d0d] font-bold text-sm">V</div>
             <span className="text-white text-lg font-bold tracking-widest uppercase">{community?.state || "DESTINATION"} TOURS</span>
           </div>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {["About", "Included", "Contacts"].map((item) => (
            <Link key={item} href={`#${item.toLowerCase()}`} className="text-white/60 hover:text-white text-sm font-medium transition-colors uppercase tracking-widest">
              {item}
            </Link>
          ))}
          <Button className="rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8">
            Book
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[120vh] flex flex-col justify-start pt-40 overflow-hidden">
        {/* Parallax Background */}
        <motion.div 
           className="absolute inset-0 z-0"
           style={{ y: y1 }}
        >
           <img 
             src={community?.coverImageUrl || "https://images.unsplash.com/photo-1540316377017-f58c70830424?q=80&w=2000&auto=format&fit=crop"} 
             alt={community?.name} 
             className="w-full h-full object-cover object-center filter brightness-50"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-black/60" />
        </motion.div>

        <div className="max-w-[1400px] mx-auto w-full px-6 relative z-10">
          <motion.h1 
            style={{ y: y2 }}
            className="text-[12vw] md:text-[15rem] font-black text-white/10 leading-none tracking-tighter text-center uppercase"
          >
            {community?.name || "DESTINATION"}
          </motion.h1>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-[-10vh] md:mt-[-20vh] relative z-20">
             {[
               { img: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=400&auto=format&fit=crop", text: "3 villages" },
               { img: "https://images.unsplash.com/photo-1626082896492-766af4eb6501?q=80&w=400&auto=format&fit=crop", text: "10 days" },
               { img: "https://images.unsplash.com/photo-1533055640609-24b498dfd74c?q=80&w=400&auto=format&fit=crop", text: "gigabytes of photos" },
               { img: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=400&auto=format&fit=crop", text: "eat local" },
               { img: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=400&auto=format&fit=crop", text: "enjoy the vibe" }
             ].map((item, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, y: 50 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.5 + i * 0.1 }}
                 className="w-24 h-40 md:w-40 md:h-64 rounded-xl overflow-hidden relative group"
               >
                 <img src={item.img} alt="Gallery" className="w-full h-full object-cover filter brightness-75 group-hover:brightness-100 transition-all duration-500 group-hover:scale-110" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                 <p className="absolute bottom-4 left-4 right-4 text-white font-bold text-xs md:text-sm leading-tight">{item.text}</p>
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* About The Tour */}
      <section id="about" className="py-24 max-w-[1200px] mx-auto w-full px-6 relative z-20">
         <div className="flex items-center gap-6 mb-20">
            <div className="h-px bg-white/20 flex-1" />
            <h2 className="text-4xl md:text-5xl font-black tracking-widest text-white/80">ABOUT THE TOUR</h2>
            <div className="h-px bg-white/20 flex-1" />
         </div>

         <div className="grid md:grid-cols-2 gap-20">
            <div className="space-y-6">
               <p className="text-xl md:text-2xl font-medium text-white/80 leading-relaxed max-w-md">
                 We've planned a simple and convenient 10-day itinerary for your trip to {community?.state || "the region"}.
                 You'll visit three major locations: {community?.name}, nearby valleys, and heritage sites.
               </p>
               
               <p className="text-white/60 font-medium leading-relaxed max-w-md mt-20">
                 No need to worry about routes, schedules, or finding places — everything is already organized. We'll show you where to go, what to see, and where to eat, so you can simply enjoy the journey.
               </p>
            </div>

            {/* Timeline */}
            <div className="relative pl-8 md:pl-0">
               {/* Vertical Line */}
               <div className="absolute left-[7px] md:left-1/2 top-0 bottom-0 w-px bg-white/20" />

               {[
                 { days: "Days 1-3", loc: "Arrival & Welcome", imgs: ["https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=400&auto=format&fit=crop", "https://images.unsplash.com/photo-1540316377017-f58c70830424?q=80&w=400&auto=format&fit=crop"] },
                 { days: "Days 4-6", loc: "Deep Exploration", imgs: ["https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=400&auto=format&fit=crop"] },
                 { days: "Days 7-10", loc: "Culture & Departure", imgs: ["https://images.unsplash.com/photo-1626082896492-766af4eb6501?q=80&w=400&auto=format&fit=crop", "https://images.unsplash.com/photo-1533055640609-24b498dfd74c?q=80&w=400&auto=format&fit=crop"] }
               ].map((stop, i) => (
                 <motion.div 
                   key={i} 
                   initial="initial" 
                   whileInView="whileInView" 
                   variants={fadeInUp}
                   className={`relative mb-24 flex flex-col md:flex-row items-center gap-8 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                 >
                    {/* Node */}
                    <div className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full bg-white -translate-x-[7px] md:-translate-x-1/2 z-10" />
                    
                    <div className={`w-full md:w-1/2 flex flex-col ${i % 2 === 0 ? 'md:text-left pl-8 md:pl-8' : 'md:text-right pl-8 md:pr-8'}`}>
                       <p className="text-white/60 font-medium mb-1">{stop.days}</p>
                       <h3 className="text-2xl font-bold">{stop.loc}</h3>
                    </div>

                    <div className={`w-full md:w-1/2 flex gap-4 ${i % 2 === 0 ? 'md:justify-end pl-8 md:pl-0' : 'pl-8 md:pl-0'}`}>
                       {stop.imgs.map((img, j) => (
                         <img key={j} src={img} className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-xl border border-white/10" alt="Stop" />
                       ))}
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* What's Included */}
      <section id="included" className="py-24 max-w-[1400px] mx-auto w-full px-6 relative z-20">
         <div className="flex items-center gap-6 mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-widest text-white/80 shrink-0">WHAT'S INCLUDED</h2>
            <div className="h-px bg-white/20 flex-1" />
         </div>

         <div className="grid md:grid-cols-4 gap-6">
            {[
              { title: "Guides", desc: "2 awesome guides who know everything about the region!", icon: <Users className="w-6 h-6 text-[#f6931e]" /> },
              { title: "Transport", desc: "Routes: Guwahati — Shillong — Khonoma — Guwahati", icon: <Navigation className="w-6 h-6 text-[#f6931e]" /> },
              { title: "Transfers", desc: "From the airport to all hotels and homestays", icon: <Shield className="w-6 h-6 text-[#f6931e]" /> },
              { title: "Hotels", desc: "Comfortable accommodation, 2 people per room (breakfasts included)", icon: <Home className="w-6 h-6 text-[#f6931e]" /> }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                initial="initial" 
                whileInView="whileInView" 
                variants={fadeInUp}
                className="border border-white/20 rounded-3xl p-8 hover:bg-white/5 transition-colors"
              >
                 <div className="flex items-center gap-4 mb-4">
                    {item.icon}
                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                 </div>
                 <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
         </div>
      </section>

      {/* Contact Form Section */}
      <section id="contacts" className="py-24 relative z-20">
         <div className="max-w-[1200px] mx-auto px-6">
            <div className="bg-gradient-to-br from-white/10 to-transparent backdrop-blur-xl border border-white/20 rounded-[3rem] p-10 md:p-16 max-w-xl shadow-2xl">
               <h2 className="text-3xl md:text-4xl font-medium text-white/90 mb-8 leading-tight">
                 Want to join us,<br/>but still have questions?
               </h2>
               <p className="text-white/60 mb-8">Leave a request and we will get back to you shortly.</p>

               <form className="space-y-6">
                  <div>
                    <input type="text" placeholder="Your name" className="w-full bg-transparent border-b border-white/30 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#f6931e] transition-colors" />
                  </div>
                  <div>
                    <input type="tel" placeholder="Phone number" className="w-full bg-transparent border-b border-white/30 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#f6931e] transition-colors" />
                  </div>
                  <div>
                    <input type="text" placeholder="Comment" className="w-full bg-transparent border-b border-white/30 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#f6931e] transition-colors" />
                  </div>
                  <Button className="w-full bg-white text-black hover:bg-gray-200 rounded-full py-6 font-bold mt-4">
                    Send Request
                  </Button>
               </form>
            </div>
         </div>
      </section>

      <footer className="py-8 border-t border-white/10 text-center text-white/40 text-xs font-bold tracking-widest uppercase relative z-20">
        © 2026 VanRoots Tours
      </footer>
    </div>
  );
}
