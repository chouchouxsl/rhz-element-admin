import { createApp } from 'vue'
import App from './App.vue'
import store from '@/store'
import router from '@/router'

// 路由守卫
import './routerGuard'
// ElementPlus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 加载 svg 图标
import 'virtual:svg-icons-register'
// 全局样式
import '@/assets/styles/globals.scss'
// windi css库
import 'virtual:windi.css'
// 工具
import globalProperties from '@/util/global.properties'
// 自定义指令
import directive from '@/directive'

const $App = createApp(App)

$App.use(store)
    .use(router)
    .use(directive)
    .use(globalProperties)
    .use(ElementPlus, {
        size: store.state.settings.elementSize
    })
    .mount('#app')
