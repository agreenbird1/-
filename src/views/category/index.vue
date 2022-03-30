<template>
  <div class="top-category">
    <div class="container">
      <!-- 面包屑 -->
      <Bread>
        <BreadItem to="/">首页</BreadItem>
        <BreadItem v-if="category">{{ category.name }}</BreadItem>
      </Bread>
      <!-- 轮播图 -->
      <Carousel :sliders="sliders" autoPlay style="height: 500px" />
      <!-- 所有二级分类 -->
      <div class="sub-list" v-if="category && category.children">
        <h3>全部分类</h3>
        <ul>
          <li v-for="item in category.children" :key="item.id">
            <a href="javascript:;">
              <img :src="item.picture" />
              <p>{{ item.name }}</p>
            </a>
          </li>
        </ul>
      </div>
      <!-- 不同分类商品类目下的详细商品 -->
      <!-- 分类关联商品 -->
      <div class="ref-goods" v-for="sub in subCategory" :key="sub.id">
        <div class="head">
          <h3>- {{ sub.name }} -</h3>
          <p class="tag">温暖柔软，品质之选</p>
          <More :path="`/category/sub/${sub.id}`" />
        </div>
        <div class="body">
          <!-- 将具体的商品传入 -->
          <GoodsItem
            v-for="goods in sub.goods"
            :goods="goods"
            :key="goods.id"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { findBanner } from '@/api/home'
import GoodsItem from './components/GoodsItem.vue'
import { findTopCategories } from '@/api/category'
export default {
  name: 'TopCategory',
  components: { GoodsItem },
  setup () {
    // 轮播图可以直接进行  findBanner 进行查找
    const sliders = ref([])
    findBanner().then(data => {
      sliders.value = data.result
    })
    const store = useStore()
    const route = useRoute()
    // 顶部其余分类可以通过顶级分类的 id 用来查找数据
    const category = computed(() => {
      return store.state.category.list.find(cate => route.params.id === cate.id)
    })

    const subCategory = ref([])
    // 动态路由并不会触发变化
    // 通过当前的 id 参数查找顶级类，但是若是直接查找，在进行topcategory切换时候并不会进行重新请求数据
    // 通过watch进行监视 id 的变化
    const getSubCategories = () => {
      findTopCategories(route.params.id).then(data => {
        subCategory.value = data.result.children
      })
    }

    // 进入时候就需要进行监听，是从无到有的监听
    watch(
      () => route.params.id,
      newVal => {
        // newVal && getSubCategories() // 一级类目到二级类目也会发生请求
        // console.log(topCategory.find((elem) => elem.id === route.params.id))
        // 新 id 存在 且存在于顶级类目中才发送请求
        newVal &&
          store.state.category.list.find(elem => elem.id === newVal) &&
          getSubCategories()
      },
      { immediate: true }
    )
    return {
      sliders,
      category,
      subCategory
    }
  }
}
</script>

<style scoped lang="less">
.top-category {
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }
  .sub-list {
    margin-top: 20px;
    background-color: #fff;
    ul {
      display: flex;
      padding: 0 32px;
      flex-wrap: wrap;
      li {
        width: 168px;
        height: 160px;
        a {
          text-align: center;
          display: block;
          font-size: 16px;
          img {
            width: 100px;
            height: 100px;
          }
          p {
            line-height: 40px;
          }
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
}
.ref-goods {
  background-color: #fff;
  margin-top: 20px;
  position: relative;
  .head {
    .xtx-more {
      position: absolute;
      top: 20px;
      right: 20px;
    }
    .tag {
      text-align: center;
      color: #999;
      font-size: 20px;
      position: relative;
      top: -20px;
    }
  }
  .body {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 0 65px 30px;
  }
}
</style>
