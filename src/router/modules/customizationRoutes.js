const Layout = () => import('@/layout/index.vue')

export default [
    {
        path: '/project',
        component: Layout,
        name: 'project',
        redirect: '/project/index',
        meta: { title: '项目管理', icon: 'el-icon-menu' },
        children: [
            {
                path: 'index',
                name: 'project',
                component: () => import('@/views/project/index'),
                meta: { title: '项目管理' }
            },
            {
                path: 'addItem',
                name: 'addItem',
                component: () => import('@/views/project/addItem'),
                meta: { title: '新增项目', sidebar: false }
            },
            {
                path: 'editItem/:id',
                name: 'editItem',
                component: () => import('@/views/project/addItem'),
                meta: { title: '编辑项目', sidebar: false }
            },
            {
                path: 'portalConfiguration/:id',
                name: 'portalConfiguration',
                component: () => import('@/views/project/portalConfiguration'),
                meta: { title: '门户配置', sidebar: false }
            }
        ]
    },
    {
        path: '/product',
        component: Layout,
        name: 'product',
        redirect: '/product/index',
        meta: { title: '产品管理', icon: 'el-icon-mobile' },
        children: [
            {
                path: 'index',
                name: 'product',
                component: () => import('@/views/product/index'),
                meta: { title: '产品管理' }
            },
            {
                path: 'add',
                name: 'addProduct',
                component: () => import('@/views/product/add'),
                meta: { title: '新增产品', sidebar: false }
            },
            {
                path: 'edit/:id',
                name: 'editProduct',
                component: () => import('@/views/product/add'),
                meta: { title: '编辑产品', sidebar: false }
            }
        ]
    },
    {
        path: '/function',
        component: Layout,
        name: 'function',
        redirect: '/function/index',
        meta: { title: '功能管理', icon: 'el-icon-setting' },
        children: [
            {
                path: 'index',
                name: 'function',
                component: () => import('@/views/function/index'),
                meta: { title: '功能管理' }
            },
            {
                path: 'add',
                name: 'addFunction',
                component: () => import('@/views/function/add'),
                meta: { title: '新增功能', sidebar: false }
            },
            {
                path: 'edit/:id',
                name: 'editFunction',
                component: () => import('@/views/function/add'),
                meta: { title: '编辑功能', sidebar: false }
            }
        ]
    }
]
