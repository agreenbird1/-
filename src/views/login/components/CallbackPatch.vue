<template>
  <Form
    ref="formCom"
    :validation-schema="mySchema"
    v-slot="{ errors }"
    class="xtx-form"
  >
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-user"></i>
        <Field
          name="account"
          :class="{ err: errors.account }"
          v-model="form.account"
          class="input"
          type="text"
          placeholder="请输入用户名"
        />
      </div>
      <div class="error" v-if="errors.account">{{ errors.account }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field
          name="mobile"
          :class="{ err: errors.mobile }"
          v-model="form.mobile"
          class="input"
          type="text"
          placeholder="请输入手机号"
        />
      </div>
      <div class="error" v-if="errors.mobile">{{ errors.mobile }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field
          name="code"
          :class="{ err: errors.code }"
          v-model="form.code"
          class="input"
          type="text"
          placeholder="请输入验证码"
        />
        <span class="code" @click="sendCode">{{
          timer === 0 ? "发送验证码" : `${timer}秒后发送`
        }}</span>
      </div>
      <div class="error" v-if="errors.code">{{ errors.code }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field
          name="password"
          :class="{ err: errors.password }"
          v-model="form.password"
          class="input"
          type="password"
          placeholder="请输入密码"
        />
      </div>
      <div class="error" v-if="errors.password">{{ errors.password }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field
          name="rePassword"
          :class="{ err: errors.rePassword }"
          v-model="form.rePassword"
          class="input"
          type="password"
          placeholder="请确认密码"
        />
      </div>
      <div class="error" v-if="errors.rePassword">{{ errors.rePassword }}</div>
    </div>
    <a href="javascript:;" class="submit" @click="patch">立即提交</a>
  </Form>
</template>

<script>
import { ref, onUnmounted } from 'vue'
import { Form, Field } from 'vee-validate'
import { useIntervalFn } from '@vueuse/core'
import { patchLogin, userQQPatchLogin } from '@/api/user'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import message from '@/components/library/Message.js'
import schema from '@/utils/vee-validate-schema'
export default {
  name: 'CallbackPatch',
  components: { Form, Field },
  props: {
    unionId: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    const store = useStore()
    const router = useRouter()
    const formCom = ref(null)
    // 信息
    const form = {
      account: null,
      mobile: null,
      code: null,
      password: null,
      rePassword: null
    }
    // 校验规则
    const mySchema = {
      account: schema.accountApi,
      mobile: schema.mobile,
      code: schema.code,
      password: schema.password,
      rePassword: schema.rePassword
    }
    // 验证码
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
          await patchLogin(form.mobile)
          message({ type: 'success', text: '发送成功！' })
          // 成功之后开启定时器
          timer.value = 60
          resume()
        }
      } else {
        // 不为真时候valid就是错误信息
        formCom.value.setFieldError('mobile', valid)
      }
    }
    const patch = () => {
      const valid = formCom.value.validate()
      // 先进行表单规则校验
      if (valid) {
        userQQPatchLogin(props.unionId, form.mobile, form.code, form.account, form.password).then(data => {
          const { id, account, avatar, mobile, nickname, token } = data.result
          store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
          // 登陆成功后先合并购物车
          store.dispatch('cart/mergeCart').then(() => {
            // 2.返回来时的页面 或者 首页
            router.push(store.state.user.redirectUrl)
          })
        }).catch(e => {
          message({ type: 'error', text: e.response.data.message })
        })
      }
    }
    return {
      form,
      mySchema,
      sendCode,
      timer,
      formCom,
      patch
    }
  }
}
</script>

<style scoped lang='less'>
.code {
  position: absolute;
  right: 0;
  top: 0;
  line-height: 50px;
  width: 80px;
  color: #999;
  &:hover {
    cursor: pointer;
  }
}
</style>
