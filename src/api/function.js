/**
 * @description: 功能管理api
 */
import { getFetch, postFetch } from '@/util/request'

// 获取功能列表
export const getFuncList = (params, config) => getFetch('/common/api/34-function_list/admin_function', params, config)

// 获取编辑详情
export const getFuncDetail = (params, config) => getFetch('/common/api/30-function_get/admin_function', params, config)

// 删除功能
export const delFuncItem = (params, config) => postFetch('/common/api/90-function_del/admin_function', params, config)

// 删除之前
export const delFunctionBefore = (params, config) =>
    getFetch('/common/api/32-function_del_before/admin_function', params, config)

// 禁用/启用功能
export const updateFuncStatus = (params, config) =>
    postFetch('/common/api/20-function_status_upd/admin_function', params, config)

// 添加功能
export const addFuncItem = (params, config) => postFetch('/common/api/10-function_add/admin_function', params, config)

// 编辑功能
export const updateFuncItem = (params, config) =>
    postFetch('/common/api/20-function_upd/admin_function', params, config)

// 父级模块列表
export const getParentFunctionList = (params, config) =>
    getFetch('/common/api/33-parent_function_list/admin_function', params, config)

// 联动功能列表_树
export const getFunctionTree = (params, config) =>
    getFetch('/common/api/33-function_tree/admin_function', params, config)
