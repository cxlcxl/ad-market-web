import axios from "axios"
import { encrypt } from "./encrypt"
import { toastMsg } from "./utils"

const key = "1nMre8CupJlQMB2z"

function generateSecret() {
  let timestamp = new Date().getTime()
  let second = Math.floor(timestamp / 1000)
  return encrypt(Number(second) + 30, key, key)
}

const rs = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: process.env.VUE_APP_BASE_API,
  // 超时
  timeout: 20000,
})
// request拦截器
rs.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = generateSecret()
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// 响应拦截器
rs.interceptors.response.use(
  (res) => {
    return res.data
  },
  (error) => {
    if (error.response.data) {
      const err = error.response.data
      return Promise.reject(err)
    } else {
      return Promise.reject(error.response)
    }
  }
)

export default rs
