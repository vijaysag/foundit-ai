import React from 'react'
import { authService } from '../services/api'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { User, Mail, Shield, Loader2, Key } from 'lucide-react'

const Profile = () => {
  const { data: user, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: authService.getProfile
  })

  if (isLoading) return (
    <div className="flex-1 flex flex-col items-center justify-center -mt-20">
      <Loader2 className="animate-spin text-primary-500 mb-4" size={48} />
      <p className="text-slate-400 font-medium">Loading profile...</p>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto space-y-12 pb-20 animate-fade-in mt-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary-600/20 to-purple-600/20"></div>
        
        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-8 z-10 -mt-2">
          <div className="w-32 h-32 rounded-full bg-slate-900 border-4 border-slate-950 flex flex-col items-center justify-center shadow-2xl relative">
            <User size={48} className="text-primary-400" />
            <div className="absolute bottom-0 right-0 p-2 bg-slate-800 rounded-full border border-slate-700">
               <Shield size={16} className={user?.role === 'admin' ? "text-primary-400" : "text-slate-400"} />
            </div>
          </div>
          <div className="space-y-4 text-center sm:text-left flex-1">
            <div>
              <h1 className="text-4xl font-black font-outfit uppercase tracking-tight">{user?.name || "User Profile"}</h1>
              <span className="inline-block mt-2 px-3 py-1 bg-slate-800 rounded-lg text-xs font-bold text-slate-400 uppercase tracking-widest border border-slate-700">
                {user?.role === 'admin' ? 'System Administrator' : 'General User'}
              </span>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              <div className="flex items-center gap-3 p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                <Mail className="text-primary-500" size={20} />
                <div className="text-left">
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Email Address</div>
                  <div className="text-slate-300 font-medium">{user?.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                <Key className="text-purple-500" size={20} />
                <div className="text-left">
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Account ID</div>
                  <div className="text-slate-300 font-medium font-mono text-sm">{user?._id?.substring(0, 8)}...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Profile
