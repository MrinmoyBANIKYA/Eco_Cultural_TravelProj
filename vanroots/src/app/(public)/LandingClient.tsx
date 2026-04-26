"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Search, MapPin, Menu, X, ChevronRight, Compass, Shield, Users, BookOpen, Map, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

// Animations
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export interface Community {
  id: string;
  slug: string;
  name: string;
  state: string;
  coverImageUrl?: string | null;
  shortDesc?: string | null;
}

export default function LandingClient({ communities }: { communities: Community[] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 300]); // Parallax for background
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]); // Parallax for foreground text
  
  const carouselRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] selection:bg-[#f6931e] selection:text-white font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="absolute top-0 w-full z-50 py-6 px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 z-50">
           <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#0f4a45] font-bold text-xl">V</div>
           <span className="text-white text-2xl font-bold tracking-tight drop-shadow-md">VanRoots</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 bg-white/10 backdrop-blur-md px-8 py-3 rounded-full border border-white/20">
          {["Home", "Tours", "Explore", "Permits", "About"].map((item) => (
            <Link key={item} href={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="text-white/90 hover:text-[#f6931e] text-sm font-medium transition-colors drop-shadow-sm">
              {item}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
           <button className="text-white hover:text-[#f6931e] transition-colors"><Search className="w-5 h-5 drop-shadow-md" /></button>
           <button className="text-white hover:text-[#f6931e] transition-colors"><Menu className="w-6 h-6 drop-shadow-md" /></button>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-white z-50" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 drop-shadow-md" />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[#0f4a45] pt-24 px-6 flex flex-col gap-6 md:hidden"
          >
             {["Home", "Tours", "Explore", "Permits", "About"].map((item) => (
                <Link key={item} href={`/${item.toLowerCase()}`} className="text-white text-2xl font-bold" onClick={() => setIsMenuOpen(false)}>
                  {item}
                </Link>
              ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Parallax Hero Section */}
      <section className="relative h-screen flex flex-col justify-center overflow-hidden">
        {/* Waterfall Background */}
        <motion.div 
           className="absolute inset-0 z-0"
           style={{ y: y1 }}
        >
           <img 
             src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2000&auto=format&fit=crop" 
             alt="Northeast Waterfall" 
             className="w-full h-[120%] object-cover object-center filter brightness-75"
           />
           <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#fafafa] opacity-90" />
        </motion.div>

        <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 relative z-20 text-center flex flex-col items-center">
          <motion.div style={{ y: y2 }} className="space-y-6 pt-12">
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[#f6931e] font-serif italic text-4xl md:text-5xl mb-2 drop-shadow-lg"
            >
              Discover
            </motion.h2>
            <h1 className="text-6xl md:text-[6rem] lg:text-[8rem] font-black text-white leading-[1.1] tracking-tighter drop-shadow-2xl">
              The Whispers
            </h1>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto font-medium drop-shadow-md">
              Unearth the hidden stories, raw beauty, and sacred cultures of the Seven Sisters.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Explore With Us Section (Horizontal Scrolling Carousel) */}
      <section className="py-24 max-w-[1400px] mx-auto w-full px-6 overflow-hidden">
         <motion.div initial="initial" whileInView="whileInView" variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-[#0f4a45] text-4xl md:text-5xl font-black mb-4">Explore <span className="text-[#f6931e] font-serif italic font-normal">With Us</span></h2>
            <p className="text-gray-500 font-medium max-w-xl mx-auto">Immerse yourself in authentic community-based tourism across Northeast India.</p>
         </motion.div>

         <div className="relative w-full h-[500px]">
             {/* Horizontal Scroll Container */}
             <div 
               ref={carouselRef}
               className="flex gap-8 overflow-x-auto snap-x snap-mandatory pb-10 hide-scrollbar h-full items-center px-[10vw]"
               style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
             >
                {communities.length > 0 ? communities.map((comm) => (
                  <Link href={`/tours/${comm.slug}`} key={comm.id} className="snap-center shrink-0 w-[300px] md:w-[350px] h-[400px] relative group block">
                     <motion.div 
                        whileHover={{ scale: 1.05, y: -10 }}
                        className="w-full h-full rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative transition-all duration-300"
                     >
                        <img src={comm.coverImageUrl || "https://images.unsplash.com/photo-1540316377017-f58c70830424?q=80&w=600&auto=format&fit=crop"} alt={comm.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-8 left-8 right-8">
                           <p className="text-[#f6931e] text-xs font-bold uppercase tracking-widest mb-2">{comm.state}</p>
                           <h3 className="text-white text-2xl font-bold mb-2">{comm.name}</h3>
                           <p className="text-white/70 text-sm line-clamp-2">{comm.shortDesc}</p>
                        </div>
                     </motion.div>
                  </Link>
                )) : (
                  [1,2,3,4,5].map((i) => (
                     <div key={i} className="snap-center shrink-0 w-[300px] h-[400px] rounded-[2rem] bg-gray-200 animate-pulse" />
                  ))
                )}
             </div>
         </div>
      </section>

      {/* The Precious Culture and Stories (5-card Layout) */}
      <section className="py-24 bg-white">
         <div className="max-w-[1400px] mx-auto px-6">
            <motion.div initial="initial" whileInView="whileInView" variants={fadeInUp} className="mb-16">
               <h2 className="text-[#f6931e] text-4xl font-serif italic mb-2">The Precious <span className="text-[#0f4a45] font-sans font-black not-italic">Culture and Stories</span></h2>
               <p className="text-gray-500 font-medium">Dive deep into the heritage of the indigenous communities.</p>
            </motion.div>

            {/* Big Card Container */}
            <div className="bg-[#0f4a45] rounded-[3rem] p-6 md:p-10 w-full shadow-2xl">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px]">
                  
                  {/* Left Column (2 Cards) */}
                  <div className="flex flex-col gap-6 h-full">
                     <motion.div whileHover={{ scale: 1.02 }} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] p-8 flex-1 flex flex-col justify-end relative overflow-hidden group cursor-pointer">
                        <img src="https://images.unsplash.com/photo-1626082896492-766af4eb6501?q=80&w=600&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-500" alt="Food" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f4a45] via-[#0f4a45]/50 to-transparent" />
                        <div className="relative z-10">
                           <div className="w-12 h-12 bg-[#f6931e] rounded-full flex items-center justify-center mb-4"><Users className="text-white" /></div>
                           <h3 className="text-white text-2xl font-bold mb-2">Authentic Food</h3>
                           <p className="text-white/80 text-sm">Taste the organic flavors of the region.</p>
                        </div>
                     </motion.div>
                     <motion.div whileHover={{ scale: 1.02 }} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] p-8 flex-1 flex flex-col justify-end relative overflow-hidden group cursor-pointer">
                        <img src="https://images.unsplash.com/photo-1533055640609-24b498dfd74c?q=80&w=600&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-500" alt="Stories" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f4a45] via-[#0f4a45]/50 to-transparent" />
                        <div className="relative z-10">
                           <div className="w-12 h-12 bg-[#8cc63f] rounded-full flex items-center justify-center mb-4"><BookOpen className="text-white" /></div>
                           <h3 className="text-white text-2xl font-bold mb-2">Local Stories</h3>
                           <p className="text-white/80 text-sm">Hear folklore passed down generations.</p>
                        </div>
                     </motion.div>
                  </div>

                  {/* Middle Column (1 Large Card) */}
                  <motion.div whileHover={{ scale: 1.01 }} className="bg-[#f6931e] rounded-[2rem] p-8 h-full flex flex-col justify-end relative overflow-hidden group cursor-pointer shadow-[0_20px_50px_rgba(246,147,30,0.3)]">
                     <img src="https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=800&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700" alt="Culture" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                     <div className="relative z-10">
                        <h3 className="text-white text-4xl font-black mb-3 drop-shadow-md">Rich Culture</h3>
                        <p className="text-white/90 text-lg mb-6 max-w-sm drop-shadow-sm">Immerse yourself in traditional festivals, dances, and vibrant attire.</p>
                        <Button className="bg-white text-[#f6931e] hover:bg-gray-100 rounded-full px-6 py-2 font-bold shadow-lg">Discover More</Button>
                     </div>
                  </motion.div>

                  {/* Right Column (2 Cards) */}
                  <div className="flex flex-col gap-6 h-full">
                     <motion.div whileHover={{ scale: 1.02 }} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] p-8 flex-1 flex flex-col justify-center items-center text-center relative overflow-hidden group cursor-pointer">
                        <Map className="w-16 h-16 text-[#f6931e] mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="text-white text-xl font-bold mb-2">Interactive Map</h3>
                        <p className="text-white/70 text-sm">Pinpoint hidden gems.</p>
                     </motion.div>
                     <motion.div whileHover={{ scale: 1.02 }} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] p-8 flex-1 flex flex-col justify-center items-center text-center relative overflow-hidden group cursor-pointer">
                        <Shield className="w-16 h-16 text-[#8cc63f] mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="text-white text-xl font-bold mb-2">Touring Guidelines</h3>
                        <p className="text-white/70 text-sm">Travel responsibly.</p>
                     </motion.div>
                  </div>

               </div>
            </div>
         </div>
      </section>

      {/* Customer Reviews and Photos */}
      <section className="py-24 bg-[#fafafa]">
         <div className="max-w-[1400px] mx-auto px-6">
            <motion.div initial="initial" whileInView="whileInView" variants={fadeInUp} className="text-center mb-16">
               <h2 className="text-[#0f4a45] text-4xl md:text-5xl font-black mb-4">Traveler <span className="text-[#f6931e] font-serif italic font-normal">Memories</span></h2>
               <p className="text-gray-500 font-medium">Customer reviews and photos from their journeys.</p>
            </motion.div>

            {/* Masonry-style Grid */}
            <div className="columns-1 md:columns-3 gap-6 space-y-6">
               {[
                 { text: "The homestay in Khonoma was an eye-opener. The food, the people, the views - absolutely stunning.", author: "Sarah M.", img: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=400&auto=format&fit=crop" },
                 { text: "A truly responsible way to travel. I felt deeply connected to the culture.", author: "Rahul D.", noImg: true },
                 { text: "Unforgettable landscapes in Meghalaya. The living root bridges are magical.", author: "Jessica T.", img: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=400&auto=format&fit=crop" },
                 { text: "Our guide was wonderful, telling us stories we would never read in a book.", author: "Amit P.", img: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=400&auto=format&fit=crop" },
                 { text: "Best eco-tourism experience of my life.", author: "Emma W.", noImg: true }
               ].map((review, i) => (
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 break-inside-avoid"
                 >
                    {!review.noImg && (
                       <img src={review.img} className="w-full h-48 object-cover rounded-xl mb-6" alt="Review photo" />
                    )}
                    <div className="flex text-[#f6931e] mb-4">
                       {[1,2,3,4,5].map(star => <span key={star}>★</span>)}
                    </div>
                    <p className="text-gray-600 italic mb-4">"{review.text}"</p>
                    <p className="font-bold text-[#0f4a45]">- {review.author}</p>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* ILP Section */}
      <section className="max-w-[1200px] mx-auto px-6 py-24 w-full">
         <motion.div 
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="bg-[#f6931e] rounded-[3rem] p-10 md:p-14 flex flex-col md:flex-row items-center justify-between shadow-[0_20px_50px_rgba(246,147,30,0.3)] relative overflow-hidden"
         >
            {/* Background Map/Pattern placeholder */}
            <div className="absolute right-0 top-0 opacity-10 pointer-events-none w-full h-full object-cover">
               <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <circle fill="#ffffff" cx="2" cy="2" r="2"></circle>
                    </pattern>
                  </defs>
                  <rect x="0" y="0" width="100%" height="100%" fill="url(#dots)"></rect>
               </svg>
            </div>

            <div className="z-10 mb-10 md:mb-0 w-full md:w-2/3">
               <h2 className="text-white text-4xl font-black mb-4">Inner Line Permit (ILP)</h2>
               <p className="text-white/90 text-lg mb-8 leading-relaxed font-medium">Certain states in Northeast India require an Inner Line Permit for entry. We make the process seamless. Check requirements and apply online before your journey.</p>
               <Link href="/ilp-guide">
                 <Button className="bg-white text-[#f6931e] hover:bg-gray-100 rounded-full px-8 py-6 font-bold shadow-lg">Check ILP Requirements</Button>
               </Link>
            </div>

            <div className="z-10 relative">
               <div className="w-32 h-32 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white/30 shadow-xl">
                  <Shield className="w-12 h-12 text-white" />
               </div>
            </div>
         </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f4a45] pt-24 pb-12 relative overflow-hidden mt-10">
         <div className="max-w-[1400px] mx-auto px-6 z-20 relative">
            <div className="grid md:grid-cols-4 gap-12 mb-16">
               <div className="space-y-6 col-span-1 md:col-span-1">
                  <div className="flex items-center gap-3">
                     <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#0f4a45] font-black text-2xl shadow-lg">V</div>
                     <span className="text-white text-3xl font-bold tracking-tight">VanRoots</span>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed font-medium">
                    Making your travel experience easy, memorable, and full of amazing discoveries across the globe. Journey with us today.
                  </p>
               </div>

               <div>
                 <h4 className="text-white font-bold text-xl mb-6 relative inline-block">
                   Explore
                   <span className="absolute -bottom-3 left-0 w-8 h-1 bg-[#f6931e] rounded-full" />
                 </h4>
                 <ul className="space-y-4 text-white/70 text-sm font-bold">
                   <li><Link href="/about" className="hover:text-[#f6931e] transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4 text-[#f6931e]" /> About Us</Link></li>
                   <li><Link href="/tours" className="hover:text-[#f6931e] transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4 text-[#f6931e]" /> Tours</Link></li>
                   <li><Link href="/explore" className="hover:text-[#f6931e] transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4 text-[#f6931e]" /> Map Explore</Link></li>
                   <li><Link href="/contact" className="hover:text-[#f6931e] transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4 text-[#f6931e]" /> Contact</Link></li>
                 </ul>
               </div>

               <div>
                 <h4 className="text-white font-bold text-xl mb-6 relative inline-block">
                   Resources
                   <span className="absolute -bottom-3 left-0 w-8 h-1 bg-[#f6931e] rounded-full" />
                 </h4>
                 <ul className="space-y-4 text-white/70 text-sm font-bold">
                   <li><Link href="/ilp-guide" className="hover:text-[#f6931e] transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4 text-[#f6931e]" /> ILP Guide</Link></li>
                   <li><Link href="/guidelines" className="hover:text-[#f6931e] transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4 text-[#f6931e]" /> Travel Guidelines</Link></li>
                   <li><Link href="/faq" className="hover:text-[#f6931e] transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4 text-[#f6931e]" /> FAQs</Link></li>
                   <li><Link href="/support" className="hover:text-[#f6931e] transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4 text-[#f6931e]" /> Support</Link></li>
                 </ul>
               </div>

               <div>
                 <h4 className="text-white font-bold text-xl mb-6 relative inline-block">
                   Gallery
                   <span className="absolute -bottom-3 left-0 w-8 h-1 bg-[#f6931e] rounded-full" />
                 </h4>
                 <div className="grid grid-cols-3 gap-3">
                    {[1,2,3,4,5,6].map((img) => (
                      <div key={img} className="aspect-square rounded-xl overflow-hidden relative group cursor-pointer border border-white/10">
                        <img src={`https://images.unsplash.com/photo-${1500000000000 + img * 1000}?q=80&w=200&auto=format&fit=crop`} alt="Gallery" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-[#0f4a45]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                           <ImageIcon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    ))}
                 </div>
               </div>
            </div>
         </div>
      </footer>
      <div className="bg-[#0a3330] py-8 text-center relative z-20">
        <p className="text-white/40 text-xs font-black tracking-[0.2em] uppercase">© 2026 VanRoots. All Rights Reserved.</p>
      </div>
    </div>
  );
}
