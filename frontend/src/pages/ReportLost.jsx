import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { itemService } from '../services/api'
import { motion } from 'framer-motion'
import { Upload, MapPin, Calendar, FileText, Send, Loader2, Image as ImageIcon, Search } from 'lucide-react'
import toast from 'react-hot-toast'

const ReportLost = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const [loading, setLoading] = React.useState(false)
  const [preview, setPreview] = React.useState(null)
  const navigate = useNavigate()

  const imageWatcher = watch('image')

  React.useEffect(() => {
    if (imageWatcher && imageWatcher[0]) {
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result)
      reader.readAsDataURL(imageWatcher[0])
    }
  }, [imageWatcher])

  const onSubmit = async (data) => {
    setLoading(true)
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('description', data.description)
    formData.append('location', data.location)
    formData.append('date_lost', data.date_lost)
    if (data.category) formData.append('category', data.category)
    if (data.image && data.image[0]) formData.append('image', data.image[0])

    try {
      await itemService.reportLost(formData)
      toast.success('Lost item report submitted and AI matching is in progress!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Submission failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-4xl font-bold font-outfit gradient-text mb-4">Report Lost Item</h1>
        <p className="text-slate-400">Our AI will automatically check for matches against found items.</p>
      </div>

      <div className="grid md:grid-cols-[1fr,350px] gap-8">
        <div className="glass-card scale-in">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Item Title</label>
              <div className="relative group">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-400" size={18} />
                <input 
                  {...register('title', { required: 'Title is required' })}
                  placeholder="e.g. Blue Dell Laptop"
                  className="input-field pl-12"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Location Lost</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-400" size={18} />
                  <input {...register('location', { required: 'Location is required' })} placeholder="Library, cafe..." className="input-field pl-12" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Date Lost</label>
                <input {...register('date_lost', { required: 'Date is required' })} type="date" className="input-field" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Category</label>
              <select {...register('category')} className="input-field appearance-none">
                <option value="Electronics" className='bg-slate-900'>Electronics</option>
                <option value="Wallets/Bags" className='bg-slate-900'>Wallets/Bags</option>
                <option value="Keys" className='bg-slate-900'>Keys</option>
                <option value="Documents" className='bg-slate-900'>Documents</option>
                <option value="Others" className='bg-slate-900'>Others</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Detailed Description</label>
              <textarea 
                {...register('description', { required: 'Description is required' })}
                rows="4" 
                placeholder="Details like brand, color, stickers, unique marks..."
                className="input-field resize-none"
              ></textarea>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full h-14 text-lg"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : <><Send size={20} /> Submit Report</>}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="glass-card flex flex-col items-center justify-center border-dashed border-2 py-10 relative overflow-hidden group">
            {preview ? (
              <img src={preview} className="absolute inset-0 w-full h-full object-cover opacity-60" />
            ) : (
              <ImageIcon className="text-slate-600 mb-4" size={48} />
            )}
            <input 
              {...register('image')}
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer z-10" 
              accept="image/*"
            />
            <div className="relative z-20 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary-600/20 text-primary-400 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Upload size={24} />
              </div>
              <p className="text-sm font-semibold text-white">Upload Photograph</p>
              <p className="text-xs text-slate-500 mt-1">Recommended for better AI matching</p>
            </div>
          </div>
          
          <div className="glass-card bg-primary-500/5 border-primary-500/20 p-6">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Search className="text-primary-400" size={18} /> AI Suggestion
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed italic">
              "Adding an image helps our computer vision model to better categorize your item and increase match score by 45% on average."
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportLost
