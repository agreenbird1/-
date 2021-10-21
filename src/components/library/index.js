// 扩展vue原有的功能：全局组件，自定义指令，挂载原型方法，注意：没有全局过滤器。
import defaultImg from '@/assets/images/default.png'
import Bread from './Bread'
import BreadItem from './BreadItem'
import Carousel from './Carousel'
import More from './More'
import Skeleton from './Skeleton'

export default {
  install (app) {
    app.component(Skeleton.name, Skeleton)
    app.component(Carousel.name, Carousel)
    app.component(Bread.name, Bread)
    app.component(BreadItem.name, BreadItem)
    app.component(More.name, More)
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
