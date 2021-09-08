/**
 * @description: 项目管理api
 */
import { getFetch, postFetch } from '@/util/request'

// 上传接口
export const getPolicy = (params, config) => postFetch('/file/getPolicy', params, config)

// 获取项目列表
export const getProjectList = (params, config) => getFetch('/common/api/34-project_list/admin_project', params, config)

// 获取编辑详情
export const getProjectDetail = (params, config) => getFetch('/common/api/32-project_get/admin_project', params, config)

// 产品选择列表
export const getProductSelectList = (params, config) =>
    getFetch('/common/api/33-product_list/admin_project', params, config)

// 删除项目
export const delProjectItem = (params, config) => postFetch('/common/api/90-project_del/admin_project', params, config)

// 禁用/启用项目
export const updateProjectStatus = (params, config) =>
    postFetch('/common/api/20-project_status_upd/admin_project', params, config)

// 添加项目
export const addProjectItem = (params, config) => postFetch('/common/api/10-project_add/admin_project', params, config)

// 编辑项目
export const updateProjectItem = (params, config) =>
    postFetch('/common/api/20-project_upd/admin_project', params, config)

// 门户配置详情
export const getProjectConfigDetail = (params, config) =>
    getFetch('/common/api/32-project_info/admin_project', params, config)

// 门户配置-基础配置保存
export const saveProjectBaseConfig = (params, config) =>
    postFetch('/common/api/20-project_base_config_save/admin_project', params, config)

// 门户配置-页面配置保存
export const saveProjectPageConfig = (params, config) =>
    postFetch('/common/api/20-project_page_config_save/admin_project', params, config)

// 门户配置-功能权限配置保存
export const saveProjectAuthConfig = (params, config) =>
    postFetch('/common/api/20-project_auth_config_save/admin_project', params, config)

// 门户配置-基础配置查询
export const getProjectBaseConfig = (params, config) =>
    getFetch('/common/api/32-project_base_config_get/admin_project', params, config)

// 门户配置-页面配置查询
export const getProjectPageConfig = (params, config) =>
    getFetch('/common/api/33-project_page_config_list/admin_project', params, config)

// 门户配置-功能权限配置查询
export const getProjectAuthConfig = (params, config) =>
    getFetch('/common/api/33-project_auth_config_list/admin_project', params, config)
