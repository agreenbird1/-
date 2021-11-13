<template>
  <MyDialog
    :title="`${formData.id ? '修改' : '添加'}收货地址`"
    v-model:visible="dialogVisible"
  >
    <div class="address-edit">
      <div class="xtx-form">
        <div class="xtx-form-item">
          <div class="label">收货人：</div>
          <div class="field">
            <input
              v-model="formData.receiver"
              class="input"
              placeholder="请输入收货人"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">手机号：</div>
          <div class="field">
            <input
              v-model="formData.contact"
              class="input"
              placeholder="请输入手机号"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">地区：</div>
          <div class="field">
            <City
              :fullLocation="formData.fullLocation"
              placeholder="请选择所在地区"
              @changeCity="changeCity"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">详细地址：</div>
          <div class="field">
            <input
              v-model="formData.address"
              class="input"
              placeholder="请输入详细地址"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">邮政编码：</div>
          <div class="field">
            <input
              v-model="formData.postalCode"
              class="input"
              placeholder="请输入邮政编码"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">地址标签：</div>
          <div class="field">
            <input
              v-model="formData.addressTags"
              class="input"
              placeholder="请输入地址标签，逗号分隔"
            />
          </div>
        </div>
      </div>
    </div>
    <template v-slot:footer>
      <MyButton
        @click="dialogVisible = false"
        type="gray"
        style="margin-right: 20px"
        >取消</MyButton
      >
      <MyButton @click="submit" type="primary">确认</MyButton>
    </template>
  </MyDialog>
</template>
<script>
import { ref, reactive } from 'vue'
import { addAddress, editAddress } from '@/api/order'
import message from '@/components/library/Message'
export default {
  name: 'AddressEdit',
  setup (_, { emit }) {
    const dialogVisible = ref(false)
    // 打开函数
    const open = (address) => {
      dialogVisible.value = true
      if (address.id) {
        // 修改打开前赋值数据
        for (const key in address) {
          formData[key] = address[key]
        }
      } else {
        // 添加打开前清空表单
        for (const item in formData) {
          if (item === 'isDefault') {
            formData[item] = 1
          } else {
            formData[item] = null
          }
        }
      }
    }
    // 收件人信息
    // 表单数据
    const formData = reactive({
      receiver: '',
      contact: '',
      provinceCode: '',
      cityCode: '',
      countyCode: '',
      address: '',
      postalCode: '',
      addressTags: '',
      isDefault: 1,
      fullLocation: ''
    })
    // 根据city组件修改地区
    // 选择地区
    const changeCity = (data) => {
      formData.provinceCode = data.provinceCode
      formData.cityCode = data.cityCode
      formData.countyCode = data.countyCode
      formData.fullLocation = data.fullLocation
    }

    const submit = (data) => {
      if (formData.id) {
        // 修改
        editAddress(formData).then(() => {
          message({ type: 'success', text: '添加成功' })
          dialogVisible.value = false
          emit('on-edit-success', formData)
        }).catch(e => {
          message({ type: 'warn', text: '修改失败' })
        })
      } else {
        // 添加
        addAddress(formData).then((data) => {
          // 设置id - 提示信息 - 关闭对话框 - 组件修改值
          formData.id = data.result.id
          message({ type: 'success', text: '添加成功' })
          dialogVisible.value = false
          emit('on-add-success', formData)
        }
        ).catch(e => {
          message({ type: 'error', text: '添加失败' })
        })
      }
    }
    return {
      dialogVisible,
      formData,
      open,
      changeCity,
      submit
    }
  }
}
</script>
<style scoped lang="less">
.xtx-dialog {
  :deep(.wrapper) {
    width: 780px;
    .body {
      font-size: 14px;
    }
  }
}
.xtx-form {
  padding: 0;
  input {
    outline: none;
    &::placeholder {
      color: #ccc;
    }
  }
}
.xtx-city {
  width: 320px;
  :deep(.select) {
    height: 50px;
    line-height: 48px;
    display: flex;
    padding: 0 10px;
    justify-content: space-between;
    .placeholder {
      color: #ccc;
    }
    i {
      color: #ccc;
      font-size: 18px;
    }
    .value {
      font-size: 14px;
    }
  }
  :deep(.option) {
    top: 49px;
  }
}
</style>
