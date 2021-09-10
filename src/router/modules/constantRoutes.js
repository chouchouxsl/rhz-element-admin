import store from '@/store'

const constantRoutes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login.vue'),
        meta: {
            title: '登录'
        }
    },
    {
        path: '/',
        component: () => import('@/layout/index.vue'),
        redirect: '/dashboard',
        children: [
            {
                path: 'dashboard',
                name: 'dashboard',
                component: () => import('@/views/index.vue'),
                meta: {
                    title: () => store.state.settings.dashboardTitle
                }
            },
            {
                path: 'reload',
                name: 'reload',
                component: () => import('@/views/reload.vue')
            }
        ]
    }
]

export default constantRoutes
