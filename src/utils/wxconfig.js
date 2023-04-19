import wx from "weixin-js-sdk" // SDK依赖
import { getJsSdkSignature } from "./utils"

// https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/staticstorage/jump-miniprogram.html
export default {
  init: () => {
    // 需要使用的api列表
    // const u = navigator.userAgent.toLowerCase()
    // const isIOS = u.indexOf('iphone') > -1 // 判断是否是ios微信
    return new Promise((resolve, reject) => {
      getJsSdkSignature().then(
        (res) => {
          // console.log('init -> url==========', url || window.location.href)
          // console.log('init -> res================', res)
          const { app_id, timestamp, nonce, signature } = res.data
          wx.config({
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: app_id, // 必填，企业号的唯一标识，此处填写企业号corpid
            timestamp, // 必填，生成签名的时间戳
            nonceStr: nonce, // 必填，生成签名的随机串
            signature, // 必填，签名，见附录1
            jsApiList: ["wx-open-launch-weapp",'chooseImage', 'previewImage'], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            openTagList: ["wx-open-launch-weapp"], // 可选，需要使用的开放标签列表
          })
          wx.ready((res) => {
            // 微信SDK准备就绪后执行的回调。
            // console.log('init -> 微信SDK准备就绪后执行的回调', res)
            resolve(wx, res)
          })
        },
        (err) => {
          reject(err)
        }
      )
    })
  },
}
