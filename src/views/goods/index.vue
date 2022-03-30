<template>
  <div class="xtx-goods-page" v-if="product">
    <div class="container">
      <!-- 面包屑 -->
      <Bread>
        <BreadItem to="/">首页</BreadItem>
        <BreadItem :to="`/category/${product?.categories[0].id}`">{{
          product?.categories[1].name
        }}</BreadItem>
        <BreadItem :to="`/category/sub/${product?.categories[0].id}`">{{
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
          <GoodsSku @change="getGood" :goods="product" />
          <Numbox
            v-model="count"
            :numCon="numCon"
            label="数量"
            :maxValue="product.inventory"
          />
          <MyButton
            @click="insertCart"
            type="primary"
            size="middle"
            style="margin-top: 20px"
            >加入购物车</MyButton
          >
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant :goodsId="product.id" />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <GoodsTabs />
          <!-- 注意事项 -->
          <div class="goods-warn">
            <GoodsWarn />
          </div>
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside">
          <GoodsHot />
          <GoodsHot :type="2" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { nextTick, provide, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { findProduct } from '@/api/product'
import message from '@/components/library/Message'
import GoodsRelevant from './components/GoodsRelevant'
import GoodsImage from './components/GoodsImage'
import GoodsSales from './components/GoodsSales.vue'
import GoodsName from './components/GoodsName.vue'
import GoodsSku from './components/GoodsSku.vue'
import GoodsTabs from './components/GoodsTabs.vue'
import GoodsHot from './components/GoodsHot.vue'
import GoodsWarn from './components/GoodsWarn.vue'
// 分开一个函数，获取数据
const getProduct = () => {
  const product = ref(null)
  const route = useRoute()
  // 监视 id 动态获取数据，因为切换路由不会使页面重新渲染，无法获取新的数据
  watch(() => route.params.id, (newVal) => {
    // 存在且处于商品详情下才请求，路由匹配
    if (newVal && `/product/${newVal}` === route.path) {
      findProduct(route.params.id).then(res => {
        // 设置为空，组件就可以被销毁，再次赋值，即可加载
        product.value = null
        nextTick(() => {
          product.value = res.result
        })
      })
    }
  }, { immediate: true })
  return product
}
export default {
  name: 'GoodsPage',
  components: {
    GoodsRelevant,
    GoodsImage,
    GoodsSales,
    GoodsName,
    GoodsSku,
    GoodsTabs,
    GoodsHot,
    GoodsWarn
  },
  setup () {
    const product = getProduct()
    // 选择的数量
    const count = ref(1)
    // 控制数量是否可点
    const numCon = ref(false)
    const getGood = (selectedGood) => {
      // 修改当前选中的商品的价格
      if (selectedGood.skuId) {
        numCon.value = true
        product.value.price = selectedGood.price
        product.value.oldPrice = selectedGood.oldPrice
        product.value.inventory = selectedGood.inventory
        // 当前商品
        currSku.value = selectedGood
      } else {
        numCon.value = false
        // 不可点时候置1
        count.value = 1
        currSku.value = null
      }
    }
    // 提供 product 数据给所有子组件使用
    provide('goods', product)

    // 标识当前商品
    const currSku = ref(null)
    const store = useStore()
    // 加入购物车
    const insertCart = () => {
      if (!currSku.value) {
        return message({ type: 'warn', text: '请选择商品规格' })
      }
      store.dispatch('cart/insertCart', {
        // 传递约定好的数据
        id: product.value.id,
        skuId: currSku.value.skuId,
        name: product.value.name,
        picture: product.value.mainPictures[0],
        price: currSku.value.price,
        nowPrice: currSku.value.price,
        count: count.value,
        attrsText: currSku.value.specsText,
        selected: true,
        isEffective: true,
        stock: currSku.value.inventory
      }).then(() => {
        message({ type: 'success', text: '加入购物车成功！' })
      })
    }
    return {
      product,
      getGood,
      count,
      numCon,
      insertCart
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
