<template>
  <div v-show="activeName === name" class="xtx-tabs-panel">
    <slot />
  </div>
</template>
<script>
import { inject } from 'vue'
export default {
  name: 'TabsPanel',
  props: {
    // 模仿element组件的tabs组件
    // 名称
    label: {
      type: String,
      default: ''
    },
    // 唯一标识
    name: {
      type: [String, Number],
      default: ''
    }
  },
  setup () {
    const activeName = inject('activeName')
    return { activeName }
  }
}
</script>
