<template>
  <div class="account-box">
    <!-- 两种登录方式切换 -->
    <div class="toggle">
      <a @click="isMsgLogin = false" href="javascript:;" v-if="isMsgLogin">
        <i class="iconfont icon-user"></i> 使用账号登录
      </a>
      <a @click="isMsgLogin = true" href="javascript:;" v-else>
        <i class="iconfont icon-msg"></i> 使用短信登录
      </a>
    </div>
    <!-- validation-schema提供校验guize
         errors保存每一个校验规则的对应的错误信息 -->
    <Form
      class="form"
      v-slot="{ errors }"
      :validation-schema="mySchema"
      autocomplete="off"
      ref="formCom"
    >
      <template v-if="!isMsgLogin">
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field
              :class="{ error: errors.account }"
              v-model="form.account"
              name="account"
              type="text"
              placeholder="请输入用户名"
            >
            </Field>
          </div>
          <!-- 错误信息提示 -->
          <div v-if="errors.account" class="error">
            <i class="iconfont icon-warning" />{{ errors.account }}
          </div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-lock"></i>
            <Field
              v-model="form.password"
              :class="{ error: errors.password }"
              name="password"
              type="password"
              placeholder="请输入密码"
              value="123456"
            /><!-- 错误信息提示 -->
          </div>
          <div v-if="errors.password" class="error">
            <i class="iconfont icon-warning" />{{ errors.password }}
          </div>
        </div>
      </template>
      <template v-else>
        <div class="form-item" aria-autocomplete="off">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field
              v-model="form.mobile"
              :class="{ error: errors.mobile }"
              name="mobile"
              type="text"
              placeholder="请输入手机号"
            />
            <!-- 错误信息提示 -->
          </div>
          <div v-if="errors.mobile" class="error">
            <i class="iconfont icon-warning" />{{ errors.mobile }}
          </div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-code"></i>
            <Field
              v-model="form.code"
              :class="{ error: errors.code }"
              name="code"
              type="text"
              placeholder="请输入验证码"
            />
            <!-- 错误信息提示 -->
            <span @click="sendCode" class="code">
              {{ timer === 0 ? "发送验证码" : `${timer}秒后发送` }}
            </span>
          </div>
          <div v-if="errors.code" class="error">
            <i class="iconfont icon-warning" />{{ errors.code }}
          </div>
        </div>
      </template>
      <div class="form-item">
        <div class="agree">
          <!-- 目的解析 -->
          <Field as="CheckBox" name="isAgree" v-model="form.isAgree" />
          <span>我已同意</span>
          <a href="javascript:;">《隐私条款》</a>
          <span>和</span>
          <a href="javascript:;">《服务条款》</a>
        </div>
        <div v-if="errors.isAgree" class="error">
          <i class="iconfont icon-warning" />{{ errors.isAgree }}
        </div>
      </div>
      <a @click="login" href="javascript:;" class="btn">登录</a>
    </Form>
    <div class="action">
      <!-- 使用qq的文件创建一个btn -->
      <a
        href="https://graph.qq.com/oauth2.0/authorize?client_id=100556005&response_type=token&scope=all&redirect_uri=http%3A%2F%2Ferabbit.roletang.cn%3A8080%2F%23%2Flogin%2Fcallback"
      >
        <img
          src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png"
          alt=""
        />
      </a>
      <!-- <span id="qqLoginBtn"></span> -->
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;">免费注册</a>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch, onUnmounted } from 'vue'
import { Field, Form } from 'vee-validate'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { accountLogin, mobileLogin, codeLogin } from '@/api/user'
// import QC from 'qc'
import message from '@/components/library/Message.js'
import schema from '@/utils/vee-validate-schema'
import { useIntervalFn } from '@vueuse/core'
export default {
  name: 'LoginForm',
  components: { Form, Field },
  setup () {
    const isMsgLogin = ref(true)
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    // 存储登录信息
    const form = reactive({
      // 勾选协议
      isAgree: false,
      account: null,
      mobile: null,
      code: null,
      password: null
    })
    // 规则校验：返回字符串即为错误
    const mySchema = {
      account: schema.account,
      password: schema.password,
      code: schema.code,
      mobile: schema.mobile,
      isAgree: schema.isAgree
    }
    // 切换表单元素，还原数据和清除校验效果
    const formCom = ref(null)
    watch(isMsgLogin, () => {
      // 还原数据
      form.isAgree = true
      form.account = null
      form.password = null
      form.mobile = null
      form.code = null
    })

    const login = async () => {
      const valid = await formCom.value.validate()
      if (valid) {
        // 账号登录和验证码登录分离
        let data = null
        if (isMsgLogin.value) {
          data = await mobileLogin(form.mobile, form.code)
          if (data.code === '1') {
            message({ type: 'success', text: '登陆成功！' })
            // 1.存储用户信息
            const { id, account, avatar, mobile, nickname, token } = data.result
            store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
            // 登陆成功后先合并购物车
            store.dispatch('cart/mergeCart').then(() => {
              // 更新购物车信息
              store.dispatch('cart/updateCart', {})
              // 2.返回来时的页面 或者 首页
              router.push(route.query.redirectUrl || '/')
            })
          } else {
            message({ type: 'error', text: data.message })
          }
        } else {
          const res = await formCom.value.validate()
          // 表单校验成功后
          if (res) {
            accountLogin(form.account, form.password).then(res => {
              data = res
              message({ type: 'success', text: '登陆成功！' })
              // 1.存储用户信息
              const { id, account, avatar, mobile, nickname, token } = data.result
              store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
              // 登陆成功后先合并购物车
              store.dispatch('cart/mergeCart').then(() => {
                // 更新购物车信息
                store.dispatch('cart/updateCart', {})
                // 2.返回来时的页面 或者 首页
                router.push(route.query.redirectUrl || '/')
              })
            }, err => {
              console.dir(err)
              data = err.response.data
              message({ type: 'error', text: data.message })
            })
          }
        }
      }
    }

    const timer = ref(0)
    // 回调 间隔 是否立即开启
    const { pause, resume } = useIntervalFn(() => {
      timer.value--
      if (timer.value <= 0) {
        pause()
      }
    }, 1000, { immediate: false })
    onUnmounted(() => {
      pause()
    })
    const sendCode = async () => {
      // 手动验证手机号格式
      const valid = mySchema.mobile(form.mobile)
      if (valid === true) {
        // 验证成功且需要间隔60秒
        if (timer.value <= 0) {
          try {
            await codeLogin(form.mobile)
            message({ type: 'success', text: '发送成功！' })
            // 成功之后开启定时器
            timer.value = 60
            resume()
          } catch (e) {
            message({ type: 'error', text: '用户不存在！' })
          }
        }
      } else {
        // 不为真时候valid就是错误信息
        formCom.value.setFieldError('mobile', valid)
      }
    }

    return {
      isMsgLogin,
      form,
      mySchema,
      formCom,
      login,
      sendCode,
      timer
    }
  }
}
</script>

<style lang="less" scoped>
// 账号容器
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;
    a {
      color: @xtxColor;
      i {
        font-size: 14px;
      }
    }
  }
  .form {
    padding: 0 40px;
    &-item {
      margin-bottom: 28px;
      .input {
        position: relative;
        height: 36px;
        > i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }
        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;
          &.error {
            border-color: @priceColor;
          }
          &.active,
          &:focus {
            border-color: @xtxColor;
          }
        }
        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }
      > .error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }
    .agree {
      a {
        color: #069;
      }
    }
    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;
      &.disabled {
        background: #cfcdcd;
      }
    }
  }
  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>
