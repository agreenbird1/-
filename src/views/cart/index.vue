<template>
  <div class="xtx-cart-page">
    <div class="container">
      <Bread>
        <BreadItem to="/">首页</BreadItem>
        <BreadItem>购物车</BreadItem>
      </Bread>
      <div class="cart">
        <table>
          <thead>
            <tr>
              <th width="120">
                <CheckBox
                  @change="selectedAll"
                  :modelValue="$store.getters['cart/isCheckAll']"
                  >全选</CheckBox
                >
              </th>
              <th width="400">商品信息</th>
              <th width="220">单价</th>
              <th width="180">数量</th>
              <th width="180">小计</th>
              <th width="140">操作</th>
            </tr>
          </thead>
          <!-- 有效商品 -->
          <tbody>
            <tr v-if="!$store.getters['cart/validList'].length">
              <td colspan="6">
                <CartNone />
              </td>
            </tr>
            <tr
              v-for="goods in $store.getters['cart/validList']"
              :key="goods.skuId"
            >
              <td>
                <CheckBox
                  @change="($event) => checkOne(goods.skuId, $event)"
                  :modelValue="goods.selected"
                />
              </td>
              <td>
                <div class="goods">
                  <RouterLink :to="`/product/${goods.id}`"
                    ><img :src="goods.picture" alt=""
                  /></RouterLink>
                  <div>
                    <p class="name ellipsis">
                      {{ goods.name }}
                    </p>
                    <!-- 选择规格组件 -->
                    <CartSku
                      @change="($event) => updateCartSku(goods.skuId, $event)"
                      :skuId="goods.skuId"
                      :attrsText="goods.attrsText"
                    />
                  </div>
                </div>
              </td>
              <td class="tc">
                <p>&yen;{{ goods.nowPrice }}</p>
                <p v-if="goods.nowPrice - goods.price > 0">
                  比加入时降价
                  <span class="red"
                    >&yen;{{ goods.nowPrice - goods.price }}</span
                  >
                </p>
              </td>
              <td class="tc">
                <!-- :modelValue="goods.count"
                     @update:modelValue="goods.count = $event"
                -->
                <Numbox
                  :maxValue="goods.stock"
                  :numCon="true"
                  v-model="goods.count"
                  @change="($event) => updateCount(goods.skuId, $event)"
                />
              </td>
              <td class="tc">
                <p class="f16 red">
                  &yen;{{
                    Math.round(goods.count * goods.nowPrice * 100) / 100
                  }}
                </p>
              </td>
              <td class="tc">
                <p><a href="javascript:;">移入收藏夹</a></p>
                <p>
                  <a
                    @click="deleteGoodsInCart(goods.skuId)"
                    class="green"
                    href="javascript:;"
                    >删除</a
                  >
                </p>
                <p><a href="javascript:;">找相似</a></p>
              </td>
            </tr>
          </tbody>
          <!-- 无效商品 -->
          <tbody v-if="$store.getters['cart/invalidList'].length">
            <tr>
              <td colspan="6"><h3 class="tit">失效商品</h3></td>
            </tr>
            <tr
              v-for="inGoods in $store.getters['cart/invalidList']"
              :key="inGoods.skuId"
            >
              <td><CheckBox style="color: #eee" /></td>
              <td>
                <div class="goods">
                  <RouterLink :to="`/product/${goods.id}`"
                    ><img :src="inGoods.picture" alt=""
                  /></RouterLink>
                  <div>
                    <p class="name ellipsis">
                      {{ inGoods.name }}
                    </p>
                    <p class="attr">{{ inGoods.attrsText }}</p>
                  </div>
                </div>
              </td>
              <td class="tc"><p>&yen;200.00</p></td>
              <td class="tc">1</td>
              <td class="tc"><p>&yen;200.00</p></td>
              <td class="tc">
                <p>
                  <a
                    @click="deleteGoodsInCart(inGoods.skuId)"
                    class="green"
                    href="javascript:;"
                    >删除</a
                  >
                </p>
                <p><a href="javascript:;">找相似</a></p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 操作栏 -->
      <div class="action">
        <div class="batch">
          <CheckBox :modelValue="$store.getters['cart/isCheckAll']"
            >全选</CheckBox
          >
          <a href="javascript:;" @click="batchCart">删除商品</a>
          <a href="javascript:;">移入收藏夹</a>
          <a
            href="javascript:;"
            v-if="$store.getters['cart/invalidList'].length"
            @click="batchInCart"
            >清空失效商品</a
          >
        </div>
        <div class="total">
          共 {{ $store.getters["cart/validTotal"] }} 件商品，已选择
          {{ $store.getters["cart/selectedTotal"] }} 件，商品合计：
          <span class="red">¥{{ $store.getters["cart/selectedAmount"] }}</span>
          <MyButton @click="checkOut()" type="primary">下单结算</MyButton>
        </div>
      </div>
      <!-- 猜你喜欢 -->
      <GoodRelevant />
    </div>
  </div>
</template>
<script>
import { useStore } from 'vuex'
import confirm from '@/components/library/Confirm'
import message from '@/components/library/Message'
import GoodRelevant from '@/views/goods/components/GoodsRelevant.vue'
import CartNone from './components/CartNone.vue'
import CartSku from './components/CartSku.vue'
import { useRouter } from 'vue-router'
export default {
  name: 'XtxCartPage',
  components: { GoodRelevant, CartNone, CartSku },
  setup () {
    const store = useStore()
    // 选中一个
    const checkOne = (skuId, selected) => {
      store.dispatch('cart/updateCart', { skuId, selected })
    }
    // 全选
    const selectedAll = (newVal) => {
      store.dispatch('cart/selectedAll', newVal)
    }
    // 单个删除
    const deleteGoodsInCart = (skuId) => {
      // 点击确定是触发 resolve ，取消和x是触发 reject
      confirm({ text: '您确定删除该商品吗？' }).then(() => {
        store.dispatch('cart/deleteGoods', skuId)
        message({ type: 'success', text: '删除成功' })
      }).catch(() => {
        message({ text: '已取消' })
      })
    }

    // 批量删除选中
    const batchCart = () => {
      if (store.getters['cart/selectedList'].length) {
        // 点击确定是触发 resolve ，取消和x是触发 reject
        confirm({ text: '您确定删除选中的商品吗？' }).then(() => {
          store.dispatch('cart/batchCart')
          message({ type: 'success', text: '删除成功' })
        }).catch(() => {
          message({ text: '已取消' })
        })
      } else {
        message({ type: 'warn', text: '您未选中任何商品！' })
      }
    }

    // 清空无效
    const batchInCart = () => {
      // 点击确定是触发 resolve ，取消和x是触发 reject
      confirm({ text: '您确定清空无效商品吗？' }).then(() => {
        store.dispatch('cart/batchInCart')
        message({ type: 'success', text: '清空成功' })
      }).catch(() => {
        message({ text: '已取消' })
      })
    }
    // 更新数量
    const updateCount = (skuId, count) => {
      store.dispatch('cart/updateCart', { skuId, count })
    }

    // 更新 sku 信息
    const updateCartSku = (oldSkuId, newSku) => {
      store.dispatch('cart/updateCartSku', { oldSkuId, newSku })
    }

    const router = useRouter()
    // 下单结算页面
    const checkOut = () => {
      if (store.getters['cart/selectedList'].length === 0) { return message({ type: 'warn', text: '请至少选中一件商品' }) }
      // 未登录时候
      if (!store.state.user.user.token) {
        confirm({ text: '结算购物车需要先进行登录，您确定登录吗？' }).then(() => {
          router.push('/member/checkout')
        }).catch(e => { })
      } else router.push('/member/checkout')
    }
    return {
      checkOne,
      selectedAll,
      deleteGoodsInCart,
      batchCart,
      batchInCart,
      updateCount,
      updateCartSku,
      checkOut
    }
  }
}
</script>
<style scoped lang="less">
.tc {
  text-align: center;
  .xtx-numbox {
    margin: 0 auto;
    width: 120px;
  }
}
.red {
  color: @priceColor;
}
.green {
  color: @xtxColor;
}
.f16 {
  font-size: 16px;
}
.goods {
  display: flex;
  align-items: center;
  img {
    width: 100px;
    height: 100px;
  }
  > div {
    width: 280px;
    font-size: 16px;
    padding-left: 10px;
    .attr {
      font-size: 14px;
      color: #999;
    }
  }
}
.action {
  display: flex;
  background: #fff;
  margin-top: 20px;
  height: 80px;
  align-items: center;
  font-size: 16px;
  justify-content: space-between;
  padding: 0 30px;
  .xtx-checkbox {
    color: #999;
  }
  .batch {
    a {
      margin-left: 20px;
    }
  }
  .red {
    font-size: 18px;
    margin-right: 20px;
    font-weight: bold;
  }
}
.tit {
  color: #666;
  font-size: 16px;
  font-weight: normal;
  line-height: 50px;
}
.xtx-cart-page {
  .cart {
    background: #fff;
    color: #666;
    table {
      border-spacing: 0;
      border-collapse: collapse;
      line-height: 24px;
      th,
      td {
        padding: 10px;
        border-bottom: 1px solid #f5f5f5;
        &:first-child {
          text-align: left;
          padding-left: 30px;
          color: #999;
        }
      }
      th {
        font-size: 16px;
        font-weight: normal;
        line-height: 50px;
      }
    }
  }
}
</style>
