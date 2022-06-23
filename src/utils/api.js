import http from "./http.js"

let api = 'api'    // 本地 vue.config.js proxy 代理

export default {
  // 注册
  register(params) {
    return http.post(`/${api}/users/register`, params)
  },
  // 登录
  login(params) {
    return http.post(`/${api}/users/login`, params)
  },
  logout() {
    return http.get(`/${api}/users/logout`)
  },
  // 修改用户信息
  editUser(params) {
    return http.post(`/${api}/users/editUser`, params)
  },
  // 修改密码
  editPass(params) {
    return http.post(`/${api}/users/editPassword`, params)
  },
  // 获取游戏数据
  getGameData() {
    return http.get(`/${api}/games/gameData`)
  },
  // 上传得分
  updateScore(params) {
    return http.post(`/${api}/games/setScore`, params)
  },
  // 获取排行榜数据
  getRankList(gameId) {
    return http.get(`/${api}/games/rankList`, gameId)
  },
  // 分享得分
  shareScore(params) {
    return http.post(`/${api}/comments/shareScore`, params)
  },
  // 搜索
  search(name) {
    return http.get(`/${api}/games/search`, name)
  },
  // 获取评论数据
  getComments(id) {
    return http.get(`/${api}/comments/commentsData`, id)
  },
  // 发送评论
  sendMsg(params) {
    return http.post(`/${api}/comments/sendMsg`, params)
  },
  // 删除对应的用户评论
  deleteMsg(params) {
    return http.delete(`/${api}/comments/deleteMsg`, params)
  },
  // 点赞
  like(params) {
    return http.post(`/${api}/comments/like`, params)
  },
  // 点踩
  noLike(params) {
    return http.post(`/${api}/comments/noLike`, params)
  },
}