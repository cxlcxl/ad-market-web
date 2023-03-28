import axios from "axios"
import Toastify from "toastify-js"
import "toastify-js/src/toastify.css"

const networkConfig = {
  serverUrl: process.env.VUE_APP_BASE_API,
  requestTimeout: 20000,
}

// 创建axios实例
export function requestService(config) {
  const service = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    baseURL: networkConfig.serverUrl,
    // 超时
    timeout: networkConfig.requestTimeout,
  })
  // request拦截器
  service.interceptors.request.use(
    (config) => {
      Toastify({
        text: "This is a toast with offset",
      }).showToast()
      return config
    },
    (error) => {
      Promise.reject(error)
    }
  )

  // 响应拦截器
  service.interceptors.response.use(
    (res) => {
      return res.data
    },
    (error) => {
      const err = error.response.data

      const errMsg = err.message ? err.message : "接口调用异常，请重试"
      // ElMessage.error({
      //   message: errMsg,
      //   duration: 5 * 1000,
      // })
      return Promise.reject(err)
    }
  )
  return service(config)
}
