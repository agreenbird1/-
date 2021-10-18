<template>
  <div class="home-category" @mouseleave="categoryId = null">
    <ul class="menu">
      <!-- 鼠标移入时候显示弹层，将数据输入 -->
      <li
        :class="{ active: categoryId === category.id }"
        v-for="category in menuList"
        :key="category.id"
        @mouseenter="categoryId = category.id"
      >
        <!-- 前面一个是一级标题，后面一个是二级标题 -->
        <RouterLink :to="`/category/${category.id}`">
          {{ category.name }}
        </RouterLink>
        <!-- 当children属性存在时才显示 -->
        <template v-if="category.children">
          <RouterLink
            :to="`/category/sub/${sub.id}`"
            v-for="sub in category.children"
            :key="sub.id"
            >{{ sub.name }}</RouterLink
          >
        </template>
        <!-- children 属性不存在时用骨架效果 -->
        <template v-else>
          <Skeleton
            width="50px"
            height="20px"
            bg="rgba(255,255,255,.2)"
            style="margin-right: 5px"
          />
          <Skeleton width="40px" height="20px" bg="rgba(255,255,255,.2)" />
        </template>
      </li>
    </ul>
    <!-- 鼠标移入显示弹层 -->
    <!-- 弹层 -->
    <div class="layer">
      <!-- 根据id判断 -->
      <h4 v-if="LayerThickness">
        {{ LayerThickness.id === "brand" ? "品牌" : "分类" }}推荐
        <small>根据您的购买或浏览记录推荐</small>
      </h4>
      <ul
        v-if="
          LayerThickness && LayerThickness.goods && LayerThickness.goods.length
        "
      >
        <li v-for="item in LayerThickness.goods" :key="item.id">
          <RouterLink to="/">
            <img :src="item.picture" alt="" />
            <div class="info">
              <p class="name ellipsis-2">{{ item.name }}</p>
              <p class="desc ellipsis">{{ item.desc }}</p>
              <p class="price"><i>¥</i>{{ item.price }}</p>
            </div>
          </RouterLink>
        </li>
      </ul>
      <ul
        v-if="
          LayerThickness &&
          LayerThickness.brands &&
          LayerThickness.brands.length
        "
      >
        <li class="brand" v-for="item in LayerThickness.brands" :key="item.id">
          <RouterLink to="/">
            <img :src="item.picture" alt="" />
            <div class="info">
              <p class="place">
                <i class="iconfont icon-dingwei"></i>{{ item.place }}
              </p>
              <p class="name ellipsis">{{ item.name }}</p>
              <p class="desc ellipsis-2">{{ item.desc }}</p>
            </div>
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// 加载之初没有显示时候需要显示 loading 效果优化用户体验
import { computed, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { findBrands } from '@/api/home'
export default {
  name: 'HomeCategory',
  setup () {
    const store = useStore()
    const brand = reactive({
      id: 'brand',
      name: '品牌',
      children: [{ id: 'brand-chilren', name: '品牌推荐' }],
      brands: []
    })
    // 获取分类菜单
    const menuList = computed(() => {
      const list = store.state.category.list.map(category => {
        return {
          // 左侧一级导航推荐两个子级目录，所以需要对多余的children属性进行截取
          ...category,
          children: category.children && category.children.slice(0, 2)
        }
      })
      // 品牌推荐目录为人工添假数据
      list.push(brand)
      return list
    })
    // 当前选择的目录的id
    const categoryId = ref(null)
    // 定义一个数组存放弹层数据，当前的选择的数据
    // 当里面有brands数据的时候证明这是最后一个
    const LayerThickness = computed(() => {
      return menuList.value.find(item => item.id === categoryId.value)
    })
    // 获取品牌推荐数据
    findBrands().then(data => {
      brand.brands = data.result
    })
    return {
      menuList,
      LayerThickness,
      categoryId
    }
  }
}
</script>

<style scoped lang='less'>
.home-category {
  width: 250px;
  height: 500px;
  background: rgba(0, 0, 0, 0.8);
  position: relative;
  z-index: 99;
  .menu {
    li {
      padding-left: 40px;
      height: 50px;
      line-height: 50px;
      &:hover,
      &.active {
        background: @xtxColor;
      }
      a {
        margin-right: 4px;
        color: #fff;
        &:first-child {
          font-size: 16px;
        }
      }
    }
  }
  .layer {
    width: 990px;
    height: 500px;
    background: rgba(255, 255, 255, 0.8);
    position: absolute;
    left: 250px;
    top: 0;
    display: none;
    padding: 0 15px;
    h4 {
      font-size: 20px;
      font-weight: normal;
      line-height: 80px;
      small {
        font-size: 16px;
        color: #666;
      }
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      li {
        width: 310px;
        height: 120px;
        margin-right: 15px;
        margin-bottom: 15px;
        border: 1px solid #eee;
        border-radius: 4px;
        background: #fff;
        &:nth-child(3n) {
          margin-right: 0;
        }
        a {
          display: flex;
          width: 100%;
          height: 100%;
          align-items: center;
          padding: 10px;
          &:hover {
            background: #e3f9f4;
          }
          img {
            width: 95px;
            height: 95px;
          }
          .info {
            padding-left: 10px;
            line-height: 24px;
            width: 190px;
            .name {
              font-size: 16px;
              color: #666;
            }
            .desc {
              color: #999;
            }
            .price {
              font-size: 22px;
              color: @priceColor;
              i {
                font-size: 16px;
              }
            }
          }
        }
      }
      li.brand {
        height: 180px;
        a {
          align-items: flex-start;
          img {
            width: 120px;
            height: 160px;
          }
          .info {
            p {
              margin-top: 8px;
            }
            .place {
              color: #999;
            }
          }
        }
      }
    }
  }
  &:hover {
    .layer {
      display: block;
    }
  }
}
.skeleton {
  animation: fade 1s linear infinite alternate;
}
@keyframes fade {
  from {
    opacity: 0.2;
  }
  to {
    opacity: 1;
  }
}
</style>
