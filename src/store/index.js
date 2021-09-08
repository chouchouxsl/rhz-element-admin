import { createStore, createLogger } from 'vuex'

const modules = {}
const modulesContext = import.meta.globEager('./modules/*.js')
console.log('modulesContext :>> ', import.meta)
for (const path in modulesContext) {
    modules[path.replace(/(\.\/modules\/|\.js)/g, '')] = modulesContext[path].default
}

export default createStore({
    modules: modules,
    strict: !import.meta.env.PROD
    // plugins: !import.meta.env.PROD ? [createLogger()] : []
})
