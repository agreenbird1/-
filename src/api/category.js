import request from '@/utils/request'

/**
 * 获取头部所有分类
 * @return
 */
export const findAllCategories = () => {
  return request('/home/category/head', 'get')
}
