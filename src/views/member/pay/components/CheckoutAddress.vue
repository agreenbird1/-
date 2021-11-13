/* eslint-disable vue/no-mutating-props */
<template>
  <div class="checkout-address">
    <div class="text">
      <div v-if="!showAddress" class="none">
        您需要先添加收货地址才可提交订单。
      </div>
      <ul v-if="showAddress">
        <li>
          <span>收<i />货<i />人：</span>{{ showAddress.receiver }}
        </li>
        <li><span>联系方式：</span>{{ showAddress.contact }}</li>
        <li>
          <span>收货地址：</span
          >{{
            showAddress.fullLocation.replace(/ /g, "") + showAddress.address
          }}
        </li>
      </ul>
      <!-- 修改地址打开前需要填充，故传入当前地址对象 -->
      <a
        v-if="showAddress"
        href="javascript:;"
        @click="openDialogEdit(showAddress)"
        >修改地址</a
      >
    </div>
    <div class="action">
      <MyButton @click="openDialog" class="btn">切换地址</MyButton>
      <MyButton @click="openDialogEdit({})" class="btn">添加地址</MyButton>
    </div>
  </div>
  <MyDialog title="切换地址" v-model:visible="visible">
    <div
      @click="selectedAddress = item"
      :class="{ active: selectedAddress && item.id === selectedAddress.id }"
      class="text item"
      v-for="item in list"
      :key="item.id"
    >
      <ul>
        <li>
          <span>收<i />货<i />人：</span>{{ item.receiver }}
        </li>
        <li><span>联系方式：</span>{{ item.contact }}</li>
        <li>
          <span>收货地址：</span
          >{{ item.fullLocation.replace(/ /g, "") + item.address }}
        </li>
      </ul>
    </div>
    <template v-slot:footer>
      <MyButton type="gray" style="margin-right: 20px">取消</MyButton>
      <MyButton @click="confirmAddressFn" type="primary">确认</MyButton>
    </template>
  </MyDialog>
  <AddressEdit
    @on-add-success="AddAddressSuccess"
    @on-edit-success="EditAddressSuccess"
    ref="addressEditRef"
  />
</template>
<script>
import { ref } from 'vue'
import AddressEdit from './AddressEdit.vue'
export default {
  name: 'CheckoutAddress',
  // 代码片段中（没有根元素）最好声明自定义的事件
  emits: ['change'],
  components: { AddressEdit },
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  setup (props, { emit }) {
    // 显示默认地址
    // || 显示第一条
    // || 提示添加新地址
    // 显示的地址
    const showAddress = ref(null)
    const visible = ref(false)
    if (props.list.length) {
      const defaultAddress = props.list.find(item => item.isDefault === 1)
      if (defaultAddress) {
        showAddress.value = defaultAddress
      } else {
        // eslint-disable-next-line vue/no-setup-props-destructure
        showAddress.value = props.list[0]
        // 通知父组件选中的地址
      }
    }
    emit('change', showAddress.value?.id)
    // 控制显示
    const changeVisible = () => {
      visible.value = true
    }

    // 当前选中的
    const selectedAddress = ref(null)
    // 确认 切换显示
    const confirmAddressFn = () => {
      showAddress.value = selectedAddress.value
      // 并通知父组件
      emit('change', selectedAddress.value.id)
      visible.value = false
    }
    // 打开弹出层前置空
    const openDialog = () => {
      selectedAddress.value = null
      visible.value = true
    }
    // 控制添加对话框的显示
    // 获得组件实例可以调用暴露的方法
    const addressEditRef = ref(null)
    const openDialogEdit = (address) => {
      // 添加 {} 修改 -> 地址对象
      addressEditRef.value.open(address)
    }

    // 成功添加收货地址
    const AddAddressSuccess = (formData) => {
      // 直接修改props的值即可更改显示，但这里需要使用浅拷贝
      // 因为后台数据已经改了，不需要再发送请求
      const jsonStr = JSON.stringify(formData)
      // eslint-disable-next-line vue/no-mutating-props
      props.list.push(JSON.parse(jsonStr))
    }
    // 修改地址成功
    const EditAddressSuccess = (formData) => {
      props.list.forEach(address => {
        // 遍历修改对应的地址即可
        if (address.id === formData.id) {
          for (const key in formData) {
            address[key] = formData[key]
          }
        }
      })
    }
    return {
      showAddress,
      visible,
      changeVisible,
      selectedAddress,
      confirmAddressFn,
      openDialog,
      openDialogEdit,
      addressEditRef,
      AddAddressSuccess,
      EditAddressSuccess
    }
  }
}
</script>
<style scoped lang="less">
.xtx-dialog {
  .text {
    max-height: 400px;
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    &.item {
      border: 1px solid #f5f5f5;
      margin-bottom: 10px;
      cursor: pointer;
      &.active,
      &:hover {
        border-color: @xtxColor;
        background: lighten(@xtxColor, 50%);
      }
      > ul {
        padding: 10px;
        font-size: 14px;
        line-height: 30px;
      }
    }
  }
}
.checkout-address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }
    > ul {
      flex: 1;
      padding: 20px;
      li {
        line-height: 30px;
        span {
          color: #999;
          margin-right: 5px;
          > i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }
    > a {
      color: @xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }
  .action {
    width: 420px;
    text-align: center;
    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
</style>
