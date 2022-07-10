// 封装使用 compositionAPI 的函数，称为钩子
import { useIntersectionObserver, useIntervalFn } from '@vueuse/core'
import { ref, onUnmounted } from 'vue'
import dayjs from 'dayjs'

/**
 * 数据懒加载函数，当进入可视区的时候发起请求获得数据进行页面渲染
 * IntersectionObserver通过这个对象
 * @param { Element }  target - 被监听的 dom 元素
 * @param { Function } apiFn - 请求数据函数
 */
export const getLazyData = apiFn => {
  // 获取返回的结果
  const result = ref([])
  const target = ref(null)
  // 获得的是停止监听的函数
  const { stop } = useIntersectionObserver(
    target,
    // isIntersecting 是否已经进入可视区 Boolean
    // intersectionObserverEntry对象数组，里面是各种阈值
    ([{ isIntersecting }]) => {
      if (isIntersecting) {
        // 进入可视区停止监听并进行数据请求分发
        stop()
        apiFn().then(data => {
          result.value = data.result
        })
      }
    },
    // 配置选项
    {
      // 盒子与可视区相交的比例设置，达到这个阈值才会开始请求
      threshold: 0
    }
  )
  return { result, target }
}

/**
 * 支付倒计时函数
 */
export const usePayTime = () => {
  // 倒计时逻辑
  const time = ref(0)
  const timeText = ref('')
  const { pause, resume } = useIntervalFn(() => {
    time.value--
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')
    if (time.value <= 0) {
      pause()
    }
  }, 1000, false)
  onUnmounted(() => {
    pause()
  })

  // 开启定时器 countdown 倒计时时间
  const start = (countdown) => {
    time.value = countdown
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')
    resume()
  }

  return {
    start,
    timeText
  }
}
