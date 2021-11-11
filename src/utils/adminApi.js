import http from "./http.js"

let api = 'api'    // 本地 vue.config.js proxy 代理

export default {
  /* 
   * 用户
   */
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
  // 删除用户
  deleteUser(params) {
    return http.delete(`/${api}/admin/users/deleteUser`,params)
  },
  // 修改用户信息
  editUser(params) {
    return http.post(`/${api}/admin/users/editUser`, params)
  },
  /* 
  * 游戏
  */
 // 获取游戏数据
 getGameList() {
   return http.get(`/${api}/admin/games/getGameList`)
 },
 
}