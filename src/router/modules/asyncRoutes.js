import customizationRoutes from './customizationRoutes'

// 动态路由（异步路由、导航栏路由）
const asyncRoutes = [
    {
        meta: {
            title: '勿删',
            icon: 'sidebar-default'
        },
        children: [...customizationRoutes]
    }
]

export default asyncRoutes
