import request from '@/utils/request'

/**
 * 获取商品的specs和skus
 * @param {String} skuId - 商品SKUID
 * @returns Promise
 */
export const getSpecsAndSkus = (skuId) => {
  return request(`/goods/sku/${skuId}`, 'get')
}

/**
 * 登录后合并购物车
 * @param {Array<Object>} cartList
 * @returns 合并成功的信息
 */
export const mergeCart = (cartList) => {
  return request('/member/cart/merge', 'POST', cartList)
}

/**
 *
 * @returns 登陆后获取的购物车列表信息
 */
export const findCart = () => {
  return request('/member/cart', 'GET')
}

/**
 * 加入购物车
 * @param {String} skuId - 商品SKUID
 * @param {Integer} count - 商品数量
 * @returns Promise
 */
export const insertCart = ({ skuId, count }) => {
  return request('/member/cart', 'post', { skuId, count })
}

/**
 * 删除商品（支持批量删除）
 * @param {Array<string>} ids - skuId集合
 * @returns Promise
 */
export const deleteCart = (ids) => {
  return request('/member/cart', 'delete', { ids })
}

/**
 * 修改购物车商品的状态和数量
 * @param {String} goods.skuId - 商品sku
 * @param {Boolean} goods.selected - 选中状态
 * @param {Integer} goods.count - 商品数量
 * @returns Promise
 */
export const updateCart = (goods) => {
  return request('/member/cart/' + goods.skuId, 'put', goods)
}
