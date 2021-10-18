<template>
  <div class="home-new">
    <div class="container">
      <HomePanel title="新鲜好物" subTitle="新鲜出炉 品质靠谱">
        <!-- 更多部分 -->
        <template #right><More path="/" /></template>
        <transition name="fade">
          <!-- 面板部分 -->
          <ul class="goods-list" v-if="goods.length">
            <li v-for="item in goods" :key="item.id">
              <!-- 跳转链接为 当前产品 id 传值 -->
              <RouterLink :to="`/product/${item.id}`">
                <img :src="item.picture" alt="" />
                <p class="name ellipsis">{{ item.name }}</p>
                <p class="price">&yen;{{ item.price }}</p>
              </RouterLink>
            </li>
          </ul>
          <!-- 贴合 过度面板 -->
          <HomeSkeleton v-else bg="#f0f9f4" />
        </transition>
      </HomePanel>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import HomePanel from './HomePanel.vue'
import HomeSkeleton from './HomeSkeleton.vue'
import { findNew } from '@/api/home'
export default {
  name: 'HomeNew',
  components: { HomePanel, HomeSkeleton },
  setup () {
    const goods = ref([])
    // 获取推荐的数据
    findNew().then(res => {
      goods.value = res.result
    })

    return {
      goods
    }
  }
}
</script>

<style scoped lang='less'>
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;
  li {
    width: 306px;
    height: 406px;
    background: #f0f9f4;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding: 12px 30px 0 30px;
      text-align: center;
    }
    .price {
      color: @priceColor;
    }
  }
}
</style>
