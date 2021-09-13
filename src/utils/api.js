import http from "./http.js"

// let api = 'http://120.77.241.208:3000'  // 服务器 代理
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
  }
}