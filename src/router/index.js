import { createRouter, createWebHashHistory } from 'vue-router'

// 固定路由
import ConstantRoutes from './modules/constantRoutes'

const router = createRouter({
    history: createWebHashHistory(),
    routes: ConstantRoutes,
    scrollBehavior: () => ({ y: 0 })
})

export default router
