import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authService = {
  login: async (email, password) => {
    const formData = new FormData()
    formData.append('username', email)
    formData.append('password', password)
    const response = await api.post('/auth/login', formData)
    return response.data
  },
  register: async (data) => {
    const response = await api.post('/auth/register', data)
    return response.data
  },
  getProfile: async () => {
    const response = await api.get('/auth/me')
    return response.data
  }
}

export const itemService = {
  reportLost: async (formData) => {
    const response = await api.post('/items/lost', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },
  uploadFound: async (formData) => {
    const response = await api.post('/items/found', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },
  getAllItems: async () => {
    const response = await api.get('/items/all')
    return response.data
  },
  getMyItems: async () => {
    const response = await api.get('/items/my-items')
    return response.data
  },
  getMatches: async () => {
    const response = await api.get('/items/matches')
    return response.data
  }
}

export const claimService = {
  createClaim: async (matchId) => {
    const response = await api.post(`/claims/?match_id=${matchId}`)
    return response.data
  },
  getClaims: async () => {
    const response = await api.get('/claims/')
    return response.data
  },
  updateClaimStatus: async (claimId, action) => {
    const response = await api.put(`/claims/${claimId}/status?action=${action}`)
    return response.data
  }
}

export default api
