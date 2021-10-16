// 关于 home 页面的api方法
import request from '@/utils/request'

/**
 * @param {*} limit 限制请求brand的数量
 * @returns 返回推荐品牌列目
 */
export const findBrands = (limit = 6) => {
  return request('/home/brand', 'get', { limit })
}
