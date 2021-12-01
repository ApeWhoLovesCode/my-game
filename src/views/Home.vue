<template>
  <el-container class="home">
    <el-header>
      <div class="headerLeft">
        <span class="gameName">MY-GAME</span>
        <span class="userName">{{ timeHello }}，{{ gameUser.name }}</span>
      </div>
      <div class="headerCenter">
        <!-- <input class="searchInp" type="text" placeholder="Search..." /> -->
        <el-autocomplete
          class="searchInp"
          v-model="searchString"
          :fetch-suggestions="querySearch"
          placeholder="请输入游戏名"
          :trigger-on-focus="false"
          @select="handleSelect"
          @keyup.enter.native="searchConfirm"
          clearable
        >
          <template slot-scope="{ item }">
            <div class="hot_search">
              
            </div>
          </template>
        </el-autocomplete>
        <el-button
          class="searchBtn"
          type="primary"
          icon="el-icon-search"
        ></el-button>
      </div>
      <div class="headerRight">
        <!-- 开 / 关方向键位特效 -->
        <el-tooltip
          effect="dark"
          content="开 / 关方向键位特效"
          placement="bottom"
        >
          <el-switch
            v-model="isKeyShow"
            active-color="#7052db"
            inactive-color="#aa9cc5"
          >
          </el-switch>
        </el-tooltip>
        <!-- 背景音乐 -->
        <audio ref="audio" :src="musicUrl" autoplay></audio>
        <el-tooltip effect="dark" content="播放 / 暂停歌曲" placement="bottom">
          <span
            class="iconfont music"
            :class="
              isMusic ? 'icon-mn_shengyin_fill' : 'icon-mn_shengyinwu_fill'
            "
            @click="getMusic"
          ></span>
        </el-tooltip>
        <!-- 社区 -->
        <el-tooltip effect="dark" content="社区" placement="bottom">
          <span
            @click="toCommunity"
            class="community iconfont icon-menu_sqhd2"
          ></span>
        </el-tooltip>
        <el-tooltip effect="dark" content="全屏 / 退出全屏" placement="bottom">
          <div v-if="!isFullScreen" class="full-screen iconfont icon-quanping" @click="fullScreen(true)"></div>
          <div v-else class="full-screen iconfont icon-cancel-full-screen" @click="fullScreen(false)"></div>
        </el-tooltip>
        <!-- 登录 / 退出 -->
        <el-popover
          placement="top"
          width="160"
          v-model="islogout"
          trigger="hover"
        >
          <div class="logout-wrap">
            <el-button class="userInfo" size="small" @click="editUser"
              >个人信息</el-button
            >
            <el-button class="logout" @click="logout" size="small"
              >退出登录</el-button
            >
          </div>
          <!-- <i slot="reference" class="iconfont icon-denglu"></i> -->
          <div slot="reference" class="avatar">
            <img v-if="gameUser.avatar" :src="gameUser.avatar" />
            <img v-else src="@/assets/img/user.png" alt="">
          </div>
        </el-popover>
      </div>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :class="isFold ? 'asideNotFold' : 'asideFold'">
        <el-button
          class="foldingBtn"
          :class="isFold ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
          type="success"
          @click="isFold = !isFold"
        ></el-button>
        <vue-custom-scrollbar class="scroll-area">
          <el-tooltip
            placement="right"
            v-for="(item, i) in tabGamesList"
            :key="item.id"
          >
            <!-- 鼠标移过去显示的游戏规则 -->
            <div slot="content">
              <div class="rules">规则：{{ item.rules }}</div>
            </div>
            <Game-item
              :style="{ height: isFold ? '' : '17%' }"
              :gameItem="item"
              @click.native="gameItemClick(item.id)"
            />
          </el-tooltip>
        </vue-custom-scrollbar>
      </el-aside>
      <!-- 主要内容区域 -->
      <el-main>
        <!-- 评论区 -->
        <router-view :isCommunityShow="isCommunityShow"></router-view>
        <el-tabs
          v-model="elTabsValue"
          type="card"
          closable
          @tab-remove="removeTab"
          @tab-click="tabClick"
        >
          <el-tab-pane
            v-for="(item, index) in gameTabsList"
            :key="item.id"
            :label="item.name"
            :name="item.ref"
          >
            <div :ref="item.ref + 1" class="smallBox"></div>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>

    <EditUSerInfo
      :isEditUserInfo.sync="isEditUserInfo"
      @closeUserInfo="closeUserInfo"
    />

    <template v-if="gamesList">
      <!-- 飞机大战 -->
      <PlaneWar
        v-if="gamesList[0] && gamesList[0].begin"
        :ref="gamesList[0].ref"
        :class="{
          small: gamesList[0].small == 1,
          nosmall: gamesList[0].small == 2,
        }"
        :gameItem="gamesList[0]"
        :isPx="gamesList[0].small == 1 && gamesList[0].delay"
        :smallBox="gamesList[0].small == 1 ? smallBox : {}"
        @gameoverFn="gameoverFn"
        @restartFn="restartFn"
        @small="small"
        @click.native="popClick(gamesList[0].id)"
        @updateScore="updateScore(arguments)"
      />
      <!-- 俄罗斯方块 -->
      <Tetris
        v-if="gamesList[1] && gamesList[1].begin"
        :ref="gamesList[1].ref"
        :class="{
          small: gamesList[1].small == 1,
          nosmall: gamesList[1].small == 2,
        }"
        :gameItem="gamesList[1]"
        :isPx="gamesList[1].small == 1 && gamesList[1].delay"
        :smallBox="gamesList[1].small == 1 ? smallBox : {}"
        @gameoverFn="gameoverFn"
        @restartFn="restartFn"
        @small="small"
        @click.native="popClick(gamesList[1].id)"
        @updateScore="updateScore(arguments)"
      />
      <!-- 贪吃蛇 -->
      <Snake
        v-if="gamesList[2] && gamesList[2].begin"
        :ref="gamesList[2].ref"
        :class="{
          small: gamesList[2].small == 1,
          nosmall: gamesList[2].small == 2,
        }"
        :gameItem="gamesList[2]"
        :isPx="gamesList[2].small == 1 && gamesList[2].delay"
        :smallBox="gamesList[2].small == 1 ? smallBox : {}"
        @gameoverFn="gameoverFn"
        @restartFn="restartFn"
        @small="small"
        @click.native="popClick(gamesList[2].id)"
        @updateScore="updateScore(arguments)"
      />
      <!-- 飞翔的小鸟 -->
      <FlyingBrid
        v-if="gamesList[3] && gamesList[3].begin"
        :ref="gamesList[3].ref"
        :class="{
          small: gamesList[3].small == 1,
          nosmall: gamesList[3].small == 2,
        }"
        :gameItem="gamesList[3]"
        :isPx="gamesList[3].small == 1 && gamesList[3].delay"
        :smallBox="gamesList[3].small == 1 ? smallBox : {}"
        @gameoverFn="gameoverFn"
        @restartFn="restartFn"
        @small="small"
        @click.native="popClick(gamesList[3].id)"
        @updateScore="updateScore(arguments)"
      />
      <!-- 2048 -->
      <TwoFour
        v-if="gamesList[4] && gamesList[4].begin"
        :ref="gamesList[4].ref"
        :class="{
          small: gamesList[4].small == 1,
          nosmall: gamesList[4].small == 2,
        }"
        :gameItem="gamesList[4]"
        :isPx="gamesList[4].small == 1 && gamesList[4].delay"
        :smallBox="gamesList[4].small == 1 ? smallBox : {}"
        @gameoverFn="gameoverFn"
        @restartFn="restartFn"
        @small="small"
        @click.native="popClick(gamesList[4].id)"
        @updateScore="updateScore(arguments)"
      />
      <!-- 五子棋 -->
      <GoBang
        v-if="gamesList[5] && gamesList[5].begin"
        :ref="gamesList[5].ref"
        :class="{
          small: gamesList[5].small == 1,
          nosmall: gamesList[5].small == 2,
        }"
        :gameItem="gamesList[5]"
        :isPx="gamesList[5].small == 1 && gamesList[5].delay"
        :smallBox="gamesList[5].small == 1 ? smallBox : {}"
        @gameoverFn="gameoverFn"
        @restartFn="restartFn"
        @small="small"
        @click.native="popClick(gamesList[5].id)"
        @updateScore="updateScore(arguments)"
      />
      <!-- 扫雷 -->
      <MineSweeper
        v-if="gamesList[6] && gamesList[6].begin"
        :ref="gamesList[6].ref"
        :class="{
          small: gamesList[6].small == 1,
          nosmall: gamesList[6].small == 2,
        }"
        :gameItem="gamesList[6]"
        :isPx="gamesList[6].small == 1 && gamesList[6].delay"
        :smallBox="gamesList[6].small == 1 ? smallBox : {}"
        @gameoverFn="gameoverFn"
        @restartFn="restartFn"
        @small="small"
        @click.native="popClick(gamesList[6].id)"
        @updateScore="updateScore(arguments)"
      />
    </template>
    <!-- #endregion -->
    <!-- 方向键位 -->
    <template v-if="isKeyShow">
      <span
        v-show="currentKey == 'left'"
        class="direction iconfont icon-103fangxiang_xiangzuo"
      ></span>
      <span
        v-show="currentKey == 'up'"
        class="direction iconfont icon-100fangxiang_xiangshang"
      ></span>
      <span
        v-show="currentKey == 'right'"
        class="direction iconfont icon-101fangxiang_xiangyou"
      ></span>
      <span
        v-show="currentKey == 'down'"
        class="direction iconfont icon-102fangxiang_xiangxia"
      ></span>
    </template>

    <!-- <EnterTx v-if="isEnterTx" /> -->
  </el-container>
</template>

<script>
// import gameData_local from "@/utils/gameData.js";
import vueCustomScrollbar from "vue-custom-scrollbar";
import "vue-custom-scrollbar/dist/vueScrollbar.css";
import { mapState } from "vuex";
import axios from "axios";
import api from "../utils/api";

import GameItem from "@/components/gameItem/GameItem.vue";
import myPop from "@/components/myPop/myPop.vue";
import EditUSerInfo from "@/components/EditUserInfo.vue";
import PlaneWar from "@/components/PlaneWar.vue";
import Tetris from "@/components/Tetris.vue";
import Snake from "@/components/Snake.vue";
import FlyingBrid from "@/components/FlyingBrid.vue";
import TwoFour from "@/components/2048.vue";
import GoBang from "@/components/GoBang.vue";
import MineSweeper from "@/components/MineSweeper.vue";
import Community from "@/views/Community.vue";
import EnterTx from "@/components/EnterTx.vue";
export default {
  name: "home",
  components: {
    GameItem,
    vueCustomScrollbar,
    myPop,
    PlaneWar,
    Tetris,
    Snake,
    FlyingBrid,
    TwoFour,
    GoBang,
    MineSweeper,
    EditUSerInfo,
    Community,
    EnterTx,
  },
  props: {},
  data() {
    return {
      // 退出的弹出层
      islogout: false,
      // 是否是折叠状态
      isFold: false,
      // 游戏的弹出层
      gamePops: [],
      // 游戏的渲染
      // 左侧 tabs 的数据
      tabGamesList: [], 
      // gamesList: gameData,
      gamesList: [],
      // 游戏标签页的值
      elTabsValue: "",
      // 游戏标签页的数据
      gameTabsList: [],
      // 缩小盒子的宽高
      smallBox: { width: 0, height: 0, left: 0, top: 0 },
      // 点击的是缩小不是盒子
      isSmall: false,
      // 方向键位特效的定时器
      timer: null,
      // 是否先方向键位的特效
      isKeyShow: true,
      // 是否放歌
      isMusic: false,
      musicUrl: "",
      // 修改用户信息弹出层
      isEditUserInfo: false,
      // 用于控制社区出来的动画
      isCommunityShow: true,
      // 隐藏社区路径跳转的定时器
      hideCommunityTime: null,
      // 进入界面的特效
      isEnterTx: true,
      // 是否全屏
      isFullScreen: false,
      searchString: ''
    };
  },
  computed: {
    ...mapState(["gameUser", "currentKey", "timeHello"]),
  },
  watch: {
    currentKey: {
      handler(val) {
        if (val) {
          clearTimeout(this.timer);
          this.timer = setTimeout(() => {
            this.$store.commit("setCurrentKey", "");
          }, 1000);
        }
      },
    },
  },
  mounted() {
    this.getGameList();
    // 1s 后销毁 进入界面的特效
    setTimeout(() => {
      this.isEnterTx = false;
    }, 1000);
  },
  methods: {
    //#region
    // 获取游戏数据
    async getGameList() {
      try {
        const { data: gameData } = await api.getGameData();
        let res = gameData.data
        res.forEach((item) => {
          item.begin = false;
          item.delay = false;
          item.outside = false;
        });
        this.gamesList = res;
        this.tabGamesList = res.filter(item => item.isban === 0)
      } catch (error) {
        this.$message({type:'error',message: '获取游戏数据失败'})
      }
    },
    // 点击了游戏
    gameItemClick(id) {
      // if (this.$route.path == "/home/community") {
      //   this.hideCommunity();
      // }
      for (let item of this.gamesList) {
        if (id == item.id) {
          item.begin = true;
          item.outside = true;
          setTimeout(() => {
            this.$refs[item.ref].popshow();
          }, 100);
        } else {
          item.outside = false;
        }
      }
    },
    // 游戏结束的回调
    gameoverFn(id) {
      // 删除该游戏弹出层
      for (let item of this.gamesList) {
        if (item.id == id) {
          if (item.small == 1) {
            // 删除对应的 tabs
            let index;
            for (let i in this.gameTabsList) {
              if (this.gameTabsList[i].id == id) {
                index = i;
                break;
              }
            }
            this.gameTabsList.splice(index, 1);
          }
          item.begin = false;
          item.delay = false;
          item.outside = false;
          this.$nextTick(() => {
            item.small = 0;
          });
        }
      }
    },
    // 重新开始游戏的回调
    restartFn(id) {
      for (let item of this.gamesList) {
        if (id == item.id) {
          item.begin = false;
          this.$nextTick(() => {
            item.begin = true;
          });
          setTimeout(() => {
            this.$refs[item.ref].popshow();
          }, 100);
        }
      }
    },
    // 游戏缩小的回调
    small(gameItem) {
      // 防止触发点击盒子的事件提高了优先级
      this.isSmall = true;
      this.elTabsValue = gameItem.ref;
      // 往标签页添加缩小的游戏数据
      if (this.gameTabsList.indexOf(gameItem) == -1) {
        this.gameTabsList.push(gameItem);
      }

      // 将对应的游戏隐藏
      for (let item of this.gamesList) {
        if (item.id == gameItem.id) {
          item.small = 1;
        }
      }

      // 恢复点击盒子的事件
      setTimeout(() => (this.isSmall = false), 50);
      setTimeout(() => {
        // 用于延迟动画
        for (let item of this.gamesList) {
          if (item.id == gameItem.id) {
            item.delay = true;
            item.outside = false;
          }
        }
        this.getSmallBox(gameItem.ref);
      }, 600);
    },
    // 获取缩小盒子的大小
    getSmallBox(ref) {
      ref = ref + 1;
      this.smallBox.width = this.$refs[ref][0].offsetWidth;
      this.smallBox.height = this.$refs[ref][0].offsetHeight;
      // 获取距离屏幕边缘的距离
      this.smallBox.left = this.$refs[ref][0].getBoundingClientRect().left;
      this.smallBox.top = this.$refs[ref][0].getBoundingClientRect().top;
    },
    // 点击了标签
    tabClick(e) {
      for (let item of this.gamesList) {
        if (item.name == e.label) {
          item.outside = true;
        } else {
          item.outside = false;
        }
      }
    },
    // 将标签页面回到弹出层状态
    removeTab(targetName) {
      for (let item of this.gamesList) {
        if (item.ref == targetName) {
          item.small = 2;
          item.delay = false;
          item.outside = true;
        } else {
          item.outside = false;
        }
      }
      for (let i in this.gameTabsList) {
        if (this.gameTabsList[i].ref == targetName) {
          this.gameTabsList.splice(i, 1);
        }
      }
    },
    // 点击了弹出层
    popClick(id) {
      if (this.isSmall) return;
      for (let item of this.gamesList) {
        if (item.id == id) {
          item.outside = true;
        } else {
          item.outside = false;
        }
      }
    },
    // 获取歌曲
    async getMusic() {
      this.isMusic = !this.isMusic;
      if (this.isMusic) {
        let { data } = await axios.get("https://api.uomg.com/api/rand.music", {
          params: { sort: "热歌榜", format: "json" },
        });
        this.musicUrl = data.data.url;
      } else {
        // 暂停
        this.$refs.audio.pause();
      }
    },
    // 游戏结束上传得分
    async updateScore(params) {
      let userId = this.gameUser.id;
      let gameId = params[0];
      let score = params[1];
      await api.updateScore({ userId, gameId, score });
    },
    //#endregion

    // 跳转到社区
    toCommunity() {
      let curPath = this.$route.path;
      if (curPath == "/home") {
        this.isCommunityShow = true;
        this.$router.push("/home/community");
      } else {
        this.isCommunityShow = false;
        this.hideCommunity();
      }
    },
    //隐藏社区
    hideCommunity() {
      clearTimeout(this.hideCommunityTime);
      this.hideCommunityTime = setTimeout(() => {
        this.$router.push("/home");
      }, 800);
    },

    // 退出登录
    logout() {
      this.$confirm("您确定要退出当前账号吗？", "退出登录", {
        confirmButtonText: "确定",
        cancelButtonText: "不退了",
        center: true,
      })
        .then(async () => {
          // 清除用户 后端和前端的 登录状态
          await api.logout(); // 后端
          this.$store.commit("setUserInfo", null); // 前端
          this.$router.push("/login");
          this.$message({
            type: "info",
            message: "已退出登录",
            duration: 1000,
          });
        })
        .catch(() => {});
    },
    // 点击了用户信息
    editUser() {
      this.isEditUserInfo = true;
    },
    // 关闭用户信息弹出层
    closeUserInfo() {
      this.isEditUserInfo = false;
    },
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
    // 输入框获取焦点时调用的方法
    querySearch(queryString, cb) {
      let results = this.gamesList.slice(2,5);
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    handleSelect() {

    },
    searchConfirm() {

    }
  },
};
</script>
<style lang='scss' scoped>
.home {
  width: 100vw;
  height: 100vh;
  min-width: 1000px;
  min-height: 700px;
}
// 键盘方向键样式
.direction {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  color: greenyellow;
  z-index: 110;
  opacity: 0;
  animation: direction 1s ease-out;
}
.icon-103fangxiang_xiangzuo {
  top: 50%;
  left: 13%;
  transform: translateY(-50%);
}
.icon-100fangxiang_xiangshang {
  left: 50%;
  top: 10%;
  transform: translateX(-50%);
}
.icon-101fangxiang_xiangyou {
  top: 50%;
  right: 8%;
  transform: translateY(-50%);
}
.icon-102fangxiang_xiangxia {
  left: 50%;
  bottom: 5%;
  transform: translateX(-50%);
}
@keyframes direction {
  0% {
    opacity: 0;
    font-size: 12px;
  }

  20% {
    opacity: 1;
    font-size: 40px;
    text-shadow: 0 0 5px greenyellow;
  }

  100% {
    opacity: 0;
    font-size: 100px;
    text-shadow: 0 0 20px greenyellow;
  }
}

// 游戏规则
.el-tooltip__popper {
  .rules {
    max-width: 120px;
  }
}

// 头部样式
.el-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #010120;
  color: #fff;
  padding: 0 30px;
  .headerLeft {
    width: 280px;
    display: flex;
    align-items: center;
    .gameName {
      width: 120px;
      font-size: 21px;
      color: #4f03e0;
      font-weight: bold;
      user-select: none;
      cursor: pointer;
    }
    .userName {
      padding-left: 10px;
      width: 160px;
      color: #f1f1f1;
      font-size: 14px;
      font-weight: bold;
      user-select: none;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  .headerCenter {
    flex: 1;
    height: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
    ::v-deep .searchInp {
      width: 60%;
      // outline: none;
      .el-input__inner {
        width: 100%;
        height: 35px;
        min-width: 300px;
        border-radius: 9px 0 0 9px;
        color: #fff;
        background: #292929;
        box-shadow: 1px -1px 1px 0px #555 inset;
        border: none;
      }
    }
    .searchBtn {
      background: #4840a3;
      font-size: 16px;
      border: none;
      height: 100%;
      padding: 0 13px;
      border-radius: 0 9px 9px 0;
    }
    .searchBtn:hover {
      opacity: 0.85;
    }
  }
  .headerRight {
    width: 280px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .el-switch {
      padding: 5px;
      border-radius: 8px;
    }
    .el-switch:hover {
      background: rgba(#84828d, 0.3);
    }
    .iconfont {
      margin-left: 12px;
      color: #c2c2c2;
      font-size: 32px;
      cursor: pointer;
      padding: 2px 4px;
      border-radius: 5px;
    }
    .iconfont:hover {
      background: rgba(#84828d, 0.3);
    }
    .community {
      font-size: 28px;
      color: #957ee6;
    }
    .music {
      color: #7052db;
    }
    .full-screen {
      font-size: 23px;
    }
    .avatar {
      display: inline-block;
      margin-left: 12px;
      width: 30px;
      height: 30px;
      cursor: pointer;
      padding: 4px;
      border-radius: 5px;
    }
    .avatar:hover {
      background: rgba(#84828d, 0.3);
    }
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
}

// 侧边栏的样式
.el-aside {
  height: calc(100vh - 60px);
  background: #0f0c29;
  color: #fff;
  // overflow-y: hidden;
  .foldingBtn {
    width: 100%;
    height: 4%;
    padding: 0;
    background: #332d77;
    border: 0;
    font-size: 22px;
  }
  .scroll-area {
    margin: auto;
    width: 100%;
    height: 96%;
  }
  .foldingBtn:hover {
    background: #3c3688;
  }
}
.asideFold {
  animation: asideFold 0.3s linear forwards;
}
.asideNotFold {
  animation: asideNotFold 0.3s linear forwards;
}
@keyframes asideFold {
  0% {
    width: 5%;
  }
  100% {
    width: 12%;
  }
}
@keyframes asideNotFold {
  0% {
    width: 12%;
  }
  100% {
    width: 5%;
  }
}
.el-main {
  position: relative;
  background: linear-gradient(to right, #24243e, #332d77, #24243e);
  color: #fff;
  overflow: hidden;
  ::v-deep .el-tabs {
    height: 100%;
    /* 游戏标签页 */
    .el-tabs__item {
      color: #fff;
      user-select: none;
    }
    /* 激活的颜色 */
    .el-tabs__item.is-active {
      color: #fff;
      font-weight: bold;
      background: linear-gradient(to bottom, #1f1b46, #28235f);
      border-bottom: none;
    }
    .el-tabs__item:hover {
      color: #fff;
      font-weight: bold;
    }
    .el-tabs__content {
      height: calc(98% - 43px);
      overflow: visible;
      .el-tab-pane {
        height: 100%;
        .smallBox {
          width: 100%;
          height: 100%;
          // border: 1px solid #fff;
          border-radius: 10px;
        }
      }
    }
  }
}
// 缩小的样式
.small {
  animation: small 1s ease forwards;
}
.nosmall {
  animation: nosmall 1s ease forwards;
}
@keyframes small {
  0% {
    transform: translate(-50%, -50%) scale(1);
  }
  25% {
    opacity: 1;
    top: 50%;
    transform: translate(-50%, -50%) scale(0.9);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.05);
  }
  80% {
    opacity: 0;
    top: 30%;
    // visibility: hidden;
    transform: translate(-50%, -50%) scale(0.3);
  }
  100% {
    opacity: 1;
    // top: 50%;
    transform: scale(1);
  }
}
@keyframes nosmall {
  0% {
    opacity: 0;
    top: 20%;
    transform: translate(-50%, -50%) scale(0.1);
  }
  65% {
    top: 50%;
    transform: translate(-50%, -50%) scale(1.1);
  }
  80% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(0.9);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
}
</style>