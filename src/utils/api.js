import http from "./http.js"

export default {
  // 注册
  register(params) {
    return http.get(`/api/user/register/${params.name}/${params.pass}`)
  },
  // 登录
  login(params) {
    return http.post(`/api/user/login/${params.name}/${params.pass}`)
  },
  // 获取评论数据
  getCommentList() {
    return http.get(`/api/games/listComment`)
  }
}