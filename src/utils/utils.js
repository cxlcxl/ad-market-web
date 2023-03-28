import { requestService } from "./request"

const keys = [
  "RyQpeL5rYuMF50Dp",
  "6v5un6u4WXfSMKEn",
  "AMtIH237CfqtWWeC",
  "rsP2FL7c1UMCYsM4",
  "Xs2IjWlPNZi4Gmhf",
  "qPjVFzusbigogjmf",
  "LLNUrYxflmf3Gok5",
  "XzW1DiDK42007f7I",
  "fFLv1XNu17akCRm6",
  "WPKNVodXn3YQDMFI",
  "IG28Qm24Ka5rrIdy",
  "f7zgQQk3b7SfT1oo",
  "BLhsuofzKDlJW0ha",
  "QgfPW9Q5zosEyxsr",
  "Mzj0xv0XircDqCUB",
  "liOYJLxOz5qjdcmD",
  "FWrHIE0EpGEcemNh",
  "rIbCJtmpeJM2kxTX",
  "HoRlM1gKbcJCP5qV",
  "dZo8ECFwovwrdYRs",
  "sF1ynG3RzyRS9f9W",
  "6zSCeLWdH92vvnXo",
  "jDKRFJM3wpQbMiPF",
  "itYgBR0qomxpYl8x",
  "JhGTsZe7vo6jEEzY",
  "FKu5IJt8STBe3ScN",
  "zNaKC35Xf4LENLvY",
  "h0b3DTd4pvq5toMC",
  "dHKrnmUs2B0acg5A",
  "r1VQP3aMCg4XZGzB",
  "euJg0CvMX2qrCZQk",
  "6fOhn5zVRuIFpyVq",
  "qXNdccMCyKhnMViX",
  "jUcm6KdG1jTXovtI",
  "HhK99B6LZ8kTFy7t",
  "r4byJacQHlPdEKza",
  "igxZ4ea1Y7s58oWy",
  "l3gcLQ9DGpYlqesB",
  "BV5kMAwPoTJwiguq",
  "7BSEFmn2nwrGLrIc",
  "QSHCRFWQ7NRnjzbP",
  "UADC7bgut05Tqj1l",
  "UKZOXsvPZrhefDJD",
  "MTNJyfuHpZOMtwUA",
  "fnQDyC0YwGnE4meO",
  "z2W4rYGbIcRIojuD",
  "dYRfb22Yy3CBxpfk",
  "2ryHW2FIuMJKqDGT",
  "IIYFp2OPHFMjyAIp",
  "N2geNUixJQlUI70P",
  "BbXSEvgTNxKaDYXO",
  "wVfOOOQWKRYbgem5",
  "qIOfXfA7vWx0vBvB",
  "1D6TuEetJAn1M4OI",
  "1vfz2DWtrrs1vzIa",
  "0xLj3ZKjXUENpHBE",
  "rt7R88XHh5IJXnJW",
  "BUkYGDC7iiRnjjmv",
  "VWpPataAJQwJhJxW",
  "d0ZnSg3jIrZgTMCp",
  "FDKV4pwIOL25nCrM",
  "3QVhE7V6QYtkXJez",
  "DGbvICz0slO8WVxw",
  "dEnfkumI6Ko4jKpR",
  "dMihRd8EOXg8x0bg",
  "Bxpw4Z1Tco5blmyE",
  "Q5wy24qVcVRsaNsI",
  "dmFJBnHikLgr6wgD",
  "4Quhvloyk6P1IFvU",
  "L7irt8kdodcUPqCW",
  "LQaEOiaiNq81xO7f",
  "vrO5krqKG54aiFIy",
  "xEEV7GKhgahTo9rv",
  "pTIqcfLyIpS5cfuC",
  "RX4BuwZ2LjKBOTRg",
  "C18hRuvIXPUDJf2c",
  "Bklpm0Y4gQd8F9O3",
  "pqDVIXZXPRv7KW00",
  "d23GNwupSQno2ioM",
  "1nMre8CupJlQMB2z",
]

function fullClose(n, m) {
  let result = Math.random() * (m + 1 - n) + n
  while (result > m) {
    result = Math.random() * (m + 1 - n) + n
  }
  return Math.ceil(result)
}

function generateSecret() {
  var k = []
  var kl = keys.length
  const n = fullClose(0, fullClose(88, 88888))
  var j = n
  while (j > 0) {
    var l = j % kl
    j = Math.floor(j / kl)
    k.push(keys[l].concat(l))
  }
  return k.join("")
}

export function getVerifyCode({ mobile }) {
  const data = {
    mobile,
    secret: generateSecret(),
  }
  return requestService({
    url: "/v1/sms",
    method: "post",
    data,
  })
}

export function codeVerify({ mobile, code }) {
  const data = {
    mobile: mobile.toString(),
    code: code.toString(),
    secret: generateSecret(),
  }
  return requestService({
    url: "/v1/sms-valid",
    method: "post",
    data
  })
}
