<template>
  <!-- 二级面包屑组件区域 -->
  <SubBread />
  <!-- 品牌条件筛选区 -->
  <SubFilter />
</template>

<script>
import SubBread from './components/SubBread.vue'
import SubFilter from './components/SubFilter.vue'
export default {
  name: 'SubCategory',
  components: { SubBread, SubFilter }
}
</script>

<style>
</style>
