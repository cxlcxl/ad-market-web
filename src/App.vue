<template>
  <div class="page-container">
    <header-page />

    <div class="leave-msg" id="sign-in-box">
      <div class="text-box">
        <div class="how-money">课程仅需 <span>1</span> 元</div>
      </div>
      <div class="text-box">
        <div class="label">手机号</div>
        <div class="mobile-input">
          <input type="number" placeholder="用于课程及学习资料" class="mobile" v-model="signForm.mobile" @input="handleChangeMobile" maxlength="11" />
        </div>
      </div>
      <div class="text-box" v-if="pageData.showVerify">
        <div class="label">验证码</div>
        <div class="mobile-input">
          <input type="number" placeholder="请填写验证码" class="verify-code" v-model="signForm.code" maxlength="4" />
        </div>
        <div :class="{'verify-code-btn': true, 'bright': !pageData.begin}" @click="handleGetVerifyCode">
          <span v-if="pageData.begin">{{pageData.codeTimeout}} s</span>
          <span v-else>{{pageData.verifyText}}</span>
        </div>
      </div>
      <div class="xcx-btn-box">
        <wx-open-launch-weapp id="launch-btn" username="gh_cf2b2437b2d8" @error="errFun" :path="pageData.xcxPath" style="width: 100%;height: 100%;">
          <component :is="'script'" type="text/wxtag-template">
            <component :is="'style'">
              .wx-btn {width: 200px; height: 45px; text-align: center; font-size: 17px; display: block;margin: 0 auto; padding: 8px 24px; border: none; border-radius: 4px; background-color: #07c160; color:#fff;}
            </component>
            <button class="wx-btn">添加助教获取 1v1 指导</button>
          </component>
        </wx-open-launch-weapp>
      </div>
      <div class="error-msg" v-show="pageData.hasError">{{pageData.errorMsg}}</div>
      <div class="sign-up-btn" @click="handleSignIn" :loading="pageData.loading">立即报名 仅需 1 元</div>
    </div>

    <a href="#sign-in-box">
      <div class="page-sign-up-btn" :loading="pageData.loading">立即报名 仅需 1 元</div>
    </a>

    <footer-page />
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, ref } from "vue"
import { getVerifyCode, codeVerify, toastMsg, get_url_link, get_h5pay_url } from "./utils/utils"
import HeaderPage from "./components/header.vue"
import FooterPage from "./components/footer.vue"
import wxJs from "./utils/wxconfig"
import {getStorage, setStorage} from './utils/cache'

export default defineComponent({
  components: { HeaderPage, FooterPage },
  setup() {
    let pageData = reactive({
      verifyText: "获取验证码",
      loading: false,
      showVerify: true,
      begin: false,
      hasError: false,
      codeTimeout: 60,
      errorMsg: "有错误",
      xcxPath: "pages/friend/friend.html?mobile=",
    })
    let signForm = reactive({
      mobile: "",
      code: "",
    })

    let timeoutVerify = ref(null)
    onMounted(() => {
      fetchData()
      // wxJs.init()
    })
    const fetchData = () => {
      const info = getStorage("valid_mobile_info")
      if (info && info.hasOwnProperty('state') && info.hasOwnProperty('mobile')) {
        toastMsg("检测到您已验证过信息，加载中...")
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
        setError(true, "请填写正确格式的手机号码")
        return
      }
      if (!/^\d{4}$/.test(signForm.code)) {
        setError(true, "请填写验证码")
        return
      }

      codeVerify(signForm)
        .then((res) => {
          if (res.code === 0) {
            setStorage("valid_mobile_info", {mobile: signForm.mobile, state: res.data.state})
            const state = res.data.state
            // gotoXcx()
            if (state === 1) {
              toastMsg("验证成功，请稍后...")
              gotoPay(signForm.mobile.toString())
            } else {
              toastMsg("验证成功，即将跳转添加导师...")
              setTimeout(function () {
                gotoXcx()
              }, 2000)
            }
          }
        })
        .catch((err) => {
          console.log(err)
          toastMsg(err.message)
        })
      // pageData.loading = true
    }
    const handleGetVerifyCode = () => {
      if (!/^1\d{10}$/.test(signForm.mobile)) {
        setError(true, "请填写正确格式的手机号码")
        return
      }
      setError(false)
      if (pageData.begin) {
        return
      } else {
        pageData.showVerify = true
        pageData.begin = true
        timeRun()
        getVerifyCode({ mobile: signForm.mobile.toString() })
          .then((res) => {
            toastMsg("验证码发送成功，请注意查收短信")
          })
          .catch((err) => {
            toastMsg(err.message ? err.message : "接口调用异常，请重试")
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
    const setError = (isErr, msg) => {
      pageData.hasError = isErr
      pageData.errorMsg = !isErr ? "" : msg
    }
    const gotoXcx = () => {
      // 跳转小程序 获取跳转 url_link
      get_url_link().then(res => {
        window.location.href = res.data
      }).catch(err => {console.log(err)})
    }
    const gotoPay = (mobile) => {
      // h5 支付
      get_h5pay_url({ mobile }).then(res => {
        window.location.href = res.data
      }).catch(err => {console.log(err)})
    }
    const errFun = (err) => {
      console.log(err)
    }

    return {
      pageData,
      signForm,
      fetchData,
      handleSignIn,
      handleGetVerifyCode,
      handleChangeMobile,
      errFun,
    }
  },
})
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
        padding: 0.5rem 0.6rem;
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
      width: 5rem;
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
      color: #67c23a;
    }
  }

  .error-msg {
    font-size: 0.8rem;
    width: 90%;
    margin: -0.5rem auto 0.2rem;
    color: #fa5151;
    text-align: center;
    font-weight: 600;
  }
  .sign-up-btn {
    width: 90%;
    background: #67c23a;
    color: #fff;
    font-size: 0.9rem;
    text-align: center;
    margin: 0 auto;
    height: 2.2rem;
    line-height: 2.2rem;
    border-radius: 1rem;
  }
}

.page-sign-up-btn {
  position: fixed;
  bottom: 0rem;
  left: 0;
  width: 100%;
  background: #67c23a;
  color: #fff;
  font-size: 0.9rem;
  text-align: center;
  height: 2.5rem;
  line-height: 2.5rem;

  a {
    color: inherit;
  }
}

.xcx-btn-box {
  display: none;
  width: 100%;
  height:3em;

  wx-open-launch-weapp {
  height: 30px;

  .wx-btn {
  }
}
}

</style>
