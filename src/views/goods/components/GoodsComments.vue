<template>
  <div class="goods-comment" v-if="com">
    <div class="head">
      <div class="data">
        <p>
          <span>{{ com.salesCount }}</span
          ><span>人购买</span>
        </p>
        <p>
          <span>{{ com.praisePercent }}</span
          ><span>好评率</span>
        </p>
      </div>
      <div class="tags">
        <div class="dt">大家都在说：</div>
        <div class="dd">
          <a
            v-for="(comment, index) in com.tags"
            :key="comment.title"
            href="javascript:;"
            :class="{ active: index === currIndex }"
            @click="changeCurrIndex(index)"
            >{{ comment.title }}({{ comment.tagCount }})</a
          >
        </div>
      </div>
    </div>
    <div class="sort">
      <span>排序：</span>
      <a
        @click="changeSort(null)"
        href="javascript:;"
        :class="{ active: reqParams.sortField === null }"
        >默认</a
      >
      <a
        @click="changeSort('praiseCount')"
        href="javascript:;"
        :class="{ active: reqParams.sortField === 'praiseCount' }"
        >最热</a
      >
      <a
        @click="changeSort('createTime')"
        href="javascript:;"
        :class="{ active: reqParams.sortField === 'createTime' }"
        >最新</a
      >
    </div>
    <!-- 评价列表 -->
    <!-- 列表 -->
    <div class="list" v-if="commentsList">
      <div class="item" v-for="item in commentsList.items" :key="item.id">
        <div class="user">
          <img :src="item.member.avatar" alt="" />
          <span>{{ formatNickname(item.member.nickname) }}</span>
        </div>
        <div class="body">
          <div class="score">
            <i
              v-for="i in item.score"
              :key="i + '1'"
              class="iconfont icon-wjx01"
            ></i>
            <i
              v-for="i in 5 - item.score"
              :key="i + '2'"
              class="iconfont icon-wjx02"
            ></i>
            <span class="attr">{{ formatSpecs(item.orderInfo.specs) }}</span>
          </div>
          <div class="text">
            {{ item.content }}
          </div>
          <div class="time">
            <span>{{ item.createTime }}</span>
            <span class="zan"
              ><i class="iconfont icon-dianzan"></i>
              {{ item.praiseCount }}</span
            >
          </div>
        </div>
      </div>
    </div>
    <Pagination />
  </div>
</template>
<script>
import { ref, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import { findGoodsComments, findGoodsCommentsList } from '@/api/product'

export default {
  name: 'GoodsComments',
  setup () {
    const route = useRoute()
    const com = ref(null)
    // 默认激活的样式
    const currIndex = ref(0)
    findGoodsComments(route.params.id).then(({ result }) => {
      // 默认的评论区有两个tag标签为有图和全部评价
      result.tags.unshift({ title: '有图', tagCount: result.hasPictureCount, type: 'img' })
      result.tags.unshift({ title: '全部评价', tagCount: result.evaluateCount, type: 'all' })
      com.value = result
    })
    const changeCurrIndex = (i) => {
      currIndex.value = i
      // 设置有图和标签条件
      const currTag = com.value.tags[i]
      if (currTag.type === 'all') {
        reqParams.hasPicture = null
        reqParams.tag = null
      } else if (currTag.type === 'img') {
        reqParams.hasPicture = true
        reqParams.tag = null
      } else {
        reqParams.hasPicture = null
        reqParams.tag = currTag.title
      }
      reqParams.page = 1
    }
    const commentsList = ref([])
    // 筛选条件准备
    const reqParams = reactive({
      page: 1,
      pageSize: 10,
      hasPicture: null,
      tag: null,
      sortField: null
    })
    // 排序更改
    const changeSort = (sortField) => {
      reqParams.sortField = sortField
      reqParams.page = 1
    }

    // 定义转换数据的函数（对应vue2.0的过滤器）
    const formatSpecs = (specs) => {
      return specs.reduce((p, c) => `${p} ${c.name}：${c.nameValue}`, '').trim()
    }
    const formatNickname = (nickname) => {
      return nickname.substr(0, 1) + '****' + nickname.substr(-1)
    }
    watch(reqParams, () => {
      findGoodsCommentsList(route.params.id, reqParams).then(data => {
        commentsList.value = data.result
        console.log(commentsList.value)
      })
    }, { immediate: true })
    return {
      com,
      currIndex,
      changeCurrIndex,
      reqParams,
      changeSort,
      formatSpecs,
      formatNickname,
      commentsList
    }
  }
}
</script>
<style scoped lang="less">
.goods-comment {
  .head {
    display: flex;
    padding: 30px 0;
    .data {
      width: 340px;
      display: flex;
      padding: 20px;
      p {
        flex: 1;
        text-align: center;
        span {
          display: block;
          &:first-child {
            font-size: 32px;
            color: @priceColor;
          }
          &:last-child {
            color: #999;
          }
        }
      }
    }
    .tags {
      flex: 1;
      display: flex;
      border-left: 1px solid #f5f5f5;
      .dt {
        font-weight: bold;
        width: 100px;
        text-align: right;
        line-height: 42px;
      }
      .dd {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        > a {
          width: 132px;
          height: 42px;
          margin-left: 20px;
          margin-bottom: 20px;
          border-radius: 4px;
          border: 1px solid #e4e4e4;
          background: #f5f5f5;
          color: #999;
          text-align: center;
          line-height: 40px;
          &:hover {
            border-color: @xtxColor;
            background: lighten(@xtxColor, 50%);
            color: @xtxColor;
          }
          &.active {
            border-color: @xtxColor;
            background: @xtxColor;
            color: #fff;
          }
        }
      }
    }
  }
  .sort {
    height: 60px;
    line-height: 60px;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    margin: 0 20px;
    color: #666;
    > span {
      margin-left: 20px;
    }
    > a {
      margin-left: 30px;
      &.active,
      &:hover {
        color: @xtxColor;
      }
    }
  }
  .list {
    padding: 0 20px;
    .item {
      display: flex;
      padding: 25px 10px;
      border-bottom: 1px solid #f5f5f5;
      .user {
        width: 160px;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
        }
        span {
          padding-left: 10px;
          color: #666;
        }
      }
      .body {
        flex: 1;
        .score {
          line-height: 40px;
          .iconfont {
            color: #ff9240;
            padding-right: 3px;
          }
          .attr {
            padding-left: 10px;
            color: #666;
          }
        }
      }
      .text {
        color: #666;
        line-height: 24px;
      }
      .time {
        color: #999;
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
      }
    }
  }
}
</style>
