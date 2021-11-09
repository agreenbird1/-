<template>
  <nav class="app-topnav">
    <div class="container">
      <ul>
        <!-- 登录和未登录显示两种状态
        用两个 template 隔开-->
        <template v-if="user.token">
          <li>
            <a href="javascript:;"><i class="iconfont icon-user"></i>周杰伦</a>
          </li>
          <li><a href="javascript:;" @click="logout">退出登录</a></li>
        </template>
        <template v-else>
          <li><RouterLink to="/login">请先登录</RouterLink></li>
          <li><a href="javascript:;">免费注册</a></li>
        </template>
        <li><a href="javascript:;">我的订单</a></li>
        <li><a href="javascript:;">会员中心</a></li>
        <li><a href="javascript:;">帮助中心</a></li>
        <li><a href="javascript:;">关于我们</a></li>
        <li>
          <a href="javascript:;"><i class="iconfont icon-phone"></i>手机版</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
export default {
  name: 'AppNavBar',
  setup () {
    const store = useStore()
    const router = useRouter()
    const { user } = store.state.user
    const logout = () => {
      store.commit('user/setUser', {})
      router.push('/login')
    }
    return { user, logout }
  }
}
</script>

<style scoped lang="less">
.app-topnav {
  background: #333;
  ul {
    display: flex;
    height: 53px;
    justify-content: flex-end;
    align-items: center;
    li {
      a {
        padding: 0 15px;
        color: #cdcdcd;
        line-height: 1;
        display: inline-block;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
        &:hover {
          color: @xtxColor;
        }
      }
      // 浏览器对 css 的解析也是顺序的，先找到第一个 li ，然后 ~ 符号就是对后面的兄弟  li 节点进行左边竖线的设置
      ~ li {
        a {
          border-left: 2px solid #666;
        }
      }
    }
  }
}
</style>
