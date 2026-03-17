import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

// Request interceptor: inject auth token
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    try {
      // Get token from Zustand persisted store
      const stored = localStorage.getItem('auth-storage')
      if (stored) {
        const { state } = JSON.parse(stored)
        if (state?.accessToken) {
          config.headers.Authorization = `Bearer ${state.accessToken}`
        }
      }
    } catch {
      // ignore parse errors
    }
  }
  return config
})

// Response interceptor: handle 401/403
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth and redirect
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-storage')
        window.location.href = '/sign-in'
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
