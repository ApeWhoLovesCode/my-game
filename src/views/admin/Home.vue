<template>
  <div class="page-admin-home">
    <div v-for="(item,i) in tabsList" :key="i" class="tabs" :class="`tabitem${i+1}`">
      <router-link :to="item.path">
        <div class="tabTo" @click="routerChange(item.table)">{{item.tab}}</div>
      </router-link>
    </div>
    <div class="search">
      <el-input v-model="searchVal" placeholder="请输入名称" class="search-inp" clearable @keyup.native.enter="search()" />
      <el-button type="primary" size="mini" class="search-btn" @click="search()">搜索</el-button>
    </div>
    <div class="top-tab">
      <el-tooltip effect="dark" content="全屏 / 退出全屏" placement="bottom">
        <div v-if="!isFullScreen" class="top-tab-item iconfont icon-quanping" @click="fullScreen(true)"></div>
        <div v-else class="top-tab-item iconfont icon-cancel-full-screen" @click="fullScreen(false)"></div>
      </el-tooltip>
      <el-tooltip effect="dark" content="退出登录" placement="bottom">
        <div class="top-tab-item iconfont icon-tuichudenglu" @click="logout"></div>
      </el-tooltip>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import adminApi from "@/utils/adminApi";
import "vue-custom-scrollbar/dist/vueScrollbar.css"
import {mapState} from 'vuex'
export default {
  data() {
    return {
      tabsList: [
        {tab: '用户管理', path: '/admin/user', table: 'user'},
        {tab: '游戏管理', path: '/admin/game', table: 'gamedata'},
        {tab: '评论管理', path: '/admin/comment', table: 'comments'},
        {tab: '得分管理', path: '/admin/score', table: 'gamescore'}
      ],
      isFullScreen: false,
      searchVal: '',
      // 代表现在要搜索的是哪个表
      tableType: 'welcome'
    }
  },
  computed: {
    ...mapState(['adminUser'])
  },
  created() {
    if(!this.adminUser || this.adminUser.token !== 'lhh_admin_token_07_11') {
      this.$router.push('/admin/login')
      return
    } 
    // this.tableType = this.tabsList.filter(item => item.path === this.$route.fullPath)[0].table
  },
  methods: {
    routerChange(type) {
      this.tableType = type
    },
    async search() {
      if(this.tableType === 'welcome' || this.tableType === 'gamescore' || this.tableType ===  'comments') {
        this.$message('此页面的搜索功能还未开发！敬请期待')
        return
      }
      this.$store.dispatch('adminSearch', { searchVal: this.searchVal, tableType: this.tableType })
    },
    // 全屏
    fullScreen(isFull) {
      this.isFullScreen = !this.isFullScreen
      if(isFull) {
        const docElm = document.documentElement
        if (docElm.requestFullscreen) docElm.requestFullscreen()
        else if (docElm.msRequestFullscreen) docElm.msRequestFullscreen()
        else if (docElm.mozRequestFullScreen) docElm.mozRequestFullScreen()
        else if (docElm.webkitRequestFullScreen) docElm.webkitRequestFullScreen()
      } else {
        if (document.exitFullscreen) document.exitFullscreen()
        else if (document.msExitFullscreen) document.msExitFullscreen()
        else if (document.mozCancelFullScreen) document.mozCancelFullScreen()
        else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen()
      }
    },
    logout() {
      this.$confirm("您确定要退出管理员端吗？", "退出登录", {
        confirmButtonText: "确定",
        cancelButtonText: "不退了",
        center: true,
      })
      .then(async () => {
        // 清除用户 后端和前端的 登录状态
        await adminApi.logout(); // 后端
        this.$store.commit("setAdminUser", null); // 前端
        this.$router.push("/admin/Login");
        this.$message({
          type: "info",
          message: "已退出登录",
          duration: 1000,
        });
      })
      .catch(() => {});
    }
  },
}
</script>

<style scoped lang="scss">
.page-admin-home {
  position: relative;
  min-width: 1300px;
  min-height: 800px;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(to right, #24243e, #332d77, #24243e);
  .search {
    box-sizing: border-box;
    position: absolute;
    // top: 1%;
    left: 280px;
    width: 300px;
    height: 50px;
    display: flex;
    background: rgba(216, 216, 216, 0.3);
    padding: 8px 12px;
    border-radius: 8px;
    animation: search .8s ease forwards;
    .search-inp {
      height: 100%;
      ::v-deep .el-input__inner {
        height: 100%;
      }
    }
    .search-btn {
      margin-left: 10px;
      background: #6a73da;
      border: none;
    }
    .search-btn:hover {
      opacity: .9;
    }
  }
  @keyframes search {
    0% {
      opacity: 0;
      top: -50px;
    }
    100% {
      opacity: 1;
      top: 1%;
    }
  }
  .top-tab {
    position: absolute;
    top: 1.8%;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    height: 40px;
    background: rgba(216, 216, 216, 0.3);
    border-radius: 30px;
    padding: 0 20px;
    .top-tab-item {
      font-size: 20px;
      margin-right: 15px;
      padding: 6px;
      border-radius: 5px;
      color: rgb(216, 216, 216);
      cursor: pointer;
    }
    .top-tab-item:hover {
      color: #fff;
      background: rgba(216, 216, 216, 0.5);
    }
    .top-tab-item:last-child {
      margin-right: 0;
    }
  }
  ::v-deep .content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    height: 85%;
    // background: #c4c2e0;
    background: rgba(255, 255, 255, .3);
    box-sizing: border-box;
    padding: 1% 100px;
    // 修改和删除按钮的样式
    .el-button--primary {
      background-color: #8ea0f3;
      border-color:#8ea0f3; 
    }
    .el-button--primary:hover {
      opacity: .8;
    }
  }
  .tabs {
    position: absolute;
    box-sizing: border-box;
    z-index: 1;
    // width: 200px;
    // height: 200px;
    // font-size: 24px;
    cursor: pointer;
    overflow: hidden;
    box-shadow: 0 0 20px 5px rgba(113, 92, 185, 0.5);
    user-select: none;
    animation: tab 1s ease forwards;
    .tabTo {
      width: 100%;
      height: 100%;
    }
    @keyframes tab {
      0% {
        font-size: 12px;
        width: 0px;
        height: 0px;
      }
      100% {
        font-size: 24px;
        width: 200px;
        height: 200px;
      }
    }
  }
  .tabs:hover {
    opacity: .9;
  }
  .tabitem1 {
    left: 0;
    top: 0;
    border-radius: 0 0 100% 0;
    padding-left: 30px;
    line-height: 150px;
    background-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
  .tabitem2 {
    right: 0;
    top: 0;
    border-radius: 0 0 0 100%;
    text-align: right;
    padding-right: 30px;
    line-height: 150px;
    background-image: linear-gradient(225deg, #667eea 0%, #764ba2 100%);
  }
  .tabitem3 {
    right: 0;
    bottom: 0;
    border-radius: 100% 0 0 0;
    text-align: right;
    padding-right: 30px;
    line-height: 250px;
    background-image: linear-gradient(315deg, #667eea 0%, #764ba2 100%);
  }
  .tabitem4 {
    left: 0;
    bottom: 0;
    border-radius: 0 100% 0 0;
    padding-left: 30px;
    line-height: 250px;
    background-image: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  }
  
}
</style>
