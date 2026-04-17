import React from 'react'
import { itemService } from '../services/api'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, PlusCircle, MapPin, Calendar, Loader2, Package, History, ArrowRight, Camera } from 'lucide-react'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['my-items'],
    queryFn: itemService.getMyItems
  })
  
  const [searchQuery, setSearchQuery] = React.useState('')

  if (isLoading) return (
    <div className="flex-1 flex flex-col items-center justify-center -mt-20">
      <Loader2 className="animate-spin text-primary-500 mb-4" size={48} />
      <p className="text-slate-400 font-medium">Loading your dashboard...</p>
    </div>
  )

  const filteredLost = data?.lost?.filter(item => 
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.location?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []
  
  const filteredFound = data?.found?.filter(item => 
    item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.detected_labels?.some(l => l.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || []

  const lostCount = data?.lost?.length || 0
  const foundCount = data?.found?.length || 0

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl lg:text-5xl font-black font-outfit mb-3">Your <span className="gradient-text">Activity</span> Dashboard</h1>
          <p className="text-slate-400 text-lg">Manage your reported and found items in one place.</p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative group w-full sm:w-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-400 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search items, locations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-full py-3 pl-12 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 w-full sm:w-64 transition-all"
            />
          </div>
          <div className="flex gap-4">
            <Link to="/report-lost" className="btn-secondary h-12 shrink-0">
              <PlusCircle size={18} /> Lost Item
            </Link>
            <Link to="/upload-found" className="btn-primary h-12 shadow-primary-500/20 shrink-0">
              <Camera size={18} /> Found Item /* Oh, it used Search previously, I'll use Camera or Package */
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
         <div className="glass-card flex items-center justify-between group">
            <div className="space-y-1">
              <span className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Reports</span>
              <div className="text-3xl font-black font-outfit text-white group-hover:text-primary-400 transition-colors">{lostCount}</div>
            </div>
            <div className="p-4 bg-red-500/10 text-red-400 rounded-2xl group-hover:scale-110 transition-transform"><History size={24} /></div>
         </div>
         <div className="glass-card flex items-center justify-between group">
            <div className="space-y-1">
              <span className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Findings</span>
              <div className="text-3xl font-black font-outfit text-white group-hover:text-primary-400 transition-colors">{foundCount}</div>
            </div>
            <div className="p-4 bg-green-500/10 text-green-400 rounded-2xl group-hover:scale-110 transition-transform"><Package size={24} /></div>
         </div>
         <Link to="/matches" className="glass-card flex items-center justify-between group bg-primary-500/5 border-primary-500/20 hover:border-primary-500/50">
            <div className="space-y-1">
              <span className="text-primary-400 text-sm font-semibold uppercase tracking-wider">Potential Matches</span>
              <div className="text-3xl font-black font-outfit text-white group-hover:text-primary-400 transition-colors underline decoration-primary-500/30">View All</div>
            </div>
            <div className="p-4 bg-primary-500/10 text-primary-400 rounded-2xl group-hover:translate-x-1 transition-transform"><ArrowRight size={24} /></div>
         </Link>
      </div>

      {/* Items Section */}
      <div className="grid lg:grid-cols-2 gap-12 px-4">
        {/* My Lost Items */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold font-outfit">My Lost Items</h3>
            <span className="px-3 py-1 bg-red-500/10 text-red-500 text-xs font-bold rounded-full uppercase tracking-tighter">Reported</span>
          </div>
          
          <div className="space-y-4">
            <AnimatePresence>
            {filteredLost.length > 0 ? filteredLost.map((item, i) => (
              <motion.div 
                key={item._id} 
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: -20 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="glass-card hover:bg-slate-900/80 group flex gap-5 p-4 shadow-xl hover:shadow-primary-500/10 cursor-pointer"
              >
                <div className="w-24 h-24 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shrink-0 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                  {item.image_url ? (
                    <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-700"><Package size={32} /></div>
                  )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h4 className="text-lg font-bold truncate group-hover:text-primary-400 transition-colors uppercase tracking-tight">{item.title}</h4>
                  <p className="text-slate-400 text-sm line-clamp-1 mt-1 mb-3">{item.description}</p>
                  <div className="flex flex-wrap gap-4 items-center text-xs text-slate-500 font-medium font-inter">
                    <span className="flex items-center gap-1.5 bg-slate-900/50 px-2 py-1 rounded-md"><MapPin size={14} className="text-primary-500" /> {item.location}</span>
                    <span className="flex items-center gap-1.5 bg-slate-900/50 px-2 py-1 rounded-md"><Calendar size={14} className="text-primary-500" /> {new Date(item.date_lost).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            )) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass border-dashed border-slate-800 p-12 text-center rounded-2xl">
                <Package className="mx-auto text-slate-700 mb-4" size={48} />
                <p className="text-slate-500 font-medium">No items found matching your search.</p>
              </motion.div>
            )}
            </AnimatePresence>
          </div>
        </div>

        {/* My Found Items */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold font-outfit">My Found Items</h3>
            <span className="px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-full uppercase tracking-tighter">Protected</span>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
            {filteredFound.length > 0 ? filteredFound.map((item, i) => (
              <motion.div 
                key={item._id} 
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 20 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="glass-card hover:bg-slate-900/80 group flex gap-5 p-4 shadow-xl hover:shadow-green-500/10 cursor-pointer"
              >
                <div className="w-24 h-24 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shrink-0 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                  <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-1">
                     <div className="w-3 h-3 rounded-full shadow-md" style={{ backgroundColor: item.color || '#fff' }}></div>
                     <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-900/50 px-2 py-0.5 rounded-md">{item.detected_labels?.[0] || 'Unknown Object'}</span>
                  </div>
                  <h4 className="text-lg font-bold truncate group-hover:text-primary-400 transition-colors uppercase tracking-tight">{item.location}</h4>
                  <p className="text-slate-400 text-sm line-clamp-1 mt-1 mb-3">{item.description}</p>
                  <div className="flex flex-wrap gap-2 items-center">
                    {item.detected_labels?.slice(0, 2).map((label, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-800 rounded-md text-[10px] text-slate-400 border border-slate-700 font-bold uppercase tracking-wider">{label}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass border-dashed border-slate-800 p-12 text-center rounded-2xl">
                <Search className="mx-auto text-slate-700 mb-4" size={48} />
                <p className="text-slate-500 font-medium">No items found matching your search.</p>
              </motion.div>
            )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
