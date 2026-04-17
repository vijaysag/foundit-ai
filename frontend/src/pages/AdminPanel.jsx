import React from 'react'
import { itemService, claimService } from '../services/api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Shield, Users, Package, HelpCircle, CheckCircle, XCircle, MoreVertical, Search, Scan, FileText, LayoutGrid, Clock, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

const AdminPanel = () => {
  const queryClient = useQueryClient()

  const { data: claims, isLoading } = useQuery({
    queryKey: ['admin-claims'],
    queryFn: claimService.getClaims
  })

  // Dummy stats for now, pendingClaims from actual data
  const data = {
    users: 154,
    totalLost: 42,
    totalFound: 38,
    pendingClaims: claims ? claims.filter(c => c.status === 'pending').length : 0
  }

  const [activeTab, setActiveTab] = React.useState('claims')

  const updateClaimMutation = useMutation({
    mutationFn: ({claimId, action}) => claimService.updateClaimStatus(claimId, action),
    onSuccess: (res, variables) => {
      if (variables.action === 'approve') {
        toast.success('Claim approved! User notified.')
      } else {
        toast.error('Claim rejected.')
      }
      queryClient.invalidateQueries({ queryKey: ['admin-claims'] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to update claim')
    }
  })

  const handleApprove = (claimId) => {
    updateClaimMutation.mutate({claimId, action: 'approve'})
  }

  const handleReject = (claimId) => {
    updateClaimMutation.mutate({claimId, action: 'reject'})
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fade-in pb-20">
      {/* Header with Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 px-4">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-primary-600/10 border border-primary-500/20 text-primary-400 font-black text-sm uppercase tracking-widest shadow-lg shadow-primary-500/5"> <Shield size={18} /> Administrative Authority</div>
          <h1 className="text-5xl lg:text-7xl font-black font-outfit uppercase tracking-tight leading-none italic"><span className="text-white">Admin</span><span className="gradient-text">Console</span></h1>
          <p className="text-slate-400 text-lg lg:text-xl font-medium max-w-2xl leading-relaxed">Oversee system operations, verify claims, and manage platform safety protocols.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 bg-slate-900/40 p-10 rounded-[40px] border border-slate-800 shadow-2xl backdrop-blur-3xl shrink-0">
           <div className="space-y-2 text-center border-r border-slate-800 pr-6">
              <div className="text-4xl font-black font-outfit text-white leading-none">{data?.users || '154'}</div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center justify-center gap-1.5"><Users size={12} className="text-primary-500" /> Active Users</div>
           </div>
           <div className="space-y-2 text-center border-r border-slate-800 px-6">
              <div className="text-4xl font-black font-outfit text-white leading-none">{data?.totalLost || '42'}</div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center justify-center gap-1.5"><HelpCircle size={12} className="text-red-500" /> Lost Reports</div>
           </div>
           <div className="space-y-2 text-center border-r border-slate-800 px-6">
              <div className="text-4xl font-black font-outfit text-white leading-none">{data?.totalFound || '38'}</div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center justify-center gap-1.5"><Package size={12} className="text-green-500" /> Found Items</div>
           </div>
           <div className="space-y-2 text-center pl-6">
              <div className="text-4xl font-black font-outfit text-primary-400 leading-none">{data?.pendingClaims || '12'}</div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center justify-center gap-1.5"><Scan size={12} className="text-primary-400" /> Open Claims</div>
           </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="grid lg:grid-cols-[280px,1fr] gap-12 px-4 pt-4">
        {/* Navigation Sidebar */}
        <div className="space-y-4">
           <button 
            onClick={() => setActiveTab('claims')}
            className={`w-full flex items-center gap-4 px-6 py-5 rounded-[24px] font-black uppercase tracking-widest text-sm transition-all duration-300 ${activeTab === 'claims' ? 'bg-primary-600 text-white shadow-xl shadow-primary-600/30 translate-x-3 scale-105' : 'bg-slate-900/50 text-slate-500 border border-slate-800 hover:text-white hover:bg-slate-800'}`}
           >
              <Scan size={20} /> Verify Claims
           </button>
           <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-4 px-6 py-5 rounded-[24px] font-black uppercase tracking-widest text-sm transition-all duration-300 ${activeTab === 'users' ? 'bg-primary-600 text-white shadow-xl shadow-primary-600/30 translate-x-3 scale-105' : 'bg-slate-900/50 text-slate-500 border border-slate-800 hover:text-white hover:bg-slate-800'}`}
           >
              <Users size={20} /> User Registry
           </button>
           <button 
            onClick={() => setActiveTab('reports')}
            className={`w-full flex items-center gap-4 px-6 py-5 rounded-[24px] font-black uppercase tracking-widest text-sm transition-all duration-300 ${activeTab === 'reports' ? 'bg-primary-600 text-white shadow-xl shadow-primary-600/30 translate-x-3 scale-105' : 'bg-slate-900/50 text-slate-500 border border-slate-800 hover:text-white hover:bg-slate-800'}`}
           >
              <FileText size={20} /> Global Feed
           </button>
        </div>

        {/* Tab Content Display */}
        <div className="space-y-10">
           <div className="flex items-center justify-between">
              <h3 className="text-3xl font-black font-outfit uppercase tracking-tight italic flex items-center gap-4">
                 <span className="p-3 bg-slate-900 border border-slate-800 rounded-2xl"><LayoutGrid size={24} className="text-primary-400" /></span>
                 Active {activeTab} Queues
              </h3>
              <div className="flex items-center gap-3">
                 <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-400" size={18} />
                    <input className="bg-slate-900/50 border border-slate-800 rounded-full py-2.5 pl-12 pr-6 text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500/30 transition-all w-72 h-12" placeholder="Scan global records..." />
                 </div>
              </div>
           </div>

           <div className="space-y-6">
              {claims?.length === 0 && (
                <div className="text-center py-20 text-slate-500 font-medium">No pending claims found.</div>
              )}
              {claims?.map((claim, i) => (
                <motion.div 
                  key={claim.claim_id} 
                  initial={{ opacity: 0, y: 30 }} 
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`glass-card hover:bg-slate-900/80 group grid md:grid-cols-[1fr,250px] gap-8 p-10 relative overflow-hidden ${claim.status !== 'pending' ? 'opacity-50 grayscale' : ''}`}
                >
                   {/* Background Highlight Decor */}
                   <div className="absolute right-0 top-0 w-48 h-48 bg-primary-500/5 rounded-full blur-[80px] -z-10 group-hover:bg-primary-500/10 transition-all duration-700"></div>

                   <div className="space-y-8 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-4 mb-4">
                           <span className="flex items-center gap-2 px-3 py-1 bg-primary-500/10 text-primary-400 rounded-lg text-xs font-black uppercase tracking-widest"><Clock size={14} /> {claim.status.toUpperCase()}</span>
                           <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">REF: #{claim.claim_id.substring(0,8).toUpperCase()}</span>
                        </div>
                        <h4 className="text-2xl font-black uppercase tracking-tight text-white group-hover:text-primary-400 transition-colors leading-none italic font-outfit">Claimant: {claim.claimer?.name}</h4>
                        <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-xl">Claim for matched items: <span className="text-white font-bold italic">{claim.lost?.title}</span> (Lost) and <span className="text-white font-bold italic">{claim.found?.category || 'Found Item'}</span> (Found).</p>
                      </div>

                      <div className="flex flex-wrap gap-8 items-center border-t border-slate-800 pt-8">
                         <div className="space-y-1">
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Similarity Score</span>
                            <div className="text-xl font-black font-outfit text-white">{claim.match ? Math.round(claim.match.similarity_score * 100) : 0}% Match</div>
                         </div>
                         <div className="space-y-1">
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Verification Status</span>
                            <div className="text-xl font-black font-outfit text-green-400 flex items-center gap-2"> <Scan size={18} /> QR Scanned</div>
                         </div>
                      </div>
                   </div>

                   <div className="flex flex-col gap-4 justify-center">
                      <button disabled={claim.status !== 'pending' || updateClaimMutation.isPending} onClick={() => handleApprove(claim.claim_id)} className="w-full bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-white border border-green-500/20 py-4 rounded-3xl font-black uppercase tracking-widest text-sm transition-all duration-500 flex items-center justify-center gap-3 active:scale-95 group/btn shadow-[0_0_0_rgba(34,197,94,0)] hover:shadow-[0_10px_30px_rgba(34,197,94,0.3)] disabled:opacity-50 disabled:cursor-not-allowed">
                         <CheckCircle size={20} className="group-hover/btn:scale-120 transition-transform" /> Confirm Recovery
                      </button>
                      <button disabled={claim.status !== 'pending' || updateClaimMutation.isPending} onClick={() => handleReject(claim.claim_id)} className="w-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 py-4 rounded-3xl font-black uppercase tracking-widest text-sm transition-all duration-500 flex items-center justify-center gap-3 active:scale-95 group/btn shadow-[0_0_0_rgba(239,68,68,0)] hover:shadow-[0_10px_30px_rgba(239,68,68,0.3)] disabled:opacity-50 disabled:cursor-not-allowed">
                         <XCircle size={20} className="group-hover/btn:scale-120 transition-transform" /> Dismiss Claim
                      </button>
                      <button className="w-full bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700/50 py-4 rounded-3xl font-black uppercase tracking-widest text-sm transition-all duration-500 flex items-center justify-center gap-3">
                         <AlertTriangle size={18} /> Flag Protocol
                      </button>
                   </div>
                </motion.div>
              ))}
           </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
