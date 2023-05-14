<template>
  <van-overlay :show="true" v-if="pageData.loading">
    <div class="wrapper" @click.stop>
      <van-loading size="35px" vertical text-color="#fff" color="#fff" v-if="pageData.payState === 1">结果查询中...
      </van-loading>
      <div class="pay-fail" v-if="pageData.payState === 2">查询失败，请确认是否支付完成
        <div class="pay-fail-back" @click="backHome">返回</div>
      </div>
    </div>
  </van-overlay>
  <div class="action-container" v-else>
    <div class="header">
      <div class="title line">
        <van-icon name="checked" color="#fff"/>
        领取成功
      </div>
      <div class="line">您已成功领取</div>
      <div class="line">《{{ Settings.LessonName }}》</div>
    </div>

    <div class="body">
      <div class="line title">还差最后一步</div>
      <div class="line">添加助教老师，获取学习课程！</div>
      <div class="line image">
        <img src="/images/success_person_content.webp"/>
      </div>
      <div class="line tip">本课程有助教老师全程伴读，添加老师后方可学习！</div>
    </div>

    <div class="xcx-btn-box">
      <!--      <wx-open-launch-weapp id="launch-btn" :username="Settings.XcxBaseId" :appid="Settings.XcxAppId"-->
      <!--                            @error="errFun" :path="Settings.XcxPath + pageData.mobile">-->
      <!--        <component v-is="'script'" type="text/wxtag-template">-->
      <div class="action" @click="gotoXcx">
        添加助教老师
      </div>
      <!--        </component>-->
      <!--      </wx-open-launch-weapp>-->
    </div>
  </div>
</template>

<script setup>
import {Overlay as VanOverlay, Loading as VanLoading, Icon as VanIcon, showToast} from 'vant';
import {useRoute, useRouter} from "vue-router"
import {onMounted, reactive} from "vue";
import {get_url_link, query_order} from "./utils/utils.js";
import Settings from "./settings"
import wxJs from "./utils/wxconfig"

let pageData = reactive({
  loading: true,
  queryTimes: 0,
  payState: 1,
  mobile: '',
  scheme: '',
})

const route = useRoute()
const router = useRouter()
onMounted(() => {
  // 1651785378950025216
  if (/^[a-zA-Z0-9]{15,32}$/.test(route.query.sn)) {
    fetchOrderInfo(route.query.sn)
  // if (/^[a-z0-9]{32}$/.test(route.query.code)) {
    // setTimeout(() => {
    //   gotoXcx()
    // }, 1000)
  } else {
    backHome()
  }
})

const fetchOrderInfo = (sn) => {
  pageData.queryTimes++
  if (pageData.queryTimes > 3) {
    pageData.payState = 2
    showToast("支付状态查询失败，请重试")
    setTimeout(() => {
      backHome()
    }, 1000)
    return
  }
  query_order(sn).then(res => {
    if (Number(res.data) === 1) {
      // showToast("付款成功，即将跳转小程序")
      pageData.loading = false
      setTimeout(() => {
        gotoXcx()
      }, 500)
    } else {
      console.log("支付状态查询失败，重新查询中...")
      setTimeout(() => {
        fetchOrderInfo(sn)
      }, 500 * pageData.queryTimes)
    }
  }).catch(err => {
    console.log("支付状态查询失败，", err)
    setTimeout(() => {
      fetchOrderInfo(sn)
    }, 500 * pageData.queryTimes)
  })
}

const gotoXcx = () => {
  // 跳转小程序 获取跳转 url_link
  if (pageData.scheme !== '') {
    window.location.href = pageData.scheme
  } else {
    get_url_link().then(res => {
      pageData.scheme = res.data
      window.location.href = pageData.scheme
      // console.log(res.data);
    }).catch(err => {
      console.log(err)
    })
  }
}

const backHome = () => {
  router.replace({name: "Home"})
}
const errFun = e => {
  console.log(e);
}
</script>

<style scoped lang="less">
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  .pay-fail {
    color: #fff;

    .pay-fail-back {
      display: block;
      font-size: 1.2rem;
      text-align: center;
      margin-top: 1rem;
      color: #F5402D;
    }
  }
}

.action-container {
  height: 100%;
  overflow: hidden;
  background: #f6f6f6;

  .line {
    text-align: center;
    //margin-bottom: .2rem;
  }

  .header {
    background: linear-gradient(to right, #FE7342 0%, #F5402D 100%);
    border-bottom-left-radius: 50%;
    border-bottom-right-radius: 50%;
    padding: 2rem 0 1.5rem;
    box-sizing: border-box;
    align-items: center;
    color: #fff;

    .title {
      height: 1.6rem;
      line-height: 1.6rem;
      font-size: 1.3rem;
      margin-bottom: .6rem;
    }
  }

  .body {
    color: #606266;
    padding: 2rem 0 1.5rem;

    .title {
      color: #303133;
      font-size: 1.3rem;
      font-weight: 600;
      margin-bottom: .6rem;
    }

    .image {
      width: 251px;
      height: 182px;
      margin: 0.2rem auto 0;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .tip {
      font-size: .8rem;
      margin-top: .2rem;
      color: #909399;
    }
  }

  .xcx-btn-box {
    width: 50%;
    margin: 2rem auto;
    height: 3rem;
    line-height: 3rem;
    background: #FE7342;
    border-radius: 1.5rem;
    color: #fff;
    text-align: center;
    position: fixed;
    bottom: 2.5rem;
    left: 25%;
    animation: s1 ease-in-out 1.5s infinite;

    .action {
      width: 100%;
      height: 100%;
    }
  }
}

@keyframes s1 {
  0% {
    transform: scale(1.05);
  }
  25% {
    transform: scale(0.95);
  }
  50% {
    transform: scale(1.05);
  }
  75% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1.05);
  }
}
</style>