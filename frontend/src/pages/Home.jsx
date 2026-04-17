import React from 'react'
import { Link } from 'react-router-dom'
import { Search, Camera, Target, Shield, ArrowRight, Scan, MapPin, Calendar, Package } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { itemService } from '../services/api'

const Home = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['all-items'],
    queryFn: itemService.getAllItems
  })
  const features = [
    {
      icon: <Camera className="text-blue-400" size={24} />,
      title: "AI Image Recognition",
      description: "Our advanced vision models automatically detect item category, color, and more from a simple photo."
    },
    {
      icon: <Target className="text-purple-400" size={24} />,
      title: "Smart Matching Engine",
      description: "NLP-powered semantic similarity ensures that even items with different descriptions get matched accurately."
    },
    {
      icon: <Scan className="text-green-400" size={24} />,
      title: "Secure Verification",
      description: "Claim items using unique QR codes to ensure only the rightful owner can recover their possessions."
    }
  ]

  return (
    <div className="flex flex-col gap-24 pb-20 mt-12 overflow-hidden">
      {/* Hero Section */}
      <section className="relative px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary-500/20 blur-[120px] rounded-full -z-10 opacity-30 animate-pulse"></div>
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 px-4 py-1.5 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-400 text-sm font-semibold tracking-wide backdrop-blur-sm"
          >
            <div className="w-2 h-2 rounded-full bg-primary-400 animate-ping"></div>
            <span>Next-Gen Lost & Found Solution</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-6xl md:text-8xl font-black font-outfit tracking-tight leading-[0.95]"
          >
            Find what you <br /> <span className="gradient-text">thought was lost.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 max-w-2xl leading-relaxed"
          >
            Leverage advanced AI to reunite lost items with their owners. Experience the smartest, fastest, and most secure lost & found system built for the modern era.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-6 pt-6"
          >
            <Link to="/upload-found" className="text-lg btn-primary h-14 px-10">
              Found Something?
              <ArrowRight size={20} className="ml-1" />
            </Link>
            <Link to="/report-lost" className="text-lg btn-secondary h-14 px-10">
              Lost Something?
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card flex flex-col items-center text-center group"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-primary-500/50 transition-all duration-500 shadow-xl">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 font-outfit">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed font-inter">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="bg-slate-950/50 py-20 border-y border-slate-900">
        <div className="container mx-auto px-6 grid md:grid-cols-4 gap-12 text-center">
          <div>
            <div className="text-4xl font-black text-primary-400 font-outfit mb-2">98%</div>
            <div className="text-slate-500 font-medium">Matching Accuracy</div>
          </div>
          <div>
            <div className="text-4xl font-black text-primary-400 font-outfit mb-2">2k+</div>
            <div className="text-slate-500 font-medium">Items Connected</div>
          </div>
          <div>
            <div className="text-4xl font-black text-primary-400 font-outfit mb-2">{"< 5m"}</div>
            <div className="text-slate-500 font-medium">To Found Match</div>
          </div>
          <div>
            <div className="text-4xl font-black text-primary-400 font-outfit mb-2">10k+</div>
            <div className="text-slate-500 font-medium">Happy Users</div>
          </div>
        </div>
      </section>

      {/* Global Items Feed */}
      <section className="container mx-auto px-6 pt-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-black font-outfit mb-4">Global Network</h2>
          <p className="text-slate-400 text-lg">Browse items that have been recently reported lost or have been safely secured by our community.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Global Lost Items */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold font-outfit flex items-center justify-between">
              Missing Items
              <span className="px-3 py-1 bg-red-500/10 text-red-500 text-xs font-bold rounded-full uppercase tracking-tighter">Lost</span>
            </h3>
            
            <div className="space-y-4">
              {isLoading ? (
                <div className="p-12 text-center text-slate-500">Loading items...</div>
              ) : data?.lost?.length > 0 ? data.lost.slice(0, 5).map((item, i) => (
                <motion.div 
                  key={item._id} 
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="glass-card hover:bg-slate-900/80 group flex gap-5 p-4 shadow-xl"
                >
                  <div className="w-20 h-20 overflow-hidden rounded-xl bg-slate-950 shrink-0 border border-slate-800">
                    {item.image_url ? (
                      <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-700"><Package size={24} /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h4 className="text-lg font-bold truncate group-hover:text-primary-400 transition-colors uppercase tracking-tight">{item.title}</h4>
                    <div className="flex flex-wrap gap-4 items-center text-xs text-slate-500 mt-2 font-inter">
                      <span className="flex items-center gap-1.5"><MapPin size={12} className="text-primary-500" /> {item.location}</span>
                      <span className="flex items-center gap-1.5"><Calendar size={12} className="text-primary-500" /> {new Date(item.date_lost).toLocaleDateString()}</span>
                    </div>
                  </div>
                </motion.div>
              )) : (
                <div className="glass border-dashed border-slate-800 p-8 text-center rounded-2xl text-slate-500 font-medium">No lost items reported yet.</div>
              )}
            </div>
          </div>

          {/* Global Found Items */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold font-outfit flex items-center justify-between">
              Secured Items
              <span className="px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-full uppercase tracking-tighter">Found</span>
            </h3>
            
            <div className="space-y-4">
              {isLoading ? (
                <div className="p-12 text-center text-slate-500">Loading items...</div>
              ) : data?.found?.length > 0 ? data.found.slice(0, 5).map((item, i) => (
                <motion.div 
                  key={item._id} 
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="glass-card hover:bg-slate-900/80 group flex gap-5 p-4 shadow-xl"
                >
                  <div className="w-20 h-20 overflow-hidden rounded-xl bg-slate-950 shrink-0 border border-slate-800">
                    <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1">
                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.detected_labels?.[0] || 'Unknown'}</span>
                    </div>
                    <h4 className="text-lg font-bold truncate group-hover:text-primary-400 transition-colors uppercase tracking-tight">{item.location}</h4>
                    <p className="text-slate-400 text-sm line-clamp-1 mt-1">{item.description}</p>
                  </div>
                </motion.div>
              )) : (
                <div className="glass border-dashed border-slate-800 p-8 text-center rounded-2xl text-slate-500 font-medium">No found items reported yet.</div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
