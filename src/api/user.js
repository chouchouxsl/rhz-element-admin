/**
 * @description: 用户信息
 */
import { getFetch, postFetch } from '@/util/request'

// 登录
export const login = (params, config = { isLogin: true }) => postFetch('/sys/login', params, config)

// 登出
export const logout = (params, config) => postFetch('/sys/logout', params, config)

// 用户信息
export const getInfo = (params, config) => getFetch('/sys/user/info', params, config)
