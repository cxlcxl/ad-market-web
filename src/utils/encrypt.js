import CryptoJS from "crypto-js"

// 加密
export function encrypt(pwd, key, iv) {
  pwd = CryptoJS.enc.Utf8.parse(pwd) // 解析明文
  key = CryptoJS.enc.Utf8.parse(key) // 解析密钥
  iv = CryptoJS.enc.Utf8.parse(iv)
  const encrypted = CryptoJS.AES.encrypt(pwd, key, {
    mode: CryptoJS.mode.CBC, // 加密模式
    padding: CryptoJS.pad.Pkcs7, // 填充方式
    iv, // 向量
  })
  return encrypted.toString() // 加密后的结果是对象，要转为文本
}
