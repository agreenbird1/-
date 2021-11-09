<template>
  <LoginHeader>欢迎登录</LoginHeader>
  <section class="container" v-if="isBind">
    <div class="unbind">
      <div class="loading"></div>
    </div>
  </section>
  <section class="container">
    <nav class="tab">
      <a
        @click="hasAccount = true"
        :class="{ active: hasAccount }"
        href="javascript:;"
      >
        <i class="iconfont icon-bind" />
        <span>已有小兔鲜账号，请绑定手机</span>
      </a>
      <a
        @click="hasAccount = false"
        :class="{ active: !hasAccount }"
        href="javascript:;"
      >
        <i class="iconfont icon-edit" />
        <span>没有小兔鲜账号，请完善资料</span>
      </a>
    </nav>
    <div class="tab-content" v-if="hasAccount">
      <CallbackBind :unionId="unionId" />
    </div>
    <div class="tab-content" v-else>
      <CallbackPatch :unionId="unionId" />
    </div>
  </section>
  <LoginFooter />
</template>

<script>
import { ref } from 'vue'
import QC from 'qc'
import message from '@/components/library/Message'
import LoginFooter from './components/LoginFooter.vue'
import LoginHeader from './components/LoginHeader.vue'
import CallbackBind from './components/CallbackBind.vue'
import CallbackPatch from './components/CallbackPatch.vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { qqLogin } from '@/api/user'
export default {
  name: 'LoginCallBack',
  components: { LoginFooter, LoginHeader, CallbackBind, CallbackPatch },
  setup () {
    // 控制两个组件的切换
    const hasAccount = ref(true)
    // 默认登录的标识
    const isBind = ref(true)
    const store = useStore()
    const router = useRouter()
    let unionId = null
    // 默认是已经QQ绑定，直接发请求
    // 若是成功则是已经绑定，否则没有
    // 登录之前先查看qq是否已经登录
    if (QC.Login.check()) {
      // qq获取的openId，第三方唯一标识
      QC.Login.getMe(openId => {
        qqLogin(openId).then(data => {
          unionId = openId
          console.log(unionId)
          // 1.存储用户信息
          // 2.返回来时页或者首页
          const { id, account, avatar, mobile, nickname, token } = data.result
          store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
          // 但是从qq返回的，不会有来源页，所以在login的时候就将其存储在vuex中
          router.push(store.state.user.redirectUrl)
          message({ type: 'success', text: '登陆成功！' })
        }).catch(e => {
          // 有错就代表不行，进行两种绑定
          isBind.value = false
        })
      })
    }
    return {
      hasAccount,
      isBind,
      unionId
    }
  }
}
</script>

<style scoped lang='less'>
.container {
  padding: 25px 0;
  position: relative;
  height: 730px;
  .unbind {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 25px 0;
    z-index: 99;
    .loading {
      height: 100%;
      background: #fff url(../../assets/images/load.gif) no-repeat center /
        100px 100px;
    }
  }
}
.tab {
  background: #fff;
  height: 80px;
  padding-top: 40px;
  font-size: 18px;
  text-align: center;
  a {
    color: #666;
    display: inline-block;
    width: 350px;
    line-height: 40px;
    border-bottom: 2px solid #e4e4e4;
    i {
      font-size: 22px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      margin-left: 4px;
    }
    &.active {
      color: @xtxColor;
      border-color: @xtxColor;
    }
  }
}
.tab-content {
  min-height: 600px;
  background: #fff;
}
</style>
