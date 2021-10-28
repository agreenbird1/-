<template>
  <div class="xtx-infinite-loading" ref="target">
    <div class="loading" v-if="loading">
      <span class="img"></span>
      <span class="text">正在加载...</span>
    </div>
    <div class="none" v-if="finished">
      <span class="img"></span>
      <span class="text">亲，没有更多了</span>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
export default {
  name: 'InfiniteLoading',
  props: {
    // 是否加载中，是否加载完毕
    // 且由父组件进行控制
    loading: {
      type: Boolean,
      default: false
    },
    finished: {
      type: Boolean,
      default: false
    }
  },
  setup (props, { emit }) {
    // 当页面滚到到可视区进行数据的请求
    const target = ref(null)
    // 使用 vueuse
    useIntersectionObserver(target, ([{ isIntersecting }]) => {
      console.log('进入可视区啦')
      // 进入可视区后
      if (isIntersecting) {
        // 没有加载完且当前没有加载中
        if (!props.loading && !props.finished) {
          // 触发事件，事件是绑定到本组件自己身上的，是属于自己的事件
          emit('infinite')
        }
      }
    }, { threshold: 0 })
    return {
      target
    }
  }
}
</script>

<style scoped lang='less'>
.xtx-infinite-loading {
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    .img {
      width: 50px;
      height: 50px;
      background: url(../../assets/images/load.gif) no-repeat center / contain;
    }
    .text {
      color: #999;
      font-size: 16px;
    }
  }
  .none {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    .img {
      width: 200px;
      height: 134px;
      background: url(../../assets/images/none.png) no-repeat center / contain;
    }
    .text {
      color: #999;
      font-size: 16px;
    }
  }
}
</style>
