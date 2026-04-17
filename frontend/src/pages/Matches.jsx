import React from 'react'
import { itemService, claimService } from '../services/api'
import { useQuery, useMutation } from '@tanstack/react-query'
import { QRCodeSVG } from 'qrcode.react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, MapPin, Calendar, ExternalLink, Loader2, Sparkles, Navigation, X, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

const Matches = () => {
  const { data: matches, isLoading, refetch } = useQuery({
    queryKey: ['matches'],
    queryFn: itemService.getMatches
  })
  
  const [selectedMatch, setSelectedMatch] = React.useState(null)

  const claimMutation = useMutation({
    mutationFn: (matchId) => claimService.createClaim(matchId),
    onSuccess: () => {
      toast.success('Claim request submitted! Admin will verify and notify you shortly.')
      setSelectedMatch(null)
      refetch()
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to submit claim')
    }
  })

  if (isLoading) return (
    <div className="flex-1 flex flex-col items-center justify-center -mt-20">
      <Loader2 className="animate-spin text-primary-500 mb-4" size={48} />
      <p className="text-slate-400 font-medium">Looking for AI matches...</p>
    </div>
  )

  const handleClaim = () => {
    if (selectedMatch) {
      claimMutation.mutate(selectedMatch.match_id)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-in relative pb-20">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-bold uppercase tracking-wider mb-6">
          <Sparkles size={16} /> Semantic Matching System
        </div>
        <h1 className="text-5xl font-black font-outfit gradient-text mb-4 leading-tight">Potential Matches</h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">Our AI models identified these items as highly similar to your reports.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {matches?.length > 0 ? matches.map((match, i) => (
          <motion.div 
            key={match.match_id} 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card flex flex-col items-stretch h-full overflow-hidden group cursor-pointer hover:border-primary-500 transition-all duration-500 hover:shadow-[0_0_40px_rgba(56,189,248,0.15)]"
            onClick={() => setSelectedMatch(match)}
          >
            {/* Match Header Info */}
            <div className="relative h-56 overflow-hidden">
               <img src={match.found.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 blur-[2px] opacity-40" />
               <img src={match.found.image_url} className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500 z-10" />
               <div className="absolute top-4 right-4 z-20">
                  <div className="bg-primary-600 px-3 py-1.5 rounded-full text-xs font-black text-white shadow-xl shadow-primary-900/40 border border-white/20">
                    MATCH: {Math.round(match.score * 100)}%
                  </div>
               </div>
            </div>

            {/* Content Container */}
            <div className="p-6 space-y-4 flex-1 flex flex-col bg-slate-900/40 relative z-20">
              <h4 className="text-xl font-black font-outfit uppercase tracking-tight text-white group-hover:text-primary-400 transition-colors">{match.lost.title}</h4>
              <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed h-10 italic">"{match.found.description}"</p>
              
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex items-center gap-3 text-slate-400 text-sm font-medium">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-primary-400 group-hover:text-white transition-colors"><MapPin size={16} /></div>
                  <span className="truncate">Found at: <span className="text-white font-bold">{match.found.location}</span></span>
                </div>
                <div className="flex items-center gap-3 text-slate-400 text-sm font-medium">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-primary-400 group-hover:text-white transition-colors"><Calendar size={16} /></div>
                  <span className="truncate">Reported as lost on: <span className="text-white font-bold">{new Date(match.lost.date_lost).toLocaleDateString()}</span></span>
                </div>
              </div>

              <button className="btn-primary w-full mt-auto py-3.5 flex items-center justify-center gap-3">
                <ExternalLink size={18} /> View Details & Claim
              </button>
            </div>
          </motion.div>
        )) : (
          <div className="col-span-full py-32 text-center">
             <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-dashed border-slate-800 animate-pulse">
                <AlertCircle className="text-slate-700" size={48} />
             </div>
             <h3 className="text-2xl font-bold mb-3 text-slate-500">No matches found yet.</h3>
             <p className="text-slate-600 max-w-sm mx-auto">Our AI constanty monitors new arrivals. You'll receive an email notification when a match is found!</p>
          </div>
        )}
      </div>

      {/* Detail Modal Overlay */}
      <AnimatePresence>
        {selectedMatch && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/90 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-5xl max-h-[90vh] glass-card lg:p-0 overflow-hidden flex flex-col lg:grid lg:grid-cols-[1fr,400px]"
            >
              {/* Left Side: Images Comparison */}
              <div className="p-8 lg:p-12 space-y-10 overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between mb-2">
                   <h2 className="text-3xl font-black font-outfit"><span className="gradient-text">Match Verification</span> <span className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em] ml-4 bg-slate-900 px-3 py-1 rounded-full">{Math.round(selectedMatch.score * 100)}% Confidence</span></h2>
                   <button onClick={() => setSelectedMatch(null)} className="p-2.5 rounded-full hover:bg-slate-800 transition-colors text-slate-400 hover:text-white focus:outline-none"><X size={24} /></button>
                </div>

                <div className="grid grid-cols-2 gap-8 py-8 border-y border-slate-800/50">
                   <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-widest text-primary-400">LOST RECORD</span>
                        <span className="w-2 h-2 rounded-full bg-primary-400 animate-ping"></span>
                      </div>
                      <div className="aspect-square rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
                        <img src={selectedMatch.lost.image_url} className="w-full h-full object-cover" />
                      </div>
                      <h3 className="text-2xl font-bold font-outfit uppercase tracking-tight truncate">{selectedMatch.lost.title}</h3>
                   </div>
                   <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-widest text-green-400">FOUND ARRIVAL</span>
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      </div>
                      <div className="aspect-square rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
                        <img src={selectedMatch.found.image_url} className="w-full h-full object-cover" />
                      </div>
                      <h3 className="text-2xl font-bold font-outfit uppercase tracking-tight truncate">Found: {selectedMatch.found.location}</h3>
                   </div>
                </div>

                <div className="space-y-6 pt-4">
                   <div className="flex items-start gap-4 p-5 rounded-2xl bg-primary-500/5 border border-primary-500/10">
                      <Navigation className="text-primary-400 mt-1 shrink-0" size={24} />
                      <div>
                        <h4 className="font-bold text-lg mb-1">AI Similarity Breakdown</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">Both items were identified as <span className="text-white font-bold">"{selectedMatch.found.detected_labels?.[0]}"</span> with similar visual characteristics and semantic description mapping.</p>
                      </div>
                   </div>
                </div>
              </div>

              {/* Right Side: Claim Processing */}
              <div className="bg-slate-900/60 p-8 lg:p-12 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col justify-between">
                 <div className="space-y-10 text-center">
                    <div>
                       <h3 className="text-2xl font-black font-outfit mb-4 uppercase">Verification QR</h3>
                       <p className="text-slate-500 text-sm leading-relaxed px-4">Found an exact match? Scanning this QR code will confirm your claim with the administrator office.</p>
                    </div>

                    <div className="relative mx-auto w-48 h-48 p-4 bg-white rounded-3xl shadow-[0_0_50px_rgba(255,255,255,0.1)] hover:scale-105 transition-transform duration-500">
                       <QRCodeSVG value={`claim-${selectedMatch.match_id}`} size={160} bgColor="#fff" fgColor="#000" level="H" />
                    </div>

                    <div className="space-y-4 pt-4">
                       <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center justify-center gap-2"> <Shield size={14} className="text-green-500" /> Security Protocol Active</div>
                       <ul className="text-left space-y-3 px-4">
                         <li className="flex items-start gap-3 text-sm text-slate-400"><CheckCircle size={16} className="text-primary-500 shrink-0 mt-0.5" /> Present this QR code to office.</li>
                         <li className="flex items-start gap-3 text-sm text-slate-400"><CheckCircle size={16} className="text-primary-500 shrink-0 mt-0.5" /> Bring a valid identity proof.</li>
                       </ul>
                    </div>
                 </div>

                 <button 
                  onClick={handleClaim}
                  disabled={claimMutation.isPending}
                  className="btn-primary h-14 w-full text-lg mt-10 rounded-2xl group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   <span className="relative z-10 flex items-center justify-center gap-2 font-black italic uppercase tracking-wider">{claimMutation.isPending ? 'Submitting...' : 'Start Recovery Claim'}</span>
                   {!claimMutation.isPending && <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 group-hover:scale-x-110 transition-transform origin-left duration-500"></div>}
                 </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Matches
