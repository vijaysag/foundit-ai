import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { itemService } from '../services/api'
import { motion } from 'framer-motion'
import { Camera, MapPin, Search, Loader2, Sparkles, Upload, FileText, Send } from 'lucide-react'
import toast from 'react-hot-toast'

const UploadFound = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [loading, setLoading] = React.useState(false)
  const [preview, setPreview] = React.useState(null)
  const navigate = useNavigate()

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data) => {
    setLoading(true)
    const formData = new FormData()
    formData.append('description', data.description)
    formData.append('location', data.location)
    formData.append('image', data.image[0])

    try {
      const response = await itemService.uploadFound(formData)
      toast.success('Found item uploaded successfully! Our AI is extracting details...')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles size={12} /> AI Vision Active
        </div>
        <h1 className="text-4xl font-bold font-outfit gradient-text mb-4">Upload Found Item</h1>
        <p className="text-slate-400 max-w-lg mx-auto leading-relaxed">Simply snap a photo and tell us where you found it. Our AI will handle the tagging and matching.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Upload Container */}
        <div className="glass-card flex flex-col items-center justify-center min-h-[400px] border-dashed border-2 relative overflow-hidden group">
          {preview ? (
            <>
              <img src={preview} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 blur-[2px] opacity-40 shadow-inner" />
              <img src={preview} className="relative z-10 w-full max-h-[350px] object-contain rounded-xl shadow-2xl transition-all duration-500" />
              <button 
                onClick={() => setPreview(null)}
                className="absolute top-4 right-4 z-20 bg-slate-900/80 p-2 rounded-full text-white hover:bg-red-500 transition-colors"
                type="button"
              >
                ✕
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center text-center p-8">
              <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mb-6 border border-slate-700 group-hover:scale-110 group-hover:border-primary-500 group-hover:shadow-[0_0_30px_rgba(56,189,248,0.2)] transition-all duration-500">
                <Camera size={36} className="text-slate-400 group-hover:text-primary-400 transition-colors" />
              </div>
              <h3 className="text-xl font-bold font-outfit mb-2">Drop image here</h3>
              <p className="text-slate-500 text-sm mb-6">Or click to browse from your device</p>
              <label className="btn-primary cursor-pointer h-12 px-8">
                <Upload size={18} /> Browse Photo
                <input 
                  {...register('image', { required: 'Image is required', onChange: handleFileChange })}
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                />
              </label>
            </div>
          )}
        </div>

        {/* Details Container */}
        <div className="glass-card flex flex-col justify-between p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 ml-1">Where was it found?</label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-400 transition-colors" size={20} />
                <input 
                  {...register('location', { required: 'Location is required' })}
                  placeholder="e.g. Science Lab, Floor 2"
                  className="input-field pl-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 ml-1">Simple Description</label>
              <div className="relative group">
                <FileText className="absolute left-4 top-4 text-slate-500 group-focus-within:text-primary-400 transition-colors" size={20} />
                <textarea 
                  {...register('description', { required: 'Brief description helps matching' })}
                  rows="5" 
                  placeholder="Describe what you see..."
                  className="input-field pl-12 resize-none pt-3"
                ></textarea>
              </div>
              <p className="text-xs text-slate-500 italic mt-2">* Don't worry, AI will extract technical details automatically!</p>
            </div>

            <button 
              type="submit" 
              disabled={loading || !preview}
              className="btn-primary w-full h-14 text-lg disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed mt-4 shadow-primary-600/30"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="animate-spin" size={24} />
                  <span>Analyzing Image...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send size={20} /> Publish to AI Database
                </div>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UploadFound
