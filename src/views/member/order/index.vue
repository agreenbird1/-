<template>
  <!-- 依然模仿 element tabs 组件，通过activeName传值控制样式的显示 -->
  <Tabs v-model="activeName" @tab-click="changeTab">
    <TabsPanel
      v-for="panel in orderStatus"
      :key="panel.name"
      :name="`${panel.name}`"
      :label="`${panel.label}`"
    ></TabsPanel>
  </Tabs>
  <!-- 订单列表 -->
  <div class="order-list">
    <div v-if="loading" class="loading"></div>
    <div class="none" v-if="!loading && orderList.length === 0">暂无数据</div>
    <OrderItem v-for="(item, index) in orderList" :key="index" :order="item" />
  </div>
  <!-- 分页组件 -->
  <Pagination
    v-if="total > requestParams.pageSize"
    @current-change="requestParams.page = $event"
    :total="total"
    :page-size="requestParams.pageSize"
    :current-page="requestParams.page"
  />
</template>

<script>
import { ref, reactive, watch } from 'vue'
import OrderItem from './components/OrderItem.vue'
import { orderStatus } from '@/api/constance'
import { findOrderList } from '@/api/order'
// import MemberOrderDetail from './Detail.vue'
export default {
  name: 'MemberOrder',
  components: { OrderItem },
  setup () {
    const activeName = ref('first')
    // 查询订单参数
    const requestParams = reactive({
      page: 1,
      pageSize: 5,
      orderState: 0
    })
    // 控制加载中
    const loading = ref(false)
    // 选项卡触发切换
    const changeTab = (tab) => {
      // 此时：tab.index 就是订单的状态
      requestParams.orderState = tab.index
      requestParams.page = 1
    }
    // 筛选条件变化时候重新请求数据
    watch(requestParams, () => {
      loading.value = true
      findOrderList(requestParams).then(data => {
        orderList.value = data.result.items
        loading.value = false
      })
    }, { immediate: true })
    // 订单列表
    const orderList = ref([])
    const total = ref(0)
    // 查询订单
    findOrderList(requestParams).then(data => {
      orderList.value = data.result.items
      total.value = data.result.counts
    })
    return {
      activeName,
      orderList,
      changeTab,
      orderStatus,
      loading,
      total,
      requestParams
    }
  }
}
</script>

<style scoped lang='less'>
.order-list {
  background: #fff;
  padding: 20px;
  position: relative;
  min-height: 400px;
}
.loading {
  height: 100%;
  width: 100%;
  min-height: 400px;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, 0.9) url("/assets/images/load.gif") no-repeat
    center;
}
.none {
  height: 400px;
  text-align: center;
  line-height: 400px;
  color: #999;
}
</style>
