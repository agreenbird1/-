<template>
  <HomeView />
  <HomePanel title="我的收藏">
    <GoodsItem
      v-for="collectGood in collectGoods"
      :key="collectGood.id"
      :goods="collectGood"
  /></HomePanel>
  <HomePanel title="我的足迹"
    ><GoodsItem v-for="i in 4" :key="i" :goods="goods" />
  </HomePanel>
  <GoodsRelevant />
</template>

<script>
import { ref } from 'vue'
import { findCollect } from '@/api/member'
import HomeView from './components/HomeView.vue'
import HomePanel from './components/HomePanel.vue'
import GoodsRelevant from '@/views/goods/components/GoodsRelevant.vue'
import GoodsItem from '@/views/category/components/GoodsItem.vue'
export default {
  name: 'MemberHome',
  components: { HomeView, HomePanel, GoodsRelevant, GoodsItem },
  setup () {
    const goods = {
      id: '1',
      name: '自煮火锅不排队 麦饭石不粘鸳鸯火锅',
      picture: 'https://yanxuan-item.nosdn.127.net/fcdcb840a0f5dd754bb8fd2157579012.jpg',
      desc: '清汤鲜香 红汤劲爽',
      price: '159.00'
    }
    const collectGoods = ref(null)
    findCollect({ pageSize: 4 }).then(data => {
      collectGoods.value = data.result.items
    })
    return { goods, collectGoods }
  }
}
</script>

<style scoped lang='less'>
:deep(.xtx-carousel) .carousel-btn.prev {
  left: 5px;
}
:deep(.xtx-carousel) .carousel-btn.next {
  right: 5px;
}
</style>
