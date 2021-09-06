<template>
  <el-container class="home">
    <el-header>
      <div class="headerLeft">
        <span class="gameName">MY-GAME</span>
        <span class="userName">{{ timeHello }}，刘德华</span>
      </div>
      <div class="headerCenter">
        <input class="searchInp" type="text" placeholder="Search..." />
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
          <i slot="reference" class="iconfont icon-denglu"></i>
        </el-popover>
      </div>
    </el-header>
    <el-container>
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
            v-for="(item, i) in gamesList"
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
      <el-main>
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

    <!-- 修改用户信息对话框 -->
    <el-drawer
      title="修改用户信息"
      :visible.sync="isEditUserInfo"
      direction="rtl"
      :before-close="editUserInfoComplete"
    >
      <div class="editUserMain">
        <div class="editUserItem">
          <span>用户名：</span>
          <div class="item-Input">
            <el-input
              v-model="userInfo.name"
              placeholder="请输入用户名:"
              @blur="reviseName"
            ></el-input>
            <p v-show="!userRules.name">用户名应在3-10位之间</p>
          </div>
          <el-button
            type="primary"
            :class="{ completeName: userRules.name }"
            icon="el-icon-check"
            size="mini"
            plain
            circle
            @click="reviseNameOK"
          ></el-button>
        </div>
        <div class="editUserItem">
          <span>电子邮箱：</span>
          <div class="item-Input">
            <el-input
              v-model="userInfo.email"
              placeholder="请输入电子邮箱:"
              @blur="reviseEmail"
            ></el-input>
            <p v-show="!userRules.email">请输入正确的电子邮箱</p>
          </div>
          <el-button
            type="primary"
            :class="{ completeName: userRules.email }"
            icon="el-icon-check"
            size="mini"
            plain
            circle
            @click="reviseEmailOK"
          ></el-button>
        </div>
        <div class="editUserItem">
          <span>原密码：</span>
          <div class="item-Input">
            <el-input
              v-model="userInfo.pass"
              placeholder="请输入原密码:"
              @blur="revisePass"
            ></el-input>
            <p v-show="!userRules.pass">原密码错误</p>
          </div>
          <el-button
            type="primary"
            :class="{ completeName: userRules.pass }"
            icon="el-icon-check"
            size="mini"
            plain
            circle
            @click="revisePassOK"
          ></el-button>
        </div>
        <div class="editUserItem">
          <span>新密码：</span>
          <div class="item-Input">
            <el-input
              v-model="userInfo.newPass"
              placeholder="请输入新密码:"
              @blur="newPassRules"
            ></el-input>
            <p v-show="!userRules.newPass">密码应在3到15位之间</p>
          </div>
          <el-button
            type="primary"
            :class="{ completeName: userRules.newPass }"
            icon="el-icon-check"
            size="mini"
            plain
            circle
            @click="newPassOK"
          ></el-button>
        </div>
      </div>
    </el-drawer>

    <!-- #region -->
    <!-- 飞机大战 -->
    <PlaneWar
      v-if="gamesList[0].begin"
      :ref="gamesList[0].ref"
      :class="{
        small: gamesList[0].small == 1,
        nosmall: gamesList[0].small == 2,
      }"
      :gameItem="gamesList[0]"
      :isPx="gamesList[0].small == 1 && gamesList[0].delay"
      :smallBox="gamesList[0].small == 1 ? smallBox : {}"
      @gameoverFn="gameoverFn"
      @small="small"
      @click.native="popClick(gamesList[0].id)"
    />
    <!-- 俄罗斯方块 -->
    <Tetris
      v-if="gamesList[1].begin"
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
    />
    <!-- 贪吃蛇 -->
    <Snake
      v-if="gamesList[2].begin"
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
    />
    <!-- 飞翔的小鸟 -->
    <FlyingBrid
      v-if="gamesList[3].begin"
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
    />
    <!-- 2048 -->
    <TwoFour
      v-if="gamesList[4].begin"
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
    />
    <!-- 五子棋 -->
    <GoBang
      v-if="gamesList[5].begin"
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
    />
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
  </el-container>
</template>

<script>
import gameData from "@/utils/gameData.js";
import vueCustomScrollbar from "vue-custom-scrollbar";
import "vue-custom-scrollbar/dist/vueScrollbar.css";
import { mapState } from "vuex";
import axios from "axios";

import GameItem from "@/components/gameItem/GameItem.vue";
import myPop from "@/components/myPop/myPop.vue";
import PlaneWar from "@/components/PlaneWar.vue";
import Tetris from "@/components/Tetris.vue";
import Snake from "@/components/Snake.vue";
import FlyingBrid from "@/components/FlyingBrid.vue";
import TwoFour from "@/components/2048.vue";
import GoBang from "@/components/GoBang.vue";
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
      gamesList: gameData,
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
      userInfo: {
        name: "",
        email: "",
        pass: "",
        newPass: "",
      },
      userRules: {
        name: true,
        email: true,
        pass: true,
        newPass: true,
      },
    };
  },
  computed: {
    ...mapState(["currentKey", "timeHello"]),
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
  mounted() {},
  methods: {
    // 获取游戏数据
    getGameList() {},
    // 点击了游戏
    gameItemClick(id) {
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
    // 退出登录
    logout() {
      this.$confirm("确定要退出当前账号吗？", "退出登录", {
        confirmButtonText: "确定",
        cancelButtonText: "不退了",
        center: true,
      })
        .then(() => {
          this.$router.push("/login");
          this.$message({
            type: "info",
            message: "已退出登录",
            duration: 1000,
          });
        })
        .catch(() => {});
    },
    //#region
    // 点击了用户信息
    editUser() {
      this.isEditUserInfo = true;
    },
    // 点击修改用户信息弹出层外部
    editUserInfoComplete() {
      this.$confirm("确认要保存修改吗？", "修改个人信息", {
        center: true,
        iconClass: "el-icon-user",
      })
        .then(() => {
          this.isEditUserInfo = false;
        })
        .catch(() => {
          this.isEditUserInfo = false;
        });
    },
    // 修改姓名
    reviseName() {
      let name = this.userInfo.name;
      // 名字长度少于3位多于10位
      if (name.length < 3 || name.length > 10) {
        this.userRules.name = false;
        return;
      }
      // 名字验证通过
      this.userRules.name = true;
    },
    reviseNameOK() {
      if (!this.userRules.name) {
        return;
      }
      console.log("重命名");
    },
    // 修改电子邮箱
    reviseEmail() {
      //  \w 等价于 [^A-Za-z0-9_]
      var myreg = /^([\w+\.])+@\w+([.]\w+)+$/;
      // /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/

      if (!myreg.test(this.userInfo.email)) {
        this.userRules.email = false;
        return;
      }
      this.userRules.email = true;
    },
    reviseEmailOK() {
      if (!this.userRules.email) {
        return;
      }
      console.log("修改邮箱成功");
    },
    // 修改密码
    revisePass() {},
    revisePassOK() {
      if (!this.userRules.pass) {
        return;
      }
      console.log("修改密码成功");
    },
    // 新密码
    newPassRules() {
      let newPass = this.userInfo.newPass;
      if (newPass.length < 3 || newPass.length > 15) {
        this.userRules.newPass = false;
        return;
      }
      this.userRules.newPass = true;
    },
    newPassOK() {
      // 原密码 和 新密码 的验证规则通过后才可以修改
      if (!this.userRules.pass || !this.userRules.newPass) {
        return;
      }
      console.log("重置密码");
    },
    //#endregion
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
    .searchInp {
      width: 60%;
      min-width: 300px;
      color: #fff;
      padding: 0 15px;
      height: 100%;
      border: none;
      outline: none;
      border-radius: 9px 0 0 9px;
      background: #292929;
      box-shadow: 1px -1px 1px 0px #555 inset;
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
    .iconfont {
      margin-left: 20px;
      color: #aaa;
      font-size: 32px;
      cursor: pointer;
    }
    .music {
      color: #7052db;
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
  background: linear-gradient(to right, #24243e, #332d77, #24243e);
  color: #fff;
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

// 修改用户信息对话框
.editUserMain {
  padding: 20px 25px;
  .editUserItem {
    margin-bottom: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      display: inline-block;
      font-size: 16px;
      white-space: nowrap;
      color: #333;
    }
    .item-Input {
      position: relative;
      flex: 1;
      margin-right: 10px;
      p {
        position: absolute;
        left: 2px;
        bottom: -16px;
        font-size: 12px;
        margin: 0;
        color: red;
      }
    }
    .el-button {
      width: 28px;
      height: 28px;
    }
    .completeName {
      background: #409eff;
      color: #fff;
    }
  }
}
</style>