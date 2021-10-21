<template>
  <div class="xtx-bread-item">
    <RouterLink v-if="to" :to="to"><slot /></RouterLink>
    <span v-else><slot /></span>
  </div>
</template>

<script>
export default {
  // 模仿饿了么面包屑组件
  name: 'BreadItem',
  props: {
    to: {
      type: [String, Object],
      default: ''
    }
  }
}
</script>
