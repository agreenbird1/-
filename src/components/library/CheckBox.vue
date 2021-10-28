<template>
  <div class="xtx-checkbox" @click="checked = !checked">
    <i v-if="checked" class="iconfont icon-checked"></i>
    <i v-else class="iconfont icon-unchecked"></i>
    <!-- slot 插槽获取传递的文字内容 -->
    <span><slot /></span>
  </div>
</template>
<script>
import { useVModel } from '@vueuse/core'
export default {
  name: 'CheckBox',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  // 实现 v-model 的双向数据绑定流程
  // 使用 vueuse库实现
  setup (props, { emit }) {
    // 用于控制点击切换效果
    // 这个复选框是通过两个图标的显示切换进行控制
    // useVModel 三个参数
    const checked = useVModel(props, 'modelValue', emit)
    return { checked }
  }
}
</script>
<style scoped lang="less">
.xtx-checkbox {
  display: inline-block;
  margin-right: 2px;
  .icon-checked {
    color: @xtxColor;
    ~ span {
      color: @xtxColor;
    }
  }
  i {
    position: relative;
    top: 1px;
  }
  span {
    margin-left: 2px;
  }
}
</style>
