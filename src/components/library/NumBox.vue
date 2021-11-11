<template>
  <div class="xtx-numbox">
    <div class="label">{{ label }}</div>
    <div class="numbox">
      <a href="javascript:;" @click="changeNum(-1)">-</a>
      <input type="text" readonly :value="modelValue" />
      <a href="javascript:;" @click="changeNum(1)">+</a>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Numbox',
  props: {
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: Number,
      default: 1
    },
    // 库存量决定
    maxValue: {
      type: Number,
      default: 10
    },
    // 控制是否可点
    numCon: {
      type: Boolean,
      default: false
    }
  },
  setup (props, { emit }) {
    const changeNum = (val) => {
      if (props.numCon) {
        const newVal = props.modelValue + val

        if (newVal <= props.maxValue && newVal >= 1) {
          // 实现双向数据绑定
          emit('update:modelValue', newVal)
          console.log(props.modelValue)
        }
      }
    }
    return {
      changeNum
    }
  }
}
</script>
<style scoped lang="less">
.xtx-numbox {
  display: flex;
  align-items: center;
  .label {
    width: 60px;
    color: #999;
    padding-left: 10px;
  }
  .numbox {
    width: 120px;
    height: 30px;
    border: 1px solid #e4e4e4;
    display: flex;
    > a {
      width: 29px;
      line-height: 28px;
      text-align: center;
      background: #f8f8f8;
      font-size: 16px;
      color: #666;
      &:first-of-type {
        border-right: 1px solid #e4e4e4;
      }
      &:last-of-type {
        border-left: 1px solid #e4e4e4;
      }
    }
    > input {
      width: 60px;
      padding: 0 5px;
      text-align: center;
      color: #666;
    }
  }
}
</style>
