import axios from 'axios'

// Axios instance configured with base URL from Vite env
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

// Attach Bearer token from auth storage on each request
apiClient.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem('auth-storage')
    if (stored) {
      const { state } = JSON.parse(stored)
      if (state?.accessToken) {
        config.headers.Authorization = `Bearer ${state.accessToken}`
      }
    }
  } catch {
    /* ignore parse errors */
  }
  return config
})

// Handle 401 by clearing auth and redirecting to sign-in
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-storage')
      window.location.href = '/sign-in'
    }
    return Promise.reject(error)
  }
)

export default apiClient
