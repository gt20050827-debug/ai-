import axios from 'axios'
import { ElMessage } from 'element-plus'

const service = axios.create({
  baseURL: '/api',
  timeout: 5000
})

service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['token'] = token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response) => {
    const { data, config } = response
    if (data.code === "200") {
      return data.data
    } else {
      if (data.code === "-1") {
        const isAuthError = data.msg && (data.msg.includes('登录') || data.msg.includes('token') || data.msg.includes('Token') || data.msg.includes('认证') || data.msg.includes('授权'))
        if (isAuthError && !config.url.includes('/login')) {
          ElMessage.error(data.msg || '登录过期，请重新登录')
          localStorage.removeItem('token')
          localStorage.removeItem('userInfo')
          window.location.href = '/auth/login'
        }
        return Promise.reject(data.msg || '请求失败')
      } else {
        ElMessage.error(data.msg || '请求失败')
        return Promise.reject(data.msg || '请求失败')
      }
    }
  },
  error => {
    return Promise.reject(error)
  }
)

export default service
