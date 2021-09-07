import MultilevelMenuExample from './multilevel.menu.example'
import BreadcrumbExample from './breadcrumb.example'

// 动态路由（异步路由、导航栏路由）
const asyncRoutes = [
    {
        meta: {
            title: '勿删',
            icon: 'sidebar-default'
        },
        children: [MultilevelMenuExample, BreadcrumbExample]
    }
]

export default asyncRoutes
