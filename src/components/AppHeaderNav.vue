<template>
  <!-- 单独抽离头部导航区一块作为u单独的组件，二次使用 -->
  <ul class="app-header-nav">
    <li class="home">
      <RouterLink to="/">首页</RouterLink>
    </li>
    <!-- 遍历数据,一级导航 -->
    <li
      v-for="item in list"
      :key="item.id"
      @mousemove="show(item.id)"
      @mouseleave="hide(item.id)"
    >
      <router-link @click="hide(item.id)" :to="`/category/${item.id}`">{{
        item.name
      }}</router-link>
      <!-- 二级弹出层  :class="{ open: item.open }"-->
      <div class="layer" :class="[item.open ? 'open' : '']">
        <ul>
          <!-- 二级导航 -->
          <li v-for="subItem in item.children" :key="subItem.id">
            <router-link :to="`/category/sub/${subItem.id}`">
              <img :src="subItem.picture" alt="" />
              <p>{{ subItem.name }}</p>
            </router-link>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
export default {
  name: 'AppHeaderNav',
  setup () {
    const store = useStore()
    const list = computed(() => {
      return store.state.category.list
    })
    // 控制显示以及隐藏
    const show = (id) => {
      store.commit('category/show', id)
    }
    const hide = (id) => {
      store.commit('category/hide', id)
    }
    return {
      list,
      show,
      hide
    }
  }
}
</script>

<style scoped lang="less">
.app-header-nav {
  position: relative;
  width: 820px;
  display: flex;
  justify-content: space-around;
  padding-left: 40px;
  > li {
    margin-right: 40px;
    width: 38px;
    text-align: center;
    > a {
      font-size: 16px;
      line-height: 32px;
      height: 32px;
      display: inline-block;
    }
    &:hover {
      > a {
        color: @xtxColor;
        border-bottom: 1px solid @xtxColor;
      }
    }
  }
  // .open {
  //   height: 132px;
  //   opacity: 1;
  // }
  .layer {
    // 二级类目的添加类名
    &.open {
      height: 132px;
      opacity: 1;
    }
    z-index: 100;
    width: 1240px;
    background-color: #fff;
    position: absolute;
    left: -200px;
    top: 56px;
    height: 0;
    overflow: hidden;
    opacity: 0;
    box-shadow: 0 0 5px #ccc;
    transition: all 0.2s 0.1s;
    ul {
      display: flex;
      flex-wrap: wrap;
      padding: 0 70px;
      align-items: center;
      height: 132px;
      li {
        width: 110px;
        text-align: center;
        img {
          width: 60px;
          height: 60px;
        }
        p {
          padding-top: 10px;
        }
        &:hover {
          p {
            color: @xtxColor;
          }
        }
      }
    }
  }
}
</style>
