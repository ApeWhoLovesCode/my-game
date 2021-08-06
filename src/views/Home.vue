<template>
  <el-container class="home">
    <el-header>
      <div class="headerLeft">MY-GAME</div>
      <div class="headerCenter">
        <input class="searchInp" type="text" placeholder="Search..." />
        <el-button
          class="searchBtn"
          type="primary"
          icon="el-icon-search"
        ></el-button>
      </div>
      <div class="headerRight">
        <i class="iconfont icon-denglu"></i>
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
          <Game-item
            v-for="(item, i) in gamesList"
            :key="item.id"
            :gameItem="item"
            @click.native="gameItemClick(item.id)"
          />
        </vue-custom-scrollbar>
      </el-aside>
      <el-main>
        <el-tabs
          v-model="elTabsValue"
          type="card"
          closable
          @tab-remove="removeTab"
        >
          <el-tab-pane
            v-for="(item, index) in gameTabsList"
            :key="item.id"
            :label="item.name"
            :name="item.ref"
          >
            {{ item.name }}
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>

    <!-- 飞机大战 -->
    <!-- v-show="gamesList[0].display" -->
    <PlaneWar
      v-if="gamesList[0].begin"
      :ref="gamesList[0].ref"
      :gameItem="gamesList[0]"
      @small="small"
      :class="{
        small: gamesList[0].small == 1,
        nosmall: gamesList[0].small == 2,
      }"
    />
    <!-- 俄罗斯方块 -->
    <Tetris
      v-if="gamesList[1].begin"
      :ref="gamesList[1].ref"
      :gameItem="gamesList[1]"
      @gameoverFn="gameoverFn"
      @restartFn="restartFn"
      @small="small"
      :class="{
        small: gamesList[1].small == 1,
        nosmall: gamesList[1].small == 2,
      }"
    />
    <!-- <myPop
      v-for="item in gamePops"
      :ref="item.popRef"
      :outside="item.outside"
      @click.native="popClick(item.popRef)"
    /> -->
  </el-container>
</template>

<script>
import gameData from "@/utils/gameData.js";
import vueCustomScrollbar from "vue-custom-scrollbar";
import "vue-custom-scrollbar/dist/vueScrollbar.css";

import GameItem from "@/components/gameItem/GameItem.vue";
import myPop from "@/components/myPop/myPop.vue";
import PlaneWar from "@/components/PlaneWar.vue";
import Tetris from "@/components/Tetris.vue";
export default {
  name: "home",
  components: {
    GameItem,
    vueCustomScrollbar,
    myPop,
    PlaneWar,
    Tetris,
  },
  props: {},
  data() {
    return {
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
    };
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    // 点击了游戏
    gameItemClick(id) {
      for (let item of this.gamesList) {
        if (id == item.id) {
          item.begin = true;
          setTimeout(() => {
            this.$refs[item.ref].popshow();
          }, 100);
        }
      }

      // if (this.gamePops.length != 0) {
      //   this.gamePops.forEach((item) => (item.outside = false));
      // }
      // let popRef = "pop" + i;
      // this.gamePops.push({ popRef: "pop" + i, outside: true });
      // setTimeout(() => {
      //   this.$refs[popRef][0].popshow();
      // }, 100);
    },
    // 游戏结束的回调
    gameoverFn(id) {
      console.log("游戏结束");
      for (let item of this.gamesList) {
        if (id == item.id) {
          item.begin = false;
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
      this.elTabsValue = gameItem.ref;
      // 往标签页添加缩小的游戏数据
      if (this.gameTabsList.indexOf(gameItem) == -1) {
        this.gameTabsList.push(gameItem);
      }

      // 将对应的游戏隐藏
      for (let item of this.gamesList) {
        if (gameItem.id == item.id) {
          item.small = 1;
        }
      }
    },
    // 删除游戏缩小的标签页
    removeTab(targetName) {
      for (let item of this.gamesList) {
        if (item.ref == targetName) {
          item.small = 2;
        }
      }
      for (let i in this.gameTabsList) {
        if (this.gameTabsList[i].ref == targetName) {
          this.gameTabsList.splice(i, 1);
        }
      }
    },
    // 点击了弹出层
    popClick(ref) {
      // this.gamePops.forEach((item, i, arr) => {
      //   if (item.popRef == ref) {
      //     arr[i].outside = true;
      //   } else {
      //     arr[i].outside = false;
      //   }
      // });
    },
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
.el-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #010120;
  color: #fff;
  padding: 0 30px;
  .headerLeft {
    font-size: 22px;
    color: #4f03e0;
    font-weight: bold;
    user-select: none;
    cursor: pointer;
  }
  .headerCenter {
    height: 35px;
    display: flex;
    align-items: center;
    .searchInp {
      width: 400px;
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
    .iconfont {
      color: #aaa;
      font-size: 32px;
      cursor: pointer;
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
  100% {
    opacity: 0;
    top: 20%;
    visibility: hidden;
    transform: translate(-50%, -50%) scale(0.3);
  }
}
@keyframes nosmall {
  0% {
    opacity: 0;
    top: 20%;
    transform: translate(-50%, -50%) scale(0.3);
  }
  50% {
    top: 50%;
    transform: translate(-50%, -50%) scale(1.05);
  }
  75% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(0.9);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
}
</style>