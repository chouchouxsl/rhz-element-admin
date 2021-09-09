import auth from './modules/auth'

export default app => {
    // 权限
    auth(app)
}
