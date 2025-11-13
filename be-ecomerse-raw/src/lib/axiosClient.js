import axios from 'axios'
import Cookies from 'js-cookie'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

axiosClient.interceptors.request.use((config) => {
  // Use admin-specific cookie keys to isolate from user-facing app
  const token = Cookies.get('admin_token') || Cookies.get('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  try { console.log('axios req →', config.method?.toUpperCase(), (config.baseURL || '') + (config.url || '')) } catch {}
  return config
})

axiosClient.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err?.config
    const status = err?.response?.status
    try { console.error('axios err ←', status, err?.response?.data) } catch {}
    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true
    const refreshToken = Cookies.get('admin_refreshToken') || Cookies.get('refreshToken')
      if (!refreshToken) return Promise.reject(err)
      try {
        const res = await axiosClient.post('/refresh-token', { token: refreshToken })
        const newAccessToken = res?.data?.accessToken
        if (!newAccessToken) return Promise.reject(err)
      Cookies.set('admin_token', newAccessToken)
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return axiosClient(originalRequest)
      } catch (e) {
        Cookies.remove('token')
        Cookies.remove('refreshToken')
        try { console.error('refresh-token failed', e?.response?.status, e?.response?.data) } catch {}
        return Promise.reject(e)
      }
    }
    return Promise.reject(err)
  },
)

export default axiosClient


