/**
 * @description: 产品管理api
 */
import { getFetch, postFetch } from '@/util/request'

// 获取产品列表
export const getProductList = (params, config) => getFetch('/common/api/34-product_list/admin_product', params, config)

// 删除产品
export const delProductItem = (params, config) => postFetch('/common/api/90-product_del/admin_product', params, config)

// 删除之前
export const delProductBefore = (params, config) =>
    getFetch('/common/api/32-product_del_before/admin_product', params, config)

// 禁用/启用产品
export const updateProductStatus = (params, config) =>
    postFetch('/common/api/20-product_status_upd/admin_product', params, config)

// 设置排序
export const setProductSortItem = (params, config) =>
    postFetch('/common/api/20-product_sort_upd/admin_product', params, config)

// 添加产品
export const addProductItem = (params, config) => postFetch('/common/api/10-product_add/admin_product', params, config)

// 编辑产品
export const updateProductItem = (params, config) =>
    postFetch('/common/api/20-product_upd/admin_product', params, config)

// 查询功能树
export const getFunctionTree = (params, config) =>
    getFetch('/common/api/33-function_tree/admin_product', params, config)

// 编辑回显
export const getProductDetail = (params, config) => getFetch('/common/api/32-product_get/admin_product', params, config)
