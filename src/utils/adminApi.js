import http from "./http.js"

let api = 'api'    // 本地 vue.config.js proxy 代理

export default {
  // 登录
  login(params) {
    return http.post(`/${api}/admin/users/login`, params)
  },
  // 退出登录
  logout() {
    return http.get(`/${api}/admin/users/logout`)
  },
  // 获取所有用户信息
  getAllUser() {
    return http.get(`/${api}/admin/users/getAllUser`)
  },
  // 获取单个用户信息
  getUser(params) {
    return http.post(`/${api}/admin/users/getUser`,params)
  },
  // 修改用户信息
  editUser(params) {
    return http.post(`/${api}/admin/users/editUser`, params)
  },
}