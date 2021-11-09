// 用户登录等api

import request from '@/utils/request'

/**
 * 返回用户个人信息
 * @param {String} account - 用户名
 * @param {String} password - 密码
 */
export const accountLogin = (account, password) => {
  return request('/login', 'post', { account, password })
}

/**
 * @param {String} mobile - 手机号
 */
export const codeLogin = (mobile) => {
  return request('/login/code', 'get', { mobile })
}

/**
 * 返回用户个人信息
 * @param {String} account - 用户名
 * @param {String} code - 密码
 */
export const mobileLogin = (mobile, code) => {
  return request('/login/code', 'post', { mobile, code })
}

/**
 * QQ验证
 * @param {String} unionId - 第三方唯一标识
 * @param {String} source - 请求登录类型 1=> pc端
 * @returns
 */
export const qqLogin = (unionId, source = 1) => {
  return request('/login/social', 'post', { unionId, source })
}

/**
 * 获取QQ绑定的时候短信验证码
 * @param {String} mobile - 手机号
 * @returns promise
 */
export const qqBindCode = (mobile) => {
  return request('/login/social/code', 'get', { mobile })
}

/**
 * QQ登录-绑定帐号
 * @param {String} unionId - QQ唯一标识，openId
 * @param {String} mobile - 手机号
 * @param {String} code - 验证码
 * @returns
 */
export const userQQBindLogin = (unionId, mobile, code) => {
  return request('/login/social/bind', 'post', { unionId, mobile, code })
}

/**
 * 用户名唯一性校验
 * @param {String} account
 * @returns Boolean值，true为冲突
 */
export const userAccountCheck = (account) => {
  return request('/register/check', 'GET', { account })
}

/**
 * 注册时候完善信息
 * @param {String} mobile - 手机号
 */
export const patchLogin = (mobile) => {
  return request('/register/code', 'get', { mobile })
}

/**
 * QQ登录-注册完善帐号信息
 * @param {String} unionId - QQ唯一标识，openId
 * @param {String} mobile - 手机号
 * @param {String} code - 验证码
 * @param {String} account - 账户
 * @param {String} password - 密码
 * @returns
 */
export const userQQPatchLogin = (unionId, mobile, code, account, password) => {
  return request(`/login/social/${unionId}/complement`, 'post', { account, password, mobile, code })
}
