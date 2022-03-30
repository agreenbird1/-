// 用户模块
export default {
  namespaced: true,
  state () {
    return {
      // 用户信息
      user: {
        id: '',
        // 头像信息
        avatar: '',
        // 昵称信息
        nickname: '',
        // 账户信息
        account: '',
        mobile: '',
        // 用户信息标识
        token: ''
      },
      redirectUrl: ''
    }
  },
  mutations: {
    setUser (state, newUser) {
      state.user = newUser
    },
    setRedirectUrl (state, newUrl) {
      state.redirectUrl = newUrl
    }
  }
}
