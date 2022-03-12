import { createVNode, render } from 'vue'
import Confirm from './Confirm.vue'

// 创建一个新的真实的 dom
const dom = document.createElement('div')
dom.setAttribute('class', 'confirm-container')
document.body.appendChild(dom)
export default ({ title, text }) => {
  // 创建一个新的虚拟的 dom

  // 返回一个Promise来确认
  return new Promise((resolve, reject) => {
    // 传入函数进行点击之后就可以触发 promise 的then 和 catch 回调进行甄别
    const pcancel = () => {
      render(null, dom)
      reject(new Error('点击取消'))
    }
    const pconfirm = () => {
      render(null, dom)
      resolve()
    }
    // 第一参数为容器，可以为'div'，或者函数式组件
    // 第二参数以 props 的形式传入，在点击确认或者取消的时候进行回调
    const vnode = createVNode(Confirm, { title, text, pconfirm, pcancel })
    // 渲染
    render(vnode, dom)
  })
}
