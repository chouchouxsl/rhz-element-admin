import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

import createRestart from './restart'
import createHtml from './html'
import createComponents from './components'
import createSvgIcon from './svg-icon'
import createMock from './mock'
import createCompression from './compression'
import createSpritesmith from './spritesmith'
import createBanner from './banner'
import createAutoImport from './auto-import'
// import createElement from './element'

export default function createVitePlugins(viteEnv, isBuild = false) {
    const vitePlugins = [vue(), vueJsx()]
    !isBuild && vitePlugins.push(createRestart())
    vitePlugins.push(createHtml(viteEnv, isBuild))
    vitePlugins.push(createComponents())
    vitePlugins.push(createAutoImport())
    vitePlugins.push(createSvgIcon(isBuild))
    vitePlugins.push(createMock())
    isBuild && vitePlugins.push(...createCompression(viteEnv))
    vitePlugins.push(...createSpritesmith(isBuild))
    vitePlugins.push(createBanner())
    // vitePlugins.push(createElement())
    return vitePlugins
}
