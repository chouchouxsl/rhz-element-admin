/* 
两种方式按需引入
*/
import styleImport from 'vite-plugin-style-import'
// import vitePluginImport from 'vite-plugin-babel-import'

export default function createElement() {
    return styleImport({
        libs: [
            {
                libraryName: 'element-plus',
                esModule: true,
                resolveStyle: name => {
                    return `element-plus/lib/theme-chalk/${name}.css`
                },
                resolveComponent: name => {
                    return `element-plus/lib/${name}`
                }
            }
        ]
    })

    // return vitePluginImport([
    //     {
    //         libraryName: 'element-plus',
    //         libraryDirectory: 'es',
    //         style(name) {
    //             return `element-plus/lib/theme-chalk/${name}.css`;
    //         },
    //     },
    // ])
}
