<script>
import { h } from 'vue'
export default {
  name: 'Bread',
  // 通过render函数动态渲染面包屑组件结构
  render () {
    // vue2.x render:h=>h()
    // 返回的值就是当前组件的内容
    // h 第一个参数 标签名字  第二个参数 标签属性对象  第三个参数 子节点
    // <i class="iconfont icon-angle-right"></i>
    // 获取默认插槽内的内容
    const items = this.$slots.default()
    const dynamicItems = []
    items.forEach((item, index) => {
      dynamicItems.push(item)
      if (index < (items.length - 1)) {
        // 除了最后一个，都添加上一个右箭头的 i 标签
        dynamicItems.push(h('i', { class: 'iconfont icon-angle-right' }))
      }
    })
    return h('div', { class: 'xtx-bread' }, dynamicItems)
  }
}
</script>

<style lang='less'>
// 去除 scoped 属性，目的：然样式作用到xtx-bread-item组件
.xtx-bread {
  display: flex;
  padding: 25px 10px;
  // ul li:last-child {}
  // 先找到父元素，找到所有的子元素，找到最后一个，判断是不是LI，是就是选中，不是就是无效选择器
  // ul li:last-of-type {}
  // 先找到父元素，找到所有的类型为li的元素，选中最后一个
  &-item {
    a {
      color: #666;
      transition: all 0.4s;
      &:hover {
        color: @xtxColor;
      }
    }
  }
  i {
    font-size: 12px;
    margin-left: 5px;
    margin-right: 5px;
    line-height: 22px;
    // 样式的方式，不合理
    // &:last-child {
    //   display: none;
    // }
  }
}
</style>
