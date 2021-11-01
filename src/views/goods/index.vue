<template>
  <div class="xtx-goods-page">
    <div class="container">
      <!-- 面包屑 -->
      <Bread>
        <BreadItem to="/">首页</BreadItem>
        <BreadItem :to="`/category/${product?.categories[1].id}`">{{
          product?.categories[1].name
        }}</BreadItem>
        <BreadItem :to="`/category/sub/${product?.categories[1].id}`">{{
          product?.categories[0].name
        }}</BreadItem>
        <BreadItem>{{ product?.name }}</BreadItem>
      </Bread>
      <!-- 商品信息 -->
      <div class="goods-info">
        <div class="media">
          <GoodsImage :images="product?.mainPictures" />
          <GoodsSales />
        </div>
        <div class="spec">
          <GoodsName :goods="product"></GoodsName>
          <GoodsSku v-if="product" :goods="product" />
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <div class="goods-tabs"></div>
          <!-- 注意事项 -->
          <div class="goods-warn"></div>
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { nextTick, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { findProduct } from '@/api/product'
import GoodsRelevant from './components/GoodsRelevant'
import GoodsImage from './components/GoodsImage'
import GoodsSales from './components/GoodsSales.vue'
import GoodsName from './components/GoodsName.vue'
import GoodsSku from './components/GoodsSku.vue'
export default {
  name: 'XtxGoodsPage',
  components: { GoodsRelevant, GoodsImage, GoodsSales, GoodsName, GoodsSku },
  setup () {
    const product = ref(null)
    const route = useRoute()

    // 分开一个函数，获取数据
    const getProduct = () => {
      findProduct(route.params.id).then(res => {
        // 设置为空，组件就可以被销毁，再次赋值，即可加载
        product.value = null
        nextTick(() => {
          product.value = res.result
        })
      })
    }

    // 监视 id 动态获取数据，因为切换路由不会使页面重新渲染，无法获取新的数据
    watch(() => route.params.id, (newVal) => {
      // 存在且处于商品详情下才请求，路由匹配
      if (newVal && `/product/${newVal}` === route.path) {
        getProduct()
      }
    })

    // 挂载完成后请求加载数据
    onMounted(() => {
      getProduct()
    })
    return {
      product
    }
  }
}
</script>

<style scoped lang='less'>
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}

.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}
.goods-tabs {
  min-height: 600px;
  background: #fff;
}
.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
</style>
