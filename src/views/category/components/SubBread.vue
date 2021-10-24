<template>
  <Bread>
    <BreadItem to="/">首页</BreadItem>
    <BreadItem v-if="category.top" :to="`/category/${category.top.id}`">{{
      category.top.name
    }}</BreadItem>
    <BreadItem to="/" v-if="category.sub">{{ category.sub.name }}</BreadItem>
  </Bread>
</template>
<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
export default {
  name: 'SubBread',
  setup () {
    const store = useStore()
    const route = useRoute()
    // 因为有一级和二级，所以需要期望的数据格式为
    // { top:{ id,name },sub:{ id,name } }

    // ********
    // 此处 消磨 太久，因为之前路由时候 id 值传错导致！

    const category = computed(() => {
      const cate = {}
      store.state.category.list.forEach(top => {
        if (top.children) {
          const sub = top.children.find(sub => {
            return sub.id === route.params.id
          })
          if (sub) {
            cate.top = { id: top.id, name: top.name }
            cate.sub = { id: sub.id, name: sub.name }
          }
        }
      })
      return cate
    })
    return { category }
  }
}
</script>

<style scoped lang="less"></style>
