import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css' // progress bar style
// 动态路由（异步路由、导航栏路由）
import asyncRoutes from '@/router/modules/asyncRoutes'

const lastRoute = {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/404.vue'),
    meta: {
        title: '找不到页面'
    }
}

const {
    state: { settings, menu },
    getters,
    dispatch,
    commit
} = store

router.beforeEach(async (to, from, next) => {
    settings.enableProgress && NProgress.start()
    // 已经登录，但还没根据权限动态生成并挂载路由
    if (getters['user/isLogin'] && !menu.isGenerate) {
        await dispatch('user/getInfo')

        let accessRoutes = []
        if (!settings.enableBackendReturnRoute) {
            accessRoutes = await dispatch('menu/generateRoutesAtFront', {
                asyncRoutes,
                currentPath: to.path
            })
        } else {
            accessRoutes = await dispatch('menu/generateRoutesAtBack', {
                currentPath: to.path
            })
        }

        accessRoutes.push(lastRoute)
        let removeRoutes = []
        accessRoutes.forEach(route => {
            removeRoutes.push(router.addRoute(route))
        })
        // 记录的 accessRoutes 路由数据，在登出时会使用到，不使用 router.removeRoute 是考虑配置的路由可能不一定有设置 name ，则通过调用 router.addRoute() 返回的回调进行删除
        commit('menu/setCurrentRemoveRoutes', removeRoutes)

        next({ ...to, replace: true })
    } else {
        if (menu.isGenerate && settings.menuMode !== 'single') {
            commit('menu/setHeaderActived', to.path)
        }
        if (getters['user/isLogin']) {
            if (to.name) {
                if (to.matched.length !== 0) {
                    // 如果已登录状态下，进入登录页会强制跳转到控制台页面
                    if (to.name == 'login') {
                        next({ name: 'dashboard', replace: true })
                    } else if (
                        !settings.enableDashboard &&
                        to.name == 'dashboard' &&
                        getters['menu/sidebarRoutes'].length !== 0
                    ) {
                        // 如果未开启控制台页面，则默认进入侧边栏导航第一个模块
                        next({
                            path: getters['menu/sidebarRoutes'][0].path,
                            replace: true
                        })
                    } else {
                        next()
                    }
                } else {
                    // 如果是通过 name 跳转，并且 name 对应的路由没有权限时，需要做这步处理，手动指向到 404 页面
                    next({ path: '/404' })
                }
            } else {
                next()
            }
        } else {
            to.name != 'login'
                ? next({
                      name: 'login',
                      query: {
                          redirect: to.fullPath
                      }
                  })
                : next()
        }
    }
})

router.afterEach((to, from) => {
    settings.enableProgress && NProgress.done()
    // 设置页面 title
    to.meta.title && commit('settings/setTitle', typeof to.meta.title === 'function' ? to.meta.title() : to.meta.title)
    // 判断当前页面是否开启缓存，如果开启，则将当前页面的 name 信息存入 keep-alive 全局状态

    console.log(to)
    if (to.meta.cache) {
        let componentName = to.matched[to.matched.length - 1].components.default.name
        if (componentName) {
            to.matched.forEach(item => {
                if (item.components.default.name && item.components.default.name != 'Layout') {
                    commit('keepAlive/add', item.components.default.name)
                }
            })
        } else {
            console.warn('该页面组件未设置组件名，会导致缓存失效，请检查')
        }
    }
    // 判断离开页面是否开启缓存，如果开启，则根据缓存规则判断是否需要清空 keep-alive 全局状态里离开页面的 name 信息
    if (from.meta.cache) {
        let componentName = from.matched[from.matched.length - 1].components.default.name
        // 通过 meta.cache 判断针对哪些页面进行缓存
        switch (typeof from.meta.cache) {
            case 'string':
                if (from.meta.cache != to.name) {
                    commit('keepAlive/remove', componentName)
                }
                break
            case 'object':
                if (!from.meta.cache.includes(to.name)) {
                    commit('keepAlive/remove', componentName)
                }
                break
        }
        // 如果进入的是 reload 页面，则也将离开页面的缓存清空
        if (to.name == 'reload') {
            commit('keepAlive/remove', componentName)
        }
    }
})
