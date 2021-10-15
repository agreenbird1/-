import { findAllCategories } from '@/api/category'
import { topCategory } from '@/api/constance'
// 商品分类模块
export default {
  namespaced: true,
  state () {
    return {
      // 分类信息集合，封装成对象，方便以后进行操作
      // 设置的初识 商品信息分类信息,防止初始加载产生空白
      list: topCategory.map(category => ({ name: category }))
    }
  },
  mutations: {
    setList (state, newList) {
      state.list = newList
    },
    // store 操控二级类目的显示以及隐藏,要根据当前id进行查找
    show (state, id) {
      const category = state.list.find(category => category.id === id)
      category.open = true
    },
    hide (state, id) {
      const category = state.list.find(category => category.id === id)
      category.open = false
    }
  },
  actions: {
    // 异步调用获取后台分数据
    async getList (state) {
      // 解构是因为返回的数据中数据就是存储在 result
      const { result } = await findAllCategories()
      result.forEach(category => {
        // 控制点击,鼠标移入等事件,操控二级类目的显示与隐藏
        category.open = false
      })
      // commit 提交更新
      state.commit('setList', result)
    }
  }
}
