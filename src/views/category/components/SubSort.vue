<template>
  <div class="sub-sort">
    <div class="sort">
      <!-- 为空时候默认选择 -->
      <a
        :class="{ active: sortParams.sortField === null }"
        href="javascript:;"
        @click="changeSort(null)"
        >默认排序</a
      >
      <a
        :class="{ active: sortParams.sortField === 'publishTime' }"
        href="javascript:;"
        @click="changeSort('publishTime')"
        >最新商品</a
      >
      <a
        :class="{ active: sortParams.sortField === 'orderNum' }"
        href="javascript:;"
        @click="changeSort('orderNum')"
        >最高人气</a
      >
      <a
        :class="{ active: sortParams.sortField === 'evaluateNum' }"
        href="javascript:;"
        @click="changeSort('evaluateNum')"
        >评论最多</a
      >
      <a href="javascript:;" @click="changeSort('price')">
        价格排序
        <i
          class="arrow up"
          :class="{
            active:
              sortParams.sortField === 'price' &&
              sortParams.sortMethod === 'desc',
          }"
        />
        <i
          class="arrow down"
          :class="{
            active:
              sortParams.sortField === 'price' &&
              sortParams.sortMethod === 'asc',
          }"
        />
      </a>
    </div>
    <div class="check">
      <!-- 绑定的复选框的数据，这里的 v-model 已经默认与 checked 相绑定，且为响应式的 -->
      <CheckBox @click="checkChange" v-model="sortParams.inventory"
        >仅显示有货商品</CheckBox
      >
      <CheckBox @click="checkChange" v-model="sortParams.onlyDiscount"
        >仅显示特惠商品</CheckBox
      >
    </div>
  </div>
</template>
<script>
import { reactive } from 'vue'
export default {
  // 筛选后商品顶部排序条件组件
  name: 'SubSort',
  setup (_, { emit }) {
    // 根据后台数据进行交互数据的一致
    // 即是对应标签的四个内容
    const sortParams = reactive({
      inventory: false, // 是否有库存
      onlyDiscount: false, // 只显示特惠
      sortField: null, // 排序规则的
      sortMethod: null // 价格排序规则
    })
    // 点击根据传入的参数修改对应的排序 field
    const changeSort = (sortField) => {
      // 如果是价格需要判断升序降序
      if (sortField === 'price') {
        sortParams.sortMethod = sortParams.sortMethod ? (sortParams.sortMethod === 'desc' ? 'asc' : 'desc') : 'desc'
        emit('sort-change', sortParams)
      } else {
        sortParams.sortMethod = null
      }
      // 不是每次重置为空
      // 如果当前选中的重复点击，则不予理会
      if (sortParams.sortField !== sortField) {
        sortParams.sortField = sortField
        // 每次改变需要重新发送请求
        emit('sort-change', sortParams)
      }
    }
    const checkChange = () => {
      // 每次改变需要重新发送请求
      emit('sort-change', sortParams)
    }
    return {
      sortParams,
      changeSort,
      checkChange
    }
  }
}
</script>
<style scoped lang='less'>
.sub-sort {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .sort {
    display: flex;
    a {
      height: 30px;
      line-height: 28px;
      border: 1px solid #e4e4e4;
      padding: 0 20px;
      margin-right: 20px;
      color: #999;
      border-radius: 2px;
      position: relative;
      transition: all 0.3s;
      &.active {
        background: @xtxColor;
        border-color: @xtxColor;
        color: #fff;
      }
      .arrow {
        position: absolute;
        border: 5px solid transparent;
        right: 8px;
        &.up {
          top: 3px;
          border-bottom-color: #bbb;
          &.active {
            border-bottom-color: @xtxColor;
          }
        }
        &.down {
          top: 15px;
          border-top-color: #bbb;
          &.active {
            border-top-color: @xtxColor;
          }
        }
      }
    }
  }
  .check {
    .xtx-checkbox {
      margin-left: 20px;
      color: #999;
    }
  }
}
</style>
