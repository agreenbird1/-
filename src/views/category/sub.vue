<template>
  <!-- 二级面包屑组件区域 -->
  <SubBread />
  <!-- 品牌条件筛选区 -->
  <SubFilter @sort-filter="sortFilter" />
  <!-- 显示具体商品内容 -->
  <div class="goods-list">
    <SubSort @sort-change="sortChange" />
    <!-- 具体商品列表 -->
    <ul>
      <li v-for="goods in goodsList" :key="goods.id">
        <GoodsItem :goods="goods" />
      </li>
    </ul>
    <!-- 无限加载页面 -->
    <InfiniteLoading
      :loading="loading"
      :finished="finished"
      @infinite="getGoodsItems"
    />
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { findSubCategoryGoods } from '@/api/category'
import SubBread from './components/SubBread.vue'
import SubFilter from './components/SubFilter.vue'
import SubSort from './components/SubSort.vue'
import GoodsItem from './components/GoodsItem.vue'
export default {
  name: 'SubCategory',
  components: { SubBread, SubFilter, SubSort, GoodsItem },
  setup () {
    const route = useRoute()

    const checked = ref(false)
    // 控制加载组件
    const loading = ref(false)
    const finished = ref(false)
    const goodsList = ref([])
    // 请求参数
    let params = {
      page: 1,
      pageSize: 20,
      categoryId: route.params.id
    }

    // 获取数据
    const getGoodsItems = () => {
      loading.value = true
      findSubCategoryGoods(params).then(({ result }) => {
        // 有数据的时候加载数据，没有数据的时候完成加载
        if (result.items.length) {
          // 请求数据时候开启加载效果
          goodsList.value.push(...result.items)
          params.page++
        } else {
          // 没有数据则加载完毕
          finished.value = true
        }
        loading.value = false
      })
    }
    // 二级标题改变也需要进行重新加载
    watch(() => route.params.id, (newVal) => {
      // 路由路径和当前相匹配
      if (newVal && `/category/sub/${newVal}` === route.path) {
        // 重置加载完成
        finished.value = false
        // 重置请求参数
        params = {
          page: 1,
          pageSize: 20,
          categoryId: route.params.id
        }
        // 清空当前goodslist
        goodsList.value = []
      }
    })

    // 排序方法改变后需要重新加载数据
    const sortChange = (sortParams) => {
      finished.value = false
      // 重置请求参数
      params = { ...params, ...sortParams, page: 1 }
      // 重置数据列表
      goodsList.value = []
      getGoodsItems()
    }

    // 属性列表改变后也需要
    const sortFilter = (filterParams) => {
      finished.value = false
      // 重置请求参数
      params = { ...params, ...filterParams, page: 1 }
      // 重置数据列表
      goodsList.value = []
    }
    return {
      checked,
      loading,
      finished,
      getGoodsItems,
      goodsList,
      sortChange,
      sortFilter
    }
  }
}
</script>

<style scoped lang='less'>
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    li {
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
