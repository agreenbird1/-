import request from '@/utils/request'

/**
 * @param { String } pid 商品id
 * @returns 返回商品详情数据
 */
export const findProduct = (pid) => {
  return request('/goods', 'get', { id: pid })
}

/**
 * 获取商品同类推荐-未传入ID为猜喜欢
 * @param {String} id - 商品ID
 * @param {Number} limit - 获取条数
 */
export const findRelGoods = (id, limit = 16) => {
  return request('/goods/relevant', 'get', { id, limit })
}

/**
 * 获取热销推荐商品
 * @param {String} id - 商品ID
 * @param {Number} limit - 获取条数
 * @param {Number} type - 热销类型，1为24小时，2为周榜，3为总榜，默认为1
 */
export const findGoodsHot = ({ id, limit = 3, type = 1 }) => {
  return request('/goods/hot', 'get', { id, limit, type })
}

/**
 * 获取商品品论信息
 * @param {String} id - 商品ID
 */
export const findGoodsComments = (id) => {
  return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate
  `, 'get')
}

/**
 * 获取商品品论信息
 * @param {String} id - 商品ID
 * @param {Object} params - 请求参数信息
 */
export const findGoodsCommentsList = (id, params) => {
  return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate/page`, 'get', params)
}
