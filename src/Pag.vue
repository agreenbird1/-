<template>
  <div class="pagination">
    <button @click="pageTurning(-1)">上一页</button>

    <button :class="{ active: pageNo === 1 }" @click="changePage(1)">1</button>

    <button v-show="start > 2">···</button>
    <button
      :class="{ active: pageNo === btn }"
      v-for="btn in btnArr"
      :key="btn"
      @click="changePage(btn)"
    >
      {{ btn }}
    </button>

    <button v-show="end < pageCount - 1">···</button>
    <button v-show="pageCount !== 1" :class="{ active: pageNo === pageCount }">
      {{ pageCount }}
    </button>
    <button @click="pageTurning(1)">下一页</button>
    <span
      ><em
        >共 <b>{{ total }}</b> 条，<b>{{ pageCount }}</b> 页，到第</em
      >
      <input type="text" v-model="page" />
      页
    </span>
    <button @click="changePage(page)">确定</button>
  </div>
</template>

<script>
export default {
  name: 'Pag',
  data () {
    return {
      page: null
    }
  },
  props: ['pageNo', 'total', 'continues', 'pageSize'],
  computed: {
    pageCount () {
      const { total, pageSize } = this
      return Math.ceil(total / pageSize)
    },
    start () {
      const { continues, pageNo, pageCount } = this
      let start = pageNo - Math.floor(continues / 2)
      pageCount - pageNo < Math.floor(continues / 2) && (start = pageCount - continues)
      // 因为预留了 第一页 所以 start 不能为 1
      start < 2 && (start = 2)
      return start
    },
    end () {
      const { continues, start, pageCount } = this
      let end = start + continues - 1
      end >= pageCount && (end = pageCount - 1)
      return end
    },
    btnArr () {
      const { end, start } = this
      // 而当只有一页数据 后续渲染只会有预留的第一页
      const btnArr = []
      for (let index = 0; index < end - start + 1; index++) {
        btnArr[index] = start + index
      }
      return btnArr
    }
  },
  methods: {
    pageTurning (turning) {
      this.$emit('pageTurning', turning)
    },
    changePage (pageNo) {
      if (pageNo > 0 && pageNo <= this.pageCount) {
        this.$emit('changePage', pageNo)
      }
    }
  }
}
</script>

<style>
.active {
  color: red;
}
</style>
