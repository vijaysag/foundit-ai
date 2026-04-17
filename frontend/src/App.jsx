import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ReportLost from './pages/ReportLost'
import UploadFound from './pages/UploadFound'
import Matches from './pages/Matches'
import AdminPanel from './pages/AdminPanel'
import Profile from './pages/Profile'

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(!!localStorage.getItem('token'))

  return (
    <div className="min-h-screen flex flex-col pt-16">
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Register />} />
          
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/report-lost" 
            element={isAuthenticated ? <ReportLost /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/upload-found" 
            element={isAuthenticated ? <UploadFound /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/matches" 
            element={isAuthenticated ? <Matches /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/admin" 
            element={isAuthenticated ? <AdminPanel /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/profile" 
            element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} 
          />
        </Routes>
      </main>
      <footer className="py-8 border-t border-slate-800 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} FoundIt AI. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
