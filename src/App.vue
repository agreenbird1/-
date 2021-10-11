<template>
  <div></div>
</template>

<script>
import { useStore } from 'vuex'
export default {
  name: 'App',
  setup () {
    const store = useStore()
    return {
      store
    }
  }
}
</script>

<style lang="less">
</style>
