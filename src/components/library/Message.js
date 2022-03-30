/**
 * 实现使用函数调用  message 组件
 * 1. 准备真实 dom 容器
 * 2. 导入组件并将其创捷为虚拟dom节点
 * 3. 将虚拟节点渲染在 dom 节点中
 */

import { createVNode, render } from 'vue'
import Message from './Message.vue'

const dom = document.createElement('div')
dom.setAttribute('class', 'message-container')
document.body.appendChild(dom)

// 定时器销毁虚拟节点
let timer = null

// 传递参数指定组件条件
export default ({ type, text }) => {
  const vnode = createVNode(Message, { type, text })
  render(vnode, dom)
  // 只有单个
  clearTimeout(timer)
  timer = setTimeout(() => {
    // 将空值赋值删除之前的
    render(null, dom)
  }, 2500)
}
