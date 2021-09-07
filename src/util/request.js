import qs from 'qs'
import axios from 'axios'
import { ElMessageBox, ElMessage } from 'element-plus'
import store from '@/store'
import { getToken } from '@/util/cookie'

axios.defaults.headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
}
// create an axios instance
const service = axios.create({
    baseURL: import.meta.env.VITE_APP_API_BASEURL, // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 5000 * 6 // request timeout
})

// request interceptor
service.interceptors.request.use(
    config => {
        // 对分页参数处理
        if (config.params?.pageNum && config.params?.pageSize) {
            const { pageNum, pageSize } = config.params

            Object.assign(config.params, {
                '_pageable.page': pageNum - 1,
                '_pageable.size': pageSize
            })

            delete config.params.pageNum
            delete config.params.pageSize

            console.log('params :>> ', config.params)
        }
        // do something before request is sent
        if (config.method === 'post' && !config.isLogin) {
            console.log({ config })
            if (config.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
                config.data = qs.stringify(config.data)
            }
        }

        if (store.state.user.token) {
            // let each request carry token
            // ['X-Token'] is a custom headers key
            // please modify it according to the actual situation
            config.headers['X-Access-Token'] = getToken()
        }
        return config
    },
    error => {
        // do something with request error
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    response => {
        const res = response.data

        // if the custom code is not 20000, it is judged as an error.
        if (res.code !== 200) {
            ElMessage({
                message: res.message || 'Error',
                type: 'error',
                duration: 5 * 1000
            })

            // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
            if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
                // to re-login
                ElMessageBox.confirm(
                    'You have been logged out, you can cancel to stay on this page, or log in again',
                    'Confirm logout',
                    {
                        confirmButtonText: 'Re-Login',
                        cancelButtonText: 'Cancel',
                        type: 'warning'
                    }
                ).then(() => {
                    store.dispatch('user/resetToken').then(() => {
                        location.reload()
                    })
                })
            }
            return Promise.reject(new Error(res.message || 'Error'))
        } else {
            return res
        }
    },
    error => {
        console.log('err' + error) // for debug
        ElMessage({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

// get请求
export function getFetch(url, params, config = {}) {
    return service({
        url,
        params,
        method: 'get',
        ...config
    })
}

// post请求
export function postFetch(url, data, config = {}) {
    return service({
        url,
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        ...config
    })
}

export default service
