import axios from 'axios'
import { Message } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/token'

// import { parseQuery } from "@/utils"

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 1000 * 60 * 2
})

// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['accessToken'] = getToken()
  }

  return config
}, error => {
  Promise.reject(error)
})

service.interceptors.response.use(
  response => {
    const res = response.data

    if (res.code != 0 && (response.headers['content-type'] && !response.headers['content-type'].startsWith('application/octet-stream'))) {
      if (res.message) {
        Message({
          message: res.message,
          type: 'error',
          duration: 2 * 1000
        })
      }
      if (response.request.responseType === 'arraybuffer' && response.data.toString() === '[object ArrayBuffer]') {
        const text = Buffer.from(response.data).toString('utf8')
        return Promise.reject(JSON.parse(text))
      }
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    if (error.message) {
      Message({
        message: error.message,
        type: 'error',
        duration: 2 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
