<template>
  <Bread>
    <BreadItem to="/">首页</BreadItem>
    <BreadItem v-if="category.top" :to="`/category/${category.top.id}`"
      >{{ category.top.name }}
    </BreadItem>
    <BreadItem v-if="category.sub" :to="`/category/${category.sub.id}`">{{
      category.sub.name
    }}</BreadItem>
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
      const obj = {}
      store.state.category.list.forEach(top => {
        console.log(top)
        top.children && top.children.forEach(sub => {
          if (sub.id === route.params.id) {
            // 设置二级类目
            obj.sub = { id: sub.id, name: sub.name }
            // 设置一级类目
            obj.top = { id: top.id, name: top.name }
          }
        })
      })
      return obj
    })
    return { category }
  }
}
</script>

<style scoped lang="less"></style>
