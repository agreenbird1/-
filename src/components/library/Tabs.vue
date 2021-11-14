<script>
import { useVModel } from '@vueuse/core'
import { provide } from 'vue'
export default {
  name: 'Tabs',
  props: {
    // activeName 控制样式
    modelValue: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    // 实现数据的双向绑定
    const activeName = useVModel(props, 'modelValue', emit)
    // 提供给 panel 组件，控制对应的显示隐藏
    provide('activeName', activeName)
    // 点击修改 name
    const tabClick = (name, index) => {
      activeName.value = name
      // 切换样式的同时触发自定义事件
      emit('tab-click', { name, index })
    }
    return {
      activeName,
      tabClick
    }
  },
  render () {
    // 获取默认插槽有几个 panel 节点
    const panels = this.$slots.default()
    // 节点有动态遍历生成的，也有静态写入的
    const dynamicPanels = []
    panels.forEach(panel => {
      // 有 type.name 的就是静态生成的
      if (panel.type.name === 'TabsPanel') {
        dynamicPanels.push(panel)
      } else {
        panel.children.forEach(item => dynamicPanels.push(item))
      }
    })
    const nav =
      <nav>
        {
          // 动态渲染，绑定事件时候，若不使用高阶函数，则是直接调用，所以总是最后一个实现点击效果
          dynamicPanels.map((panel, index) => {
            return <a onClick={() => this.tabClick(panel.props.name, index)} class={{ active: panel.props.name === this.modelValue }} href="javascript:;">
              {panel.props.label}
            </a>
          })
        }
      </nav>

    return <div class="xtx-tabs">
      {[nav, dynamicPanels]}
    </div>
  }
}
</script>

<style scoped lang='less'>
.xtx-tabs {
  background: #fff;
  > nav {
    height: 60px;
    line-height: 60px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    > a {
      width: 110px;
      border-right: 1px solid #f5f5f5;
      text-align: center;
      font-size: 16px;
      &.active {
        border-top: 2px solid @xtxColor;
        height: 60px;
        background: #fff;
        line-height: 56px;
      }
    }
  }
}
</style>
