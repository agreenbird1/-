import { deleteCart, findCart, insertCart, mergeCart, updateCart } from '@/api/cart'

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
    },
    // 清空本地购物车
    setCartList (state, payload) {
      state.list = payload
    }
  },
  actions: {
    // 登录合并本地购物车
    async mergeCart (ctx) {
      const cartList = ctx.state.list.map(item => {
        return {
          skuId: item.skuId,
          selected: item.selected,
          count: item.count
        }
      })
      await mergeCart(cartList)
      // await 到这里表示成功合并后
      // 成功后清空本地购物车
      ctx.commit('setCartList', [])
    },
    // 修改sku规格函数
    updateCartSku (ctx, { oldSkuId, newSku }) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.user.token) {
          // 登录 TODO
          // 1. 获取原先商品的数量
          // 2. 删除原先商品
          // 3. 获取修改的skuId 和 原先商品数量 做一个加入购物车操作
          // 4. 更新列表
          const oldGoods = ctx.state.list.find(item => item.skuId === oldSkuId)
          deleteCart([oldSkuId]).then(() => {
            return insertCart({ skuId: newSku.skuId, count: oldGoods.count })
          }).then(() => {
            return findCart()
          }).then((data) => {
            ctx.commit('setCartList', data.result)
            resolve()
          })
        } else {
          // 本地
          // 但你修改了sku的时候其实skuId需要更改，相当于把原来的信息移出，创建一条新的商品信息。
          // 1. 获取旧的商品信息
          const oldGoods = ctx.state.list.find(item => item.skuId === oldSkuId)
          // 2. 删除旧的商品
          ctx.commit('deleteGoods', oldSkuId)
          // 3. 合并一条新的商品信息
          const { skuId, price: nowPrice, inventory: stock, specsText: attrsText } = newSku
          const newGoods = { ...oldGoods, skuId, nowPrice, stock, attrsText }
          // 4. 去插入即可
          ctx.commit('insertCart', newGoods)
        }
      })
    },
    // 批量删除选中商品
    batchCart (ctx, isClear = false) {
      // 返回一个Promise来保存成功失败的状态
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.user.token) {
          // 得到需要删除的商品列表（失效，选中）的skuId集合
          const ids = ctx.getters[isClear ? 'invalidList' : 'selectedList'].map(item => item.skuId)
          deleteCart(ids).then(() => {
            return findCart()
          }).then((data) => {
            ctx.commit('setCartList', data.result)
            resolve()
          })
        } else {
          // 未登录
          ctx.getters[isClear ? 'invalidList' : 'selectedList'].forEach(item => { ctx.commit('deleteGoods', item.skuId) })
          resolve()
        }
      })
    },
    // 清空无效商品
    batchInCart (ctx) {
      // 返回一个Promise来保存成功失败的状态
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.user.token) {

        } else {
          // 未登录
          ctx.getters.invalidList.forEach(item => { ctx.commit('deleteGoods', item.skuId) })
          resolve()
        }
      })
    },
    // ctx: Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象
    insertCart (ctx, newGoods) {
      // 返回一个Promise来保存成功失败的状态
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.user.token) {
          // 登录 TODO
          insertCart({ skuId: newGoods.skuId, count: newGoods.count }).then(() => {
            // 服务器更新后再重服务器得到
            return findCart()
          }).then((data) => {
            ctx.commit('setCartList', data.result)
            resolve()
          })
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
        if (ctx.rootState.user.user.token) {
          deleteCart([skuId]).then(() => {
            // 服务器更新后再重服务器得到
            return findCart()
          }).then((data) => {
            ctx.commit('setCartList', data.result)
            resolve()
          })
        } else {
          // 未登录
          ctx.commit('deleteGoods', skuId)
          resolve()
        }
      })
    },
    // 更新数量
    updateCart (ctx, goods) {
      // goods 中：必须有skuId，其他想修改的属性 selected  count
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.user.token) {
          // 登录 TODO
          updateCart(goods).then(() => {
            return findCart()
          }).then((data) => {
            ctx.commit('setCartList', data.result)
            resolve()
          })
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
        if (ctx.rootState.user.user.token) {
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
