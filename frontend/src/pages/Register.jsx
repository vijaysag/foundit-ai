import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/api'
import { motion } from 'framer-motion'
import { User, Mail, Lock, UserPlus, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [loading, setLoading] = React.useState(false)
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await authService.register(data)
      toast.success('Registration successful! Please login.')
      navigate('/login')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center -mt-16">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg glass-card"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold font-outfit mb-3">Create Account</h2>
          <p className="text-slate-400">Join our community and help people find their lost items.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-400 transition-colors" size={20} />
                <input 
                  {...register('name', { required: 'Name is required' })}
                  type="text" 
                  placeholder="John Doe"
                  className="input-field pl-12"
                />
              </div>
              {errors.name && <p className="text-red-400 text-xs px-1">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Account Role</label>
              <select 
                {...register('role')} 
                className="input-field w-full appearance-none"
              >
                <option value="user" className='bg-slate-900'>General User</option>
                <option value="admin" className='bg-slate-900'>Administrator</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-400 transition-colors" size={20} />
              <input 
                {...register('email', { required: 'Email is required' })}
                type="email" 
                placeholder="john@example.com"
                className="input-field pl-12"
                autoComplete="username"
              />
            </div>
            {errors.email && <p className="text-red-400 text-xs px-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-400 transition-colors" size={20} />
              <input 
                {...register('password', { required: 'Password is required' })}
                type="password" 
                placeholder="••••••••"
                className="input-field pl-12"
                autoComplete="new-password"
              />
            </div>
            {errors.password && <p className="text-red-400 text-xs px-1">{errors.password.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full h-12 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <><UserPlus size={20} /> Register</>}
          </button>
        </form>

        <div className="mt-8 text-center text-slate-500">
          Already have an account? <Link to="/login" className="text-primary-400 font-semibold hover:underline">Sign in now</Link>
        </div>
      </motion.div>
    </div>
  )
}

export default Register
