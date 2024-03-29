import http from "./http.js"

let api = 'api'    // 本地 vue.config.js proxy 代理

export default {
  // 所有表的搜索方法
  search(params) {
    return http.get(`/${api}/admin/users/search`, params)
  },
  /**
   * 用户管理
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
  getAllUser(params) {
    return http.get(`/${api}/admin/users/getAllUser`, params)
  },
  // 获取单个用户信息
  getUser(params) {
    return http.post(`/${api}/admin/users/getUser`, params)
  },
  // 删除用户
  deleteUser(params) {
    return http.delete(`/${api}/admin/users/deleteUser`, params)
  },
  // 修改用户信息
  editUser(params) {
    return http.post(`/${api}/admin/users/editUser`, params)
  },
  /**
   * 游戏管理
   */
  // 获取游戏数据
  getGameList() {
    return http.get(`/${api}/admin/games/getGameList`)
  },
  // 获取单个游戏数据
  getGame(params) {
    return http.post(`/${api}/admin/games/getGame`, params)
  },
  editGame(params) {
    return http.post(`/${api}/admin/games/editGame`, params)
  },
  /**
   * 得分管理
   */
  getScoreList() {
    return http.get(`/${api}/admin/score/getScoreList`)
  },
  banScore(params) {
    return http.post(`/${api}/admin/score/banScore`, params)
  },
  /**
   * 评论管理
   */
  getCommentList() {
    return http.get(`/${api}/admin/comments/getCommentList`)
  },
  // 删除对应的用户评论
  deleteComment(params) {
    return http.delete(`/${api}/admin/comments/deleteComment`, params)
  },
  // 置顶评论
  overHead(params) {
    return http.post(`/${api}/admin/comments/overHead`, params)
  }
}