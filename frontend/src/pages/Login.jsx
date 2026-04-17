import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/api'
import { motion } from 'framer-motion'
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

const Login = ({ setIsAuthenticated }) => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [loading, setLoading] = React.useState(false)
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const response = await authService.login(data.email, data.password)
      localStorage.setItem('token', response.access_token)
      localStorage.setItem('role', response.role || 'user')
      setIsAuthenticated(true)
      toast.success('Successfully logged in!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center -mt-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold font-outfit mb-3">Welcome Back</h2>
          <p className="text-slate-400">Login to access your dashboard and manage reported items.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                autoComplete="current-password"
              />
            </div>
            {errors.password && <p className="text-red-400 text-xs px-1">{errors.password.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full h-12 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <><LogIn size={20} /> Login</>}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-500">
            Don't have an account? <Link to="/register" className="text-primary-400 font-semibold hover:underline">Sign up now</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
