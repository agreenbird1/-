// 扩展vue原有的功能：全局组件，自定义指令，挂载原型方法，注意：没有全局过滤器。
import defaultImg from '@/assets/images/default.png'

// 正常情况下单个引入组件后，单独注册
/**
 * import Skeleton from './Skeleton'
 * app.component(Skeleton.name, Skeleton)
 */

// 使用全局注册方法，免得每次进行导入

// 1. 被加载目录  2. 是否加载子目录  3. 加载文件的正则  返沪的函数用来进行导入
const importFn = require.context('./', false, /\.vue$/)

export default {
  install (app) {
    // 通过 importFn 导入导入组件并注册
    importFn.keys().forEach(path => {
      // 是模块化的组件，故需用 default 获取
      const component = importFn(path).default
      app.component(component.name, component)
    })
    // 自定义指令
    defineLazyImg(app)
  }
}
// 自定义指令
// 尽管拒绝手动操作 dom ，但是需要自己添加
const defineLazyImg = (app) => {
  // 取名叫做 lazy ，使用时需要写作 v-lazy
  app.directive('lazy', {
    // 指令自定义对象 mounted
    // el 当前绑定的指令的 dom 元素
    // binding 传入的值
    mounted (el, binding) {
      // 懒加载，新建一个观察
      /*
       *        * IntersectionObserverEntry.isIntersecting (en-US) 只读
       * 返回一个布尔值, 如果目标元素与交叉区域观察者对象(intersection observer) 的根相交，则返回 true .
       * 如果返回 true, 则 IntersectionObserverEntry 描述了变换到交叉时的状态;
       * 如果返回 false, 那么可以由此判断,变换是从交叉状态到非交叉状态.
       */
      const observe = new IntersectionObserver(([{ isIntersecting }]) => {
        if (isIntersecting) {
          // 进入可视区关闭观察
          observe.unobserve(el)
          // 还有图片加载失败的情况
          el.error = () => {
            el.src = defaultImg
          }
          el.src = binding.value
        }
      }, {
        threshold: 0
      })
      observe.observe(el)
    }
  })
}
