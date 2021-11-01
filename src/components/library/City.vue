<template>
  <div class="xtx-city" ref="target">
    <div class="select" @click="toggle()" :class="{ active: visible }">
      <span v-if="!fullLocation" class="placeholder">请选择配送地址</span>
      <span v-else class="value">{{ fullLocation }}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="option" v-if="visible">
      <div v-if="loading" class="loading"></div>
      <template v-else>
        <span
          @click="changeCityHandler(city)"
          class="ellipsis"
          v-for="city in currList"
          :key="city.code"
          >{{ city.name }}</span
        >
      </template>
    </div>
  </div>
</template>

<script>
import { ref, computed, reactive } from 'vue'
import { onClickOutside } from '@vueuse/core'
import axios from 'axios'
export default {
  name: 'City',
  props: {
    fullLocation: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    // 1.点击需要关闭，默认也是关闭
    const visible = ref(false)
    // 加载中
    const loading = ref(false)
    // 城市信息数据
    const cityData = ref([])
    // 打开组件的时候进行数据获取，开启加载
    const open = () => {
      visible.value = true
      loading.value = true
      getCityData().then(data => {
        cityData.value = data
        // 数据获取成功，关闭加载
        loading.value = false
      })
      // 每次打开需要清空之前的选择
      for (const key in changeCity) {
        changeCity[key] = ''
      }
    }

    const close = () => {
      visible.value = false
    }

    const toggle = () => {
      // 打开则关闭，关闭则打开
      visible.value ? close() : open()
    }

    // 2.点击组件外部也需要进行关闭
    const target = ref(null)
    onClickOutside(target, () => close())

    // 获取城市数据
    // 1. 数据在哪里？https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json
    // 2. 何时获取？打开城市列表的时候，做个内存中缓存
    // 3. 怎么使用数据？定义计算属性，根据点击的省份城市展示
    const getCityData = () => {
      // 这个位置可能有异常操作，封装成promise
      return new Promise((resolve, reject) => {
        if (window.cityData) {
          // 有缓存
          resolve(window.cityData)
        } else {
          // 无缓存
          const url = 'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json'
          axios.get(url).then(res => {
            window.cityData = res.data
            resolve(window.cityData)
          })
        }
      })
    }

    // 定义计算属性
    const currList = computed(() => {
      let currList = cityData.value
      // TODO 根据点击的省份城市获取对应的列表
      // 当当前列表的值点击并改变之后，需要进行调整展示的城市的信息
      if (changeCity.provinceCode) {
        currList = currList.find(p => p.code === changeCity.provinceCode).areaList
      }
      // 地区
      if (changeCity.cityCode) {
        currList = currList.find(c => c.code === changeCity.cityCode).areaList
      }
      return currList
    })

    // 当前选择的这个城市的层级属性关系集合
    const changeCity = reactive({
      provinceCode: '',
      provinceName: '',
      cityCode: '',
      cityName: '',
      countyCode: '',
      countyName: '',
      fullLocation: ''
    })

    // 点击城市的时候需要更新的信息列表，区已经是最后一级，不需要再更新
    const changeCityHandler = (city) => {
      // 省份
      if (city.level === 0) {
        changeCity.provinceCode = city.code
        changeCity.provinceName = city.name
      }
      // 市
      if (city.level === 1) {
        changeCity.cityCode = city.code
        changeCity.cityName = city.name
      }
      // 区
      if (city.level === 2) {
        changeCity.countyCode = city.code
        changeCity.countyName = city.name
        changeCity.fullLocation = changeCity.provinceName + ' ' + changeCity.cityName + ' ' + changeCity.countyName
        // 已经无处可点，需要关闭弹窗，并将整个的选择的数据进行返回给父组件
        close()
        emit('changeCity', changeCity)
      }
    }

    return {
      visible,
      toggle,
      target,
      loading,
      currList,
      changeCityHandler
    }
  }
}
</script>

<style scoped lang="less">
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
    .loading {
      height: 290px;
      width: 100%;
      background: url(../../assets/images/load.gif) no-repeat center;
    }
  }
}
</style>
