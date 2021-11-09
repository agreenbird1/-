// 购物车模块
export default {
  namespaced: true,
  state () {
    return {
      // 购物车商品列表
      list: []
    }
  },
  mutations: {
    // 本地：id skuId name picture price nowPrice count attrsText selected stock isEffective
    // 线上：比上面多 isCollect 有用 discount 无用 两项项信息
    insertCart (state, newGoods) {
      // 标识是否为新商品
      let isOldGoods = false
      // 是通过skuId确定唯一商品
      state.list.forEach(goods => {
        if (goods.skuId === newGoods.skuId) {
          console.log('goods' + goods.skuId)
          console.log(newGoods)
          // 同一商品添加数量即可
          goods.count = goods.count + newGoods.count
          isOldGoods = true
        }
      })
      // 当不是新商品时，直接进行追加
      if (!isOldGoods) {
        state.list.unshift(newGoods)
      }
    },
    deleteGoods (state, skuId) {
      const i = state.list.findIndex(goods => goods.skuId === skuId)
      state.list.splice(i, 1)
    },
    // 修改购物车商品
    updateCart (state, goods) {
      // goods中字段有可能不完整，goods有的信息才去修改。
      // 1. goods中必需又skuId，才能找到对应的商品信息
      const updateGoods = state.list.find(item => item.skuId === goods.skuId)
      for (const key in goods) {
        // 布尔类型 false 值需要使用
        // 遍历进行更新
        if (goods[key] !== null && goods[key] !== undefined && goods[key] !== '') {
          updateGoods[key] = goods[key]
        }
      }
    },
    selectedLocalAll (state, payload) {
      payload.newList.forEach(goods => {
        goods.selected = payload.newSelected
      })
    }
  },
  actions: {
    // ctx: Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象
    insertCart (ctx, newGoods) {
      // 返回一个Promise来保存成功失败的状态
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.token) {

        } else {
          // 未登录
          ctx.commit('insertCart', newGoods)
          resolve()
        }
      })
    },
    // 删除本地购物车商品
    deleteGoods (ctx, skuId) {
      // 返回一个Promise来保存成功失败的状态
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.token) {

        } else {
          // 未登录
          ctx.commit('deleteGoods', skuId)
          resolve()
        }
      })
    },
    updateCart (ctx, goods) {
      // goods 中：必须有skuId，其他想修改的属性 selected  count
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.token) {
          // 登录 TODO
        } else {
          // 本地
          ctx.commit('updateCart', goods)
          resolve()
        }
      })
    },
    // 全选操作
    selectedAll (ctx, newSelected) {
      // goods 中：必须有skuId，其他想修改的属性 selected  count
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.token) {
          // 登录 TODO
        } else {
          // 本地
          ctx.commit('selectedLocalAll', { newSelected, newList: ctx.getters.validList })
          resolve()
        }
      })
    }
  },
  getters: {
    // 有效商品列表
    validList (state) {
      return state.list.filter(item => item.stock > 0 && item.isEffective)
    },
    // 有效商品件数
    validTotal (state, getters) {
      return getters.validList.reduce((p, c) => p + c.count, 0)
    },
    // 有效商品总金额
    validAmount (state, getters) {
      return getters.validList.reduce((p, c) => p + c.nowPrice * 100 * c.count, 0) / 100
    },
    // 无效商品列表
    invalidList (state) {
      return state.list.filter(item => !(item.stock > 0 && item.isEffective))
    },
    // 选中商品列表
    selectedList (state, getters) {
      return getters.validList.filter(item => item.selected)
    },
    // 选中商品件数
    selectedTotal (state, getters) {
      return getters.selectedList.reduce((p, c) => p + c.count, 0)
    },
    // 选中商品总金额
    selectedAmount (state, getters) {
      return getters.selectedList.reduce((p, c) => p + (c.nowPrice * 100 * c.count), 0) / 100
    },
    // 是否全选
    isCheckAll (state, getters) {
      return getters.validList.length === getters.selectedList.length && getters.selectedList.length !== 0
    }
  }
}
