<template>
  <!-- 筛选区 -->
  <div class="sub-filter" v-if="filterData">
    <div class="item">
      <!-- 第一个默认就是品牌区 -->
      <div class="head">品牌：</div>
      <div class="body">
        <a
          href="javascript:;"
          v-for="brand in filterData.brands"
          :key="brand.id"
          @click="changeBrand(brand.id)"
          :class="{ active: filterData.selected === brand.id }"
          >{{ brand.name }}</a
        >
      </div>
    </div>
    <div class="item" v-for="sp in filterData.saleProperties" :key="sp.id">
      <div class="head">{{ sp.name }}</div>
      <div class="body">
        <a
          href="javascript:;"
          v-for="p in sp.properties"
          :key="p.id"
          @click="changeProp(sp, p)"
          :class="{ active: sp.selected === p.id }"
          >{{ p.name }}</a
        >
      </div>
    </div>
  </div>
</template>
<script>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { findSubCategoryFilter } from '@/api/category'
export default {
  name: 'SubFilter',
  setup (_, { emit }) {
    const route = useRoute()
    // 获取筛选条件的信息
    const filterData = ref(null)

    // 同样是在同一个路由规则之下，所以点击时候不会触发组件更新，需要用 watch 监视 id
    watch(() => route.params.id, (newVal) => {
      // 当新的id存在  且匹配于二级路由之下，此时才需要获取这个筛选信息
      if (newVal && route.path === '/category/sub/' + newVal) {
        findSubCategoryFilter(newVal).then(data => {
          // 给品牌和销售属性前面都加一个 全部 属性
          // 分别给品牌和属性设置两个 selected 控制选中
          data.result.selected = null
          data.result.brands.unshift({ id: null, name: '全部' })
          data.result.saleProperties.forEach(p => {
            // 销售属性下有详细 比如 ：颜色(saleProperties) => 红色(properties)
            p.selected = null
            p.properties.unshift({ id: null, name: '全部' })
          })
          filterData.value = data.result
        })
      }
    }, { immediate: true })

    // 定义一个参数集合
    const filterParams = { brandId: null, attrs: [] }
    // 品牌选择功能以及属性传递
    const changeBrand = (brandId) => {
      // 解决选中问题
      filterData.value.selected = brandId
      // 添加参数
      filterParams.brandId = brandId
      emit('sort-filter', filterParams)
    }
    // 属性改变时的传递与选定功能
    const changeProp = (sp, p) => {
      // 解决选中问题
      sp.selected = p.id
      // 添加参数属性
      // 但是不能重复添加,需要去除多个groupname相同的数据
      // 通过filter的方式去除跟当前重名的元素
      const arr = filterParams.attrs.filter(group => group.groupName !== sp.name)
      // 再进行赋值
      filterParams.attrs = [...arr, { groupName: sp.name, propertyName: p.name }]
      // 解决
      emit('sort-filter', filterParams)
    }
    return {
      filterData,
      changeBrand,
      changeProp
    }
  }
}
</script>
<style scoped lang='less'>
// 筛选区
.sub-filter {
  background: #fff;
  padding: 25px;
  .item {
    display: flex;
    line-height: 40px;
    .head {
      width: 80px;
      color: #999;
    }
    .body {
      flex: 1;
      a {
        margin-right: 36px;
        transition: all 0.3s;
        display: inline-block;
        &.active,
        &:hover {
          color: @xtxColor;
        }
      }
    }
  }
}
</style>
