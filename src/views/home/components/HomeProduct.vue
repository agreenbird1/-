<template>
  <div class="home-product" ref="target">
    <HomePanel :title="good.name" v-for="good in goods" :key="good.id">
      <template v-slot:right>
        <div class="sub">
          <!-- 二级标题 -->
          <RouterLink
            :to="`/category/sub/${good.id}`"
            v-for="subTitle in good.children"
            :key="subTitle.id"
            >{{ subTitle.name }}</RouterLink
          >
        </div>
        <More :path="`/category/${good.id}`" />
      </template>
      <div class="box">
        <!-- 添加路径 -->
        <RouterLink class="cover" :to="`/category/${good.id}`">
          <img :src="good.picture" alt="" />
          <strong class="label">
            <span>{{ good.name }}馆</span>
            <span>{{ good.saleInfo }}</span>
          </strong>
        </RouterLink>
        <ul class="goods-list">
          <!-- 具体商品列表 -->
          <li v-for="subGood in good.goods" :key="subGood.id">
            <HomeGoods :subGood="subGood" />
          </li>
        </ul>
      </div>
    </HomePanel>
  </div>
</template>

<script>
import HomePanel from './HomePanel'
import HomeGoods from './HomeGoods'
import { findGoods } from '@/api/home'
import { getLazyData } from '@/hooks'
export default {
  name: 'HomeProduct',
  components: { HomePanel, HomeGoods },
  setup () {
    // 依然是数据懒加载加载数据
    const { target, result } = getLazyData(findGoods)
    return {
      target,
      goods: result
    }
  }
}
</script>

<style scoped lang='less'>
.home-product {
  background: #fff;
  height: 2900px;
  .sub {
    margin-bottom: 2px;
    a {
      padding: 2px 12px;
      font-size: 16px;
      border-radius: 4px;
      &:hover {
        background: @xtxColor;
        color: #fff;
      }
      &:last-child {
        margin-right: 80px;
      }
    }
  }
  .box {
    display: flex;
    .cover {
      width: 240px;
      height: 610px;
      margin-right: 10px;
      position: relative;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .label {
        width: 188px;
        height: 66px;
        display: flex;
        font-size: 18px;
        color: #fff;
        line-height: 66px;
        font-weight: normal;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translate3d(0, -50%, 0);
        span {
          text-align: center;
          &:first-child {
            width: 76px;
            background: rgba(0, 0, 0, 0.9);
          }
          &:last-child {
            flex: 1;
            background: rgba(0, 0, 0, 0.7);
          }
        }
      }
    }
    .goods-list {
      width: 990px;
      display: flex;
      flex-wrap: wrap;
      li {
        width: 240px;
        height: 300px;
        margin-right: 10px;
        margin-bottom: 10px;
        &:nth-last-child(-n + 4) {
          margin-bottom: 0;
        }
        &:nth-child(4n) {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
