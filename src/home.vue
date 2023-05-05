<template>
  <div class="page-container">
    <HeaderPage/>

    <div class="leave-msg" id="sign-in-box">
      <div class="text-box">
<!--        <div class="how-money">课程仅需 <span>1</span> 元</div>-->
        <div class="how-money">抢免费公开课名额</div>
      </div>
      <div class="text-box">
        <div class="label">手机号</div>
        <div class="mobile-input">
          <input type="number" placeholder="用于课程及学习资料" class="mobile" v-model="signForm.mobile"
                 @input="handleChangeMobile" maxlength="11"/>
        </div>
      </div>
      <div class="text-box" v-if="pageData.showVerify">
        <div class="label">验证码</div>
        <div class="mobile-input">
          <input type="text" placeholder="请填写验证码" class="verify-code" v-model="signForm.code" maxlength="4"/>
        </div>
        <div :class="{'verify-code-btn': true, 'bright': !pageData.begin}" @click="handleGetVerifyCode">
          <span v-if="pageData.begin">{{ pageData.codeTimeout }} s</span>
          <span v-else>{{ pageData.verifyText }}</span>
        </div>
      </div>
      <div class="sign-up-btn" @click="handleSignIn" :loading="pageData.loading">立即领取</div>
<!--      <div class="sign-up-btn" @click="handleSignIn" :loading="pageData.loading">立即报名 仅需 1 元</div>-->
    </div>

    <a href="#sign-in-box">
      <div class="page-sign-up-btn" :loading="pageData.loading">
        <span class="fetch-font">赠送价值千元上货软件</span>
        <div class="sign-now">立即领取</div>
      </div>
    </a>

    <FooterPage/>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue"
import {getVerifyCode, codeVerify, get_url_link, get_h5pay_url, query_order, is_wx_browser} from "./utils/utils"
import HeaderPage from "./components/header.vue"
import FooterPage from "./components/footer.vue"
import {getStorage, setStorage} from './utils/cache'
import {showToast} from 'vant';
import {useRoute, useRouter} from "vue-router"
import Settings from './settings'
import md5 from 'js-md5'

let pageData = reactive({
  verifyText: "获取验证码",
  loading: false,
  showVerify: true,
  begin: false,
  codeTimeout: 60,
  queryTimes: 0,
})
let signForm = reactive({
  mobile: "",
  code: "",
})

const route = useRoute()
const router = useRouter()
let timeoutVerify = ref(null)
onMounted(() => {
  // fetchData()
  if (is_wx_browser()) {
    // showToast("现在在微信浏览器");
  }
  // getOpenid()
})
const fetchData = () => {
  const info = getStorage("valid_mobile_info")
  if (info && info.hasOwnProperty('state') && info.hasOwnProperty('mobile')) {
    showToast("检测到您已验证过信息，加载中...")
    if (Number(info.state) === 1) {
      gotoPay(info.mobile.toString())
    } else {
      gotoXcx()
    }
    // gotoXcx()
  }
}
const handleChangeMobile = () => {
  let mobile = signForm.mobile.toString()
  if (mobile.length > 11) {
    signForm.mobile = mobile.substring(0, 11)
  }
  if (/^1\d{10}$/.test(signForm.mobile)) {
    pageData.showVerify = true
  }
}
const handleSignIn = () => {
  if (!/^1\d{10}$/.test(signForm.mobile)) {
    showToast("请填写正确格式的手机号码")
    return
  }
  if (!/^\d{4}$/.test(signForm.code)) {
    showToast("请填写验证码")
    return
  }

  codeVerify(signForm)
      .then((res) => {
        if (res.code === 0) {
          // gotoXcx()
          gotoConfirmPage()
          /*setStorage("valid_mobile_info", {mobile: signForm.mobile, state: res.data.state})
          const state = res.data.state
          if (state === 1) {
            showToast("验证成功，请稍后...")
            if (res.data.order !== '') {
              // listenerOrder(res.data.order_sn)
              window.location.href = autoJoinUrl(res.data.order, res.data.order_sn)
            } else {
              gotoPay(signForm.mobile.toString())
            }
          } else {
            showToast("您已购买过体验课，即将跳转添加导师...")
            setTimeout(function () {
              gotoXcx()
            }, 2000)
          }*/
        }
      })
      .catch((err) => {
        console.log(err)
        showToast(err.message)
      })
  // pageData.loading = true
}
const handleGetVerifyCode = () => {
  if (!/^1\d{10}$/.test(signForm.mobile)) {
    showToast("请填写正确格式的手机号码")
    return
  }
  if (pageData.begin) {
    return
  } else {
    pageData.showVerify = true
    pageData.begin = true
    timeRun()
    getVerifyCode({mobile: signForm.mobile.toString()})
        .then((res) => {
          showToast("验证码发送成功，请注意查收短信")
        })
        .catch((err) => {
          showToast(err.message ? err.message : "接口调用异常，请重试")
          stopTimeout()
        })
  }
}
const stopTimeout = () => {
  pageData.begin = false
  pageData.codeTimeout = 60
  clearInterval(timeoutVerify)
}
const timeRun = () => {
  timeoutVerify = setInterval(() => {
    pageData.codeTimeout -= 1
    if (pageData.codeTimeout <= 0) {
      stopTimeout()
    }
  }, 1000)
}
const gotoXcx = () => {
  // 跳转小程序 获取跳转 url_link
  get_url_link().then(res => {
    window.location.href = res.data
  }).catch(err => {
    console.log(err)
  })
}
const gotoPay = (mobile) => {
  // h5 支付
  get_h5pay_url({mobile}).then(res => {
    // listenerOrder(res.data.order_sn)
    window.location.href = autoJoinUrl(res.data.order, res.data.order_sn)
  }).catch(err => {
    console.log(err)
  })
}
const autoJoinUrl = (url, sn) => {
  const local = encodeURIComponent(`${Settings.RedirectUri}${sn}`)
  const payUrl = `${url}&redirect_url=${local}`
  console.log(payUrl)
  return payUrl
}

const gotoConfirmPage = () => {
  const code = md5(`${signForm.mobile}-${signForm.code}`)
  router.push({ name: "PayAction", query: {code}})
}

</script>

<style scoped lang="less">
.page-container {
  width: 100%;
  height: 100%;
  max-width: 760px;
  // padding: 1.3rem 0;
  background: #fff;
  margin: 0 auto;
  position: relative;
  box-sizing: border-box;

  .leave-msg {
    margin: 1.5rem 0;
  }

  .text-box {
    width: 90%;
    margin: 0 auto 1rem;
    display: flex;

    .how-money {
      color: #fa5151;
      font-size: 1.2rem;
      text-align: center;
      width: 100%;
      line-height: 2rem;
      height: 2rem;
      font-weight: 500;

      span {
        font-size: 1.5rem;
        font-weight: 600;
      }
    }

    .label,
    .mobile-input {
      display: inline-block;
      line-height: 2.5rem;
      height: 2.5rem;
    }

    .label {
      width: 3.5rem;
      font-size: 0.9rem;
      color: #606266;
    }

    .mobile-input {
      flex: 1;

      .mobile,
      .verify-code {
        font-size: 0.9rem;
        padding: 0 0.6rem;
        outline: none;
        width: 100%;
        border-radius: 0.2rem;
        border: 0;
        color: #606266;
        background: #f1f1f1;
        box-sizing: border-box;
      }
    }

    .verify-code-btn {
      width: 6rem;
      margin-left: 0.5rem;
      font-size: 0.9rem;
      line-height: 2rem;
      height: 2rem;
      margin-top: 0.3rem;
      text-align: center;
      padding-left: 0.2rem;
      color: #a7abb3;
    }

    .bright {
      color: #fa5151;
    }
  }

  .sign-up-btn {
    width: 90%;
    background: #FEF79C;
    color: #fa5151;
    font-size: 0.9rem;
    text-align: center;
    margin: .5rem auto 0;
    height: 2.2rem;
    line-height: 2.2rem;
    border-radius: 1rem;
  }
}

.page-sign-up-btn {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #fa5151;
  color: #fff;
  font-size: 1rem;
  padding: 0 1.5rem;
  height: 3rem;
  line-height: 3rem;
  box-sizing: border-box;
  font-weight: 600;

  .fetch-font {
    //text-decoration: none;
    //background-image: -webkit-linear-gradient(
    //    left,
    //    #5aa3d9,
    //    #e57295 20%,
    //    #ffd400 40%,
    //    #3498db 60%,
    //    #fdd3dc 80%,
    //    #ffd400 90%,
    //    #ffffff
    //);
    //color: transparent;
    //-webkit-background-clip: text;
    //background-size: 200% 100%;
    //animation: slide 5s infinite linear;
  }

  a {
    color: inherit;
  }

  .sign-now {
    display: inline-block;
    background: #07C160;
    color: #fff;
    height: 2.2rem;
    line-height: 2.2rem;
    float: right;
    margin-top: 0.4rem;
    padding: 0 1.5rem;
    border-radius: 1.75rem;
    font-weight: 500;
    animation: s1 ease-in-out 1.5s infinite;
  }
}

@keyframes s1 {
  0% {
    transform: scale(1.1);
  }
  25% {
    transform: scale(0.9);
  }
  50% {
    transform: scale(1.1);
  }
  75% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1.1);
  }
}

@keyframes slide {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: -100% 0;
  }
}
</style>
