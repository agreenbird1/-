<template>
  <Form
    ref="formCom"
    :validation-schema="mySchema"
    v-slot="{ errors }"
    class="xtx-form"
  >
    <div class="user-info">
      <img :src="avatar" alt="" />
      <p>Hi，{{ nickname }} 欢迎来小兔鲜，完成绑定后可以QQ账号一键登录哦~</p>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field
          name="mobile"
          v-model="form.mobile"
          class="input"
          :class="{ err: errors.mobile }"
          type="text"
          placeholder="绑定的手机号"
        />
      </div>
      <div class="error" v-if="errors.mobile">{{ errors.mobile }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field
          v-model="form.code"
          name="code"
          class="input"
          :class="{ err: errors.code }"
          type="text"
          placeholder="短信验证码"
        />
        <span class="code" @click="sendCode">
          {{ timer === 0 ? "发送验证码" : `${timer}秒后发送` }}
        </span>
      </div>
      <div class="error" v-if="errors.code">{{ errors.code }}</div>
    </div>
    <a href="javascript:;" class="submit" @click="bind">立即绑定</a>
  </Form>
</template>

<script>
import { ref, reactive, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { Form, Field } from 'vee-validate'
import QC from 'qc'
import { useIntervalFn } from '@vueuse/core'
import { qqBindCode, userQQBindLogin } from '@/api/user'
import message from '@/components/library/Message'
import schema from '@/utils/vee-validate-schema'
export default {
  name: 'CallbackBind',
  components: { Form, Field },
  props: {
    unionId: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    // 准备的数据需要 unionId 和 展示信息需要的头像和昵称
    const nickname = ref('')
    const avatar = ref('')
    const formCom = ref(null)
    const store = useStore()
    const router = useRouter()
    if (QC.Login.check()) {
      QC.api('get_user_info').success(res => {
        avatar.value = res.data.figureurl_1
        nickname.value = res.data.nickname
      })
    }

    // 数据对象
    const form = reactive({
      mobile: '',
      code: ''
    })
    // 规则对象
    const mySchema = {
      mobile: schema.mobile,
      code: schema.code
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
      try { // 手动验证手机号格式
        const valid = mySchema.mobile(form.mobile)
        if (valid === true) {
          // 验证成功且需要间隔60秒
          if (timer.value <= 0) {
            await qqBindCode(form.mobile)
            message({ type: 'success', text: '发送成功！' })
            // 成功之后开启定时器
            timer.value = 60
            resume()
          }
        } else {
          // 不为真时候valid就是错误信息
          formCom.value.setFieldError('mobile', valid)
        }
      } catch (e) {
        message({ type: 'error', text: e.response.data.message || '发送失败！' })
      }
    }
    const bind = () => {
      const valid = formCom.value.validate()
      // 先进行表单规则校验
      if (valid) {
        userQQBindLogin(props.unionId, form.mobile, form.code).then(data => {
          const { id, account, avatar, mobile, nickname, token } = data.result
          store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
          // 登陆成功后先合并购物车
          store.dispatch('cart/mergeCart').then(() => {
            // 2.返回来时的页面 或者 首页
            router.push(store.state.user.redirectUrl)
          })
        }).catch(e => {
          console.dir(e)
          message({ type: 'error', text: e.response.data.message })
        })
      }
    }
    return {
      nickname,
      avatar,
      mySchema,
      form,
      formCom,
      sendCode,
      timer,
      bind
    }
  }
}
</script>

<style scoped lang='less'>
.user-info {
  width: 320px;
  height: 70px;
  margin: 0 auto;
  display: flex;
  background: #f2f2f2;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 25px;
  img {
    background: #f2f2f2;
    width: 50px;
    height: 50px;
  }
  p {
    padding-left: 10px;
  }
}
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
