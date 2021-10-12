<template>
  App
  <div class="con"></div>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'App',
  setup () {
    return {
    }
  }
}
</script>

<style lang="less">
.con {
  width: 200px;
  height: 100px;
  background-color: @helpColor;
  .hoverShadow();
}
</style>
