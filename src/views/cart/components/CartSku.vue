<template>
  <div class="cart-sku" ref="target">
    <div class="attrs" @click="toggle()">
      <span class="ellipsis">{{ attrsText }}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="layer" v-if="visible">
      <!-- goods 数据未返回就显示加载，否则显示数据 -->
      <div v-if="!goods" class="loading"></div>
      <GoodsSku @change="changeSku" v-else :skuId="skuId" :goods="goods" />
      <MyButton
        v-if="goods"
        @click="submit"
        type="primary"
        size="mini"
        style="margin-left: 60px"
        >确认</MyButton
      >
    </div>
  </div>
</template>
<script>
import { ref, reactive } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { getSpecsAndSkus } from '@/api/cart'
import message from '@/components/library/Message'
import GoodsSku from '@/views/goods/components/GoodsSku.vue'
export default {
  name: 'CartSku',
  components: { GoodsSku },
  props: {
    attrsText: {
      type: String,
      default: ''
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    const visible = ref(false)
    const goods = ref(null)
    const show = () => {
      visible.value = true
      // 获取当前spec和sku数据
      getSpecsAndSkus(props.skuId).then(data => {
        goods.value = data.result
      })
    }
    const hide = () => {
      visible.value = false
    }
    // 切换打开与关闭
    const toggle = () => {
      visible.value ? hide() : show()
    }
    const target = ref(null)
    onClickOutside(target, () => {
      hide()
      goods.value = null
    })

    let currSku = reactive(null)
    // 点击 sku 组件时候向外传值的接收
    const changeSku = (sku) => {
      currSku = sku
    }

    // 点击确定的时候
    const submit = () => {
      if (currSku && currSku.skuId && currSku.skuId !== props.skuId) {
        emit('change', currSku)
      } else {
        console.log(currSku)
        message({ type: 'warn', text: '不是有效的规格！' })
      }
      close()
    }
    return { visible, toggle, target, goods, changeSku, submit }
  }
}
</script>
<style scoped lang="less">
.cart-sku {
  height: 28px;
  border: 1px solid #f5f5f5;
  padding: 0 6px;
  position: relative;
  margin-top: 10px;
  display: inline-block;
  .attrs {
    line-height: 24px;
    display: flex;
    span {
      max-width: 230px;
      font-size: 14px;
      color: #999;
    }
    i {
      margin-left: 5px;
      font-size: 14px;
    }
  }
  .layer {
    position: absolute;
    left: -1px;
    top: 40px;
    z-index: 10;
    width: 400px;
    border: 1px solid @xtxColor;
    box-shadow: 2px 2px 4px lighten(@xtxColor, 50%);
    background: #fff;
    border-radius: 4px;
    font-size: 14px;
    padding: 20px;
    &::before {
      content: "";
      width: 12px;
      height: 12px;
      border-left: 1px solid @xtxColor;
      border-top: 1px solid @xtxColor;
      position: absolute;
      left: 12px;
      top: -8px;
      background: #fff;
      transform: scale(0.8, 1) rotate(45deg);
    }
    .loading {
      height: 224px;
      background: url(../../../assets/images/load.gif) no-repeat center;
    }
  }
}
</style>
