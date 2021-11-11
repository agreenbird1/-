<template>
  <div class="xtx-confirm" v-if="visible">
    <div class="wrapper">
      <div class="header">
        <h3>{{ title }}</h3>
        <a
          href="JavaScript:;"
          class="iconfont icon-close-new"
          @click="visible = false"
        ></a>
      </div>
      <div class="body">
        <i class="iconfont icon-warning"></i>
        <span>{{ text }}</span>
      </div>
      <div class="footer">
        <MyButton size="mini" type="gray" @click="cancel">取消</MyButton>
        <MyButton size="mini" type="primary" @click="confirm">确认</MyButton>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, onMounted } from 'vue'
import MyButton from './MyButton'
export default {
  name: 'Confirm',
  components: { MyButton },
  props: {
    title: {
      type: String,
      default: '温馨提示'
    },
    text: {
      type: String,
      default: ''
    },
    pcancel: {
      type: Function
    },
    pconfirm: {
      type: Function
    }
  },
  setup (props) {
    // 控制显示以及隐藏
    const visible = ref(false)
    onMounted(() => {
      visible.value = true
    })
    // 取消
    const cancel = () => {
      props.pcancel()
    }
    // 确认
    const confirm = () => {
      props.pconfirm()
    }
    return {
      visible,
      cancel,
      confirm
    }
  }
}
</script>
<style scoped lang="less">
.xtx-confirm {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 8888;
  background: rgba(0, 0, 0, 0.5);
  .wrapper {
    width: 400px;
    background: #fff;
    border-radius: 4px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .header,
    .footer {
      height: 50px;
      line-height: 50px;
      padding: 0 20px;
    }
    .body {
      padding: 20px 40px;
      font-size: 16px;
      .icon-warning {
        color: @priceColor;
        margin-right: 3px;
        font-size: 16px;
      }
    }
    .footer {
      text-align: right;
      .xtx-button {
        margin-left: 20px;
      }
    }
    .header {
      position: relative;
      h3 {
        font-weight: normal;
        font-size: 18px;
      }
      a {
        position: absolute;
        right: 15px;
        top: 15px;
        font-size: 20px;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        color: #999;
        &:hover {
          color: #666;
        }
      }
    }
  }
}
</style>
