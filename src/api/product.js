import request from '@/utils/request'

/**
 * @param { String } pid 商品id
 * @returns 返回商品详情数据
 */
export const findProduct = (pid) => {
  return request('/goods', 'get', { id: pid })
}
