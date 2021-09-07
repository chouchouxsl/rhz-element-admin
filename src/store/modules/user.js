import api from '@/api'

const state = () => ({
    name: localStorage.account || '',
    token: localStorage.token || '',
    permissions: []
})

const getters = {
    isLogin: state => !!state.token
}

const actions = {
    login({ commit }, data) {
        return new Promise((resolve, reject) => {
            // 通过 mock 进行登录
            api.post('member/login', data, {
                baseURL: '/mock/'
            })
                .then(res => {
                    commit('setUserData', res.data)
                    resolve()
                })
                .catch(error => {
                    reject(error)
                })
        })
    },
    logout({ commit }) {
        commit('removeUserData')
        commit('menu/invalidRoutes', null, { root: true })
        commit('menu/removeRoutes', null, { root: true })
    },
    // 获取我的权限
    getPermissions({ state, commit }) {
        return new Promise(resolve => {
            // 通过 mock 获取权限
            api.get('member/permission', {
                baseURL: '/mock/',
                params: {
                    account: state.account
                }
            }).then(res => {
                commit('setPermissions', res.data.permissions)
                resolve(res.data.permissions)
            })
        })
    }
}

const mutations = {
    setUserData(state, data) {
        localStorage.setItem('account', data.account)
        localStorage.setItem('token', data.token)
        state.name = data.account
        state.token = data.token
    },
    removeUserData(state) {
        localStorage.removeItem('account')
        localStorage.removeItem('token')
        state.name = ''
        state.token = ''
    },
    setPermissions(state, permissions) {
        state.permissions = permissions
    }
}

export default {
    namespaced: true,
    state,
    actions,
    getters,
    mutations
}
