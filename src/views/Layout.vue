<template>
  <!-- 一级路由 -->
  <nav>顶部通栏</nav>
  <header>头部区域</header>
  <div class="main">
    内容区域
    <router-view></router-view>
  </div>
  <footer>底部区域</footer>
</template>

<script>
export default {
  name: 'Layout'
}
</script>

<style>
</style>
