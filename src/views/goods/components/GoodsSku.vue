<template>
  <div class="goods-sku">
    <dl v-for="item in goods?.specs" :key="item.id">
      <dt>{{ item.name }}</dt>
      <dd>
        <!-- 使用模板进行渲染 -->
        <template v-for="val in item.values" :key="val.name">
          <img
            @click="changeSku(item, val)"
            :class="{ selected: val.selected }"
            v-if="val.picture"
            :src="val.picture"
            :title="val.name"
          />
          <span
            v-else
            @click="changeSku(item, val)"
            :class="{ selected: val.selected, disabled: val.disabled }"
            >{{ val.name }}</span
          >
        </template>
      </dd>
    </dl>
  </div>
</template>
<script>
import bwPowerSet from '@/vender/powerSet'
/**
   * sku
   * 什么是 sku？
   * 相当于是一个组合，比如 规格，颜色
   * 那么一个 sku 就是任意一个规格和任意一个颜色的组合
   * 当我选中了其中一个规格，那么这个规格下的所有的可选的颜色组合应该是筛选出来的
   * 这就是 路径字典：比如 大号 --> 大号&蓝色，是一个路径，大号&红色也是，他们的 skuId 都应该被 大号 这个键所保存
   *
   */
// 用于拼接路径
const spliter = '&'
// 判断 sku 集合，即是所有可选项的笛卡尔积组合，这样用于判断当前点击路径上的值是否可选
const getEffSkus = (skus) => {
  const pathMap = {}
  skus.forEach(s => {
    // 如果当前这个对于的sku的库存大于0（筛选有效数据）
    if (s.inventory > 0) {
      // 因为对象是一个数据
      // 筛选出对应的完整的可选规格的一个路径
      const iarr = s.specs.map(i => i.valueName)
      // 对路径进行拆分成所有的子路径
      const iarrPowerSets = bwPowerSet(iarr)
      iarrPowerSets.forEach(ia => {
        // 将有效子序列存入
        const key = ia.join(spliter)
        // 当当前对应的键存在时
        if (pathMap[key]) {
          pathMap[key].push(s.id)
        } else {
          pathMap[key] = [s.id]
        }
      })
    }
  })
  return pathMap
}

// 获取当前的选中的属性的顺序名称数组，未选中的添加 undefined 占位
// 目的是 根据 序列在pathMap中进行查找匹配
const getSelectedValues = (specs) => {
  const arr = []
  specs.forEach(sp => {
    const selectedValue = sp.values.find(val => val.selected)
    arr.push(selectedValue ? selectedValue.name : undefined)
  })
  return arr
}

/**
 * 更新按钮的点击禁用状态
 * 1.初始化调用
 * 2.点击选项后会调用
 *
 * 流程：
 * 1.获取当前选中的属性序列
 *  1.1创建空数组
 *  1.2对于当前规格进行循环判断并添加，没有的添加undefined占位
 * 2.对所有属性进行循环
 * 3.每循环一个属性，便去pathMap中查找并进行设置
 *
 * 即是实现了所有子序列的遍历判断
 */
const updateDisabledStatus = (specs, pathMap) => {
  // 初始化所有对应选项的禁用为 false
  specs.forEach((sp, index) => {
    // 得到当前选中的属性名称序列
    const selectedValues = getSelectedValues(specs)
    sp.values.forEach(val => {
      // 当没选中时候才进行判断
      if (!val.selected) {
        // 将当前的值名顺序插入选中序列
        selectedValues[index] = val.name
        // 剔除undefined并加入分隔符
        const key = selectedValues.filter(v => v).join(spliter)
        // 判断路径字典中是否存在此名字的键
        val.disabled = !pathMap[key]
      }
    })
  })
}

/**
 * 当传值进来初始有值的时候
 * 应用于购物车组件
 */
const getDefaultSelectedValues = (skuId, goods) => {
  // 1.首先拿到当前的对应 skuId 的sku
  const target = goods.skus.find(sku => sku.id === skuId).specs
  // 2.然后根据 sku 里面对应的值去遍历 goods 中的每一个属性
  goods.specs.forEach((sp, i) => {
    // 找到对应规格后，去规格中将对应的属性选中
    // 且这里对应的sku一定是全选的，所以直接进行判断即可
    sp.values.find(val => val.name === target[i].valueName).selected = true
  })
}
export default {
  name: 'GoodsSku',
  props: {
    goods: {
      type: Object,
      default: () => ({})
    },
    // 默认选中的时候传入 skuId
    skuId: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    const pathMap = getEffSkus(props.goods.skus)
    console.log(props.goods.skus)
    console.log(pathMap)
    // 如果有默认选中才调用
    if (props.skuId) {
      getDefaultSelectedValues(props.skuId, props.goods)
    }
    // ★初始化设置
    updateDisabledStatus(props.goods.specs, pathMap)
    // 点击切换选中，且单个可选值属性中只能有一个选中
    const changeSku = (item, val) => {
      // 按钮是禁用的则不可点
      if (val.disabled) return
      // 当前选择的是一个未选中的，选中之前需要将同级其他元素取消
      if (!val.selected) {
        item.values.map(v => {
          v.selected = false
        })
      }
      // 声明赋值
      val.selected = !val.selected
      updateDisabledStatus(props.goods.specs, pathMap)
      // 每次选中一个属性之后需要将当前 sku 信息进行传递
      // 获取选中的属性（有效的），判断长度是
      const selectedValues = getSelectedValues(props.goods.specs).filter(v => v)
      if (selectedValues.length === props.goods.specs.length) {
        // 返回的是一个数组
        const skuIds = pathMap[selectedValues.join(spliter)]
        const sku = props.goods.skus.find(v => v.id === skuIds[0])
        // reduce 函数用来拼接商品sku信息
        emit('change', {
          skuId: sku.id,
          price: sku.price,
          oldPrice: sku.oldPrice,
          inventory: sku.inventory,
          specsText: sku.specs.reduce((p, c) => (p = p + c.name + ':' + c.valueName + ' '), '')
        })
      } else {
        emit('change', {})
      }
    }
    return {
      changeSku
    }
  }
}
</script>
<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
