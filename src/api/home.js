// 关于 home 页面的api方法
import request from '@/utils/request'

/**
 * @param {*} limit 限制请求brand的数量
 * @returns Promise 返回推荐品牌列目
 */
export const findBrands = (limit = 6) => {
  return request('/home/brand', 'get', { limit })
}

/**
 * 返回轮播图banners
 * @returns Promise
 */
export const findBanner = () => {
  return request('/home/banner', 'get')
}

/**
 * 返回新鲜好物
 * @returns Promise
 */
export const findNew = () => {
  return request('/home/new', 'get')
}

/**
 * 返回爆款推荐
 * @returns Promise
 */
export const findHot = () => {
  return request('/home/hot', 'get')
}

/**
 * 返回品牌区块
 * @returns Promise
 */
export const findGoods = () => {
  return request('/home/goods', 'get')
}

/**
 * 返回最新专题
 * @returns Promise
 */
export const findSpecial = () => {
  return request('/home/special', 'get')
}
