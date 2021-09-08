import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/util/cookie'

const state = () => ({
    name: '',
    avatar: '',
    token: getToken() || '',
    permissions: []
})

const getters = {
    isLogin: state => !!state.token
}

const actions = {
    login({ commit }, { username, password }) {
        return new Promise(async resolve => {
            const { data } = await login({ username, password })
            commit('SET_TOKEN', data.token)
            setToken(data.token)
            resolve()
        })
    },
    logout({ commit }) {
        return new Promise(async resolve => {
            await logout()
            commit('RESET_STATE')
            commit('menu/invalidRoutes', null, { root: true })
            commit('menu/removeRoutes', null, { root: true })
            resolve()
        })
    },
    getInfo({ commit }) {
        return new Promise(async resolve => {
            const {
                data: { avatar, realname, roleList }
            } = await getInfo()

            commit('SET_AVATAR', avatar)
            commit('SET_NAME', realname)
            commit('SET_PERMISSIONS', roleList)
            resolve()
        })
    },
    resetToken({ commit }) {
        return new Promise(resolve => {
            commit('RESET_STATE')
            resolve()
        })
    }
}

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_NAME: (state, name) => {
        state.name = name
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar
    },
    RESET_STATE(state) {
        removeToken() // must remove  token  first
        state.name = ''
        state.avatar = ''
        state.token = ''
    },
    SET_PERMISSIONS(state, permissions) {
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
