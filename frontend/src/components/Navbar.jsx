import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Camera, Search, User, LogOut, LayoutDashboard, PlusCircle, History, Shield } from 'lucide-react'

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    setIsAuthenticated(false)
    navigate('/login')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 glass z-50 px-6 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
          <Search className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-bold font-outfit tracking-tight text-white">Found<span className="text-primary-400">It</span>.</span>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        <Link to="/" className="text-slate-300 hover:text-white transition-colors font-medium">Home</Link>
        {isAuthenticated && (
          <>
            <Link to="/dashboard" className="text-slate-300 hover:text-white transition-colors font-medium flex items-center gap-2">
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            <Link to="/matches" className="text-slate-300 hover:text-white transition-colors font-medium flex items-center gap-2">
              <History size={18} /> Matches
            </Link>
            {localStorage.getItem('role') === 'admin' && (
              <Link to="/admin" className="text-slate-300 hover:text-white transition-colors font-medium flex items-center gap-2">
                <Shield size={18} /> Admin Console
              </Link>
            )}
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        {!isAuthenticated ? (
          <>
            <Link to="/login" className="text-slate-300 hover:text-white transition-colors font-medium">Login</Link>
            <Link to="/register" className="btn-primary">Register</Link>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/report-lost" className="btn-secondary hidden sm:flex">
              <PlusCircle size={18} /> Report Lost
            </Link>
            <Link to="/upload-found" className="btn-primary">
              <Camera size={18} /> Found Item
            </Link>
            <Link to="/profile" className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-primary-400 transition-all border border-slate-700" title="Profile">
              <User size={20} />
            </Link>
            <button 
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all border border-slate-700"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
