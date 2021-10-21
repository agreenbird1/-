<template>
  <div class="top-category">
    <div class="container"></div>
    <!-- 直接分开的时候会在最后一个breadItem后依然添加一个 箭头 ，使用 render 函数 -->
    <Bread>
      <BreadItem to="/">首页</BreadItem>
      <BreadItem :to="{ path: '/category/1005001' }">电器</BreadItem>
      <BreadItem>冰箱</BreadItem>
    </Bread>
  </div>
</template>

<script>
export default {
  name: 'TopCategory'
}
</script>

<style>
</style>
