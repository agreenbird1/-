<template>
  <div class="goods-hot">
    <h3>{{ title }}</h3>
  </div>
  <div v-if="goodsList">
    <GoodsItem v-for="item in goodsList" :key="item.id" :goods="item" />
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { findGoodsHot } from '@/api/product'
import GoodsItem from '@/views/category/components/GoodsItem.vue'
export default {
  name: 'GoodsHot',
  components: {
    GoodsItem
  },
  props: {
    // 热销推荐类型
    type: {
      type: Number,
      default: 1
    }
  },
  setup (props) {
    // 根据不同的type显示不同的标题
    const titles = { 1: '24小时热销榜', 2: '周热销榜', 3: '总热销榜' }
    const goodsList = ref([])
    const route = useRoute()
    const title = computed(() => {
      return titles[props.type]
    })
    findGoodsHot({ id: route.params.id, type: props.type }).then(({ result }) => {
      goodsList.value = result
    })
    return {
      title,
      goodsList
    }
  }
}
</script>

<style scoped lang='less'>
.goods-hot {
  h3 {
    height: 70px;
    background: @helpColor;
    color: #fff;
    font-size: 18px;
    line-height: 70px;
    padding-left: 25px;
    margin-bottom: 10px;
    font-weight: normal;
  }
  :deep(.goods-item) {
    background: #fff;
    width: 100%;
    margin-bottom: 10px;
    img {
      width: 200px;
      height: 200px;
    }
    p {
      margin: 0 10px;
    }
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
}
</style>
