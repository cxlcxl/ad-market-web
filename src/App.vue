<template>
  <div class="page-container">

    <div class="text-box" id="sign-in-box">
      <div class="label">手机号</div>
      <div class="mobile-input">
        <input type="number" placeholder="用于课程及学习资料" class="mobile" v-model="signForm.mobile" @input="handleChangeMobile" maxlength="11" />
      </div>
    </div>
    <div class="text-box" v-if="pageData.showVerify">
      <div class="label">验证码</div>
      <div class="mobile-input"><input type="number" placeholder="请填写验证码" class="verify-code" v-model="signForm.code" /></div>
      <div :class="{'verify-code-btn': true, 'bright': !pageData.begin}" @click="handleGetVerifyCode">
        <span v-if="pageData.begin">{{pageData.codeTimeout}} s</span>
        <span v-else>{{pageData.verifyText}}</span>
      </div>
    </div>
    <div class="error-msg" v-show="pageData.hasError">{{pageData.errorMsg}}</div>
    <div class="sign-up-btn" @click="handleSignIn" :loading="pageData.loading">立即报名</div>

    <a href="#sign-in-box">
      <div class="page-sign-up-btn" :loading="pageData.loading">立即报名</div>
    </a>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, ref } from "vue"
import { getVerifyCode } from "./utils/utils"

export default defineComponent({
  setup() {
    let pageData = reactive({
      verifyText: "获取验证码",
      loading: false,
      showVerify: false,
      begin: false,
      hasError: false,
      codeTimeout: 60,
      errorMsg: "有错误",
    })
    let signForm = reactive({
      mobile: "",
      code: "",
    })

    let timeoutVerify = ref(null)
    onMounted(() => {
      fetchData()
    })
    const fetchData = () => {
      // pageData.loading = true
    }
    const handleChangeMobile = () => {
      let mobile = signForm.mobile.toString()
      if (mobile.length > 11) {
        signForm.mobile = mobile.substring(0, 11)
      }
      console.log(signForm.mobile)
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

      getVerifyCode(signForm)
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {
          console.log(err)
        })
      pageData.loading = true
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
      }
    }
    const timeRun = () => {
      timeoutVerify = setInterval(() => {
        pageData.codeTimeout -= 1
        if (pageData.codeTimeout <= 0) {
          pageData.begin = false
          pageData.codeTimeout = 60
          clearInterval(timeoutVerify)
        }
      }, 1000)
    }
    const setError = (isErr, msg) => {
      pageData.hasError = isErr
      pageData.errorMsg = !isErr ? "" : msg
    }

    return {
      pageData,
      signForm,
      fetchData,
      handleSignIn,
      handleGetVerifyCode,
      handleChangeMobile,
    }
  },
})
</script>

<style scoped lang="less">
.page-container {
  width: 100%;
  max-width: 760px;
  padding: 1.3rem 0;
  background: #fff;
  margin: 0 auto;

  .text-box {
    width: 90%;
    margin: 0 auto 1rem;
    display: flex;

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
      color: #fa5151;
    }
  }

  .error-msg {
    font-size: 0.8rem;
    width: 90%;
    margin: -0.5rem auto 0.2rem;
    color: #fa5151;
    text-align: center;
  }
  .sign-up-btn {
    width: 90%;
    background: #fa5151;
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
  bottom: 0.7rem;
  left: 5%;
  width: 90%;
  max-width: 760px * 0.8;
  background: #fa5151;
  color: #fff;
  font-size: 0.9rem;
  text-align: center;
  height: 2.2rem;
  line-height: 2.2rem;
  border-radius: 1rem;

  a {
    color: inherit;
  }
}
</style>
