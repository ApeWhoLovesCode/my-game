<template>
  <myPop
    class="planepop"
    ref="planeWarPop"
    :playState="playState"
    :width="popWidth"
    :height="popHeight"
    :isPx="isPx"
    :smallBox="isPx ? smallBox : {}"
    :outside="gameItem.outside"
    @popChange="popChange(arguments)"
    @alreadyClose="popClose"
    @small="small"
  >
    <div class="plane-wrap">
      <div v-if="!playState" class="playgame">点击飞机开始游戏</div>
      <img
        ref="mouseImg"
        class="mouse-img"
        :class="mouseMove"
        src="@/assets/img/phone.png"
        @click.stop="getMouse"
        @dblclick="clearAll"
      />
      <!-- 子弹 -->
      <span
        class="bullet"
        v-for="(item, index) in allBullet"
        :key="index"
        :style="{ top: item.y + 'px', left: item.x + 'px' }"
      ></span>
      <!-- 敌人 -->
      <img
        src="@/assets/img/bug.png"
        class="enemy"
        v-for="(item, index) in allEnemy"
        :key="index + 4399"
        :style="{ top: item.y + 'px', left: item.x + 'px' }"
      />
      <!-- 得分 -->
      <div class="score-wrap" v-if="!playGameOver">
        <span class="score">消灭敌军: {{ score }}</span>
        <span class="bugnum">逃脱敌军: {{ bugNum }}</span>
      </div>
    </div>
    <!-- 游戏结束弹出层 -->
    <GameOver
      v-if="theGameOver"
      ref="gameover"
      :gameName="gameItem.name"
      :gameId="gameItem.id"
      @exit="exit"
      @restart="restart"
    >
      <div class="gameoverItem">
        消灭敌军: <i>{{ gOScore.score }}</i>
      </div>
      <div v-if="this.gOScore.score == this.score" class="gameoverItem">
        逃脱敌军: <i>{{ gOScore.bugNum }}</i>
      </div>
      <div v-if="this.gOScore.bugNum == this.bugNum" class="gameoverItem">
        总得分: <i>{{ gOScore.final }}</i>
      </div>
    </GameOver>
  </myPop>
</template>

<script>
// import { minxin } from "@/utils/minxins.js";
import myPop from "@/components/myPop/myPop.vue";
import GameOver from "@/components/GameOver.vue";
export default {
  name: "planeWar",
  components: {
    myPop,
    GameOver,
  },
  // minxins: [minxin],
  props: {
    gameItem: {
      type: Object,
      default() {
        return {};
      },
    },
    isPx: {
      type: Boolean,
      default: false,
    },
    smallBox: {
      type: Object,
      require: false,
    },
  },
  data() {
    return {
      // 弹出层的宽高 %
      popWidth: 40,
      popHeight: 75,
      // 游戏状态
      playState: false,
      // 游戏结束
      playGameOver: true,
      theGameOver: false,
      // 子弹
      allBullet: [],
      // 子弹速度
      bulletSpeed: 5,
      // 子弹发射的时间间隔
      bulletMoveTime: 400,
      // 子弹计时器
      bulletTimer: null,
      // 子弹数量计时器
      bulletNumTimer: null,
      // 臭虫
      allEnemy: [],
      // 臭虫速度
      enemySpeed: 3,
      // 臭虫的出现间隔时间
      enemyComeTime: 1200,
      // 每击败一只臭虫的得分
      enemyScore: 10,
      // 敌人计时器
      enemyTimer: null,
      // 敌人数量计时器
      enemyNumTimer: null,
      // 鼠标对象
      mouseEvent: { x: 0, y: 0 },
      // 顶部的位置 navbar
      topPosition: 30,
      // 浏览器窗口宽度高度
      windowWidth: 0,
      windowHeight: 0,
      windowLeft: 0,
      windowTop: 0,
      // 取消上次延时未执行的方法，用于点击事件和双击
      clickTime: null,
      // 窗口变化的防抖
      windowTime: null,
      // 得分
      score: 0,
      // 逃脱的 bug 数
      bugNum: 0,
      // 游戏结束计算得分定时器
      gOTimer: null,
      // 游戏结束显示得分
      gOScore: { score: 0, bugNum: 0, final: 0 },
    };
  },
  computed: {
    // 最终得分
    finalScore() {
      return this.score - this.bugNum > 0 ? this.score - this.bugNum : 0;
    },
  },
  watch: {
    // 监听游戏开始状态
    playState(val) {
      if (!val) {
        this.stopBulletShot();
      }
    },
    // 监听子弹的位置变化
    allBullet: {
      handler: function (e) {
        if (e[0] && e[0].y && e[0].y <= this.topPosition) {
          // console.log(0 + ":到顶了");
          e.splice(0, 1);
          this.bulletMove();
        }
      },
      // 使用deep属性，如果对象内发生了变化就会触发该方法
      deep: true,
    },
    // 监听臭虫的位置变化
    allEnemy: {
      handler: function (e) {
        if (e[0] && e[0].y && e[0].y >= this.windowHeight) {
          e.splice(0, 1);
          this.enemyCome();
          this.bugNum++;
        }
        e.forEach((item, i, arr) => {
          // 遍历如果子弹和触碰到臭虫就销毁
          this.allBullet.forEach((item2, i2, arr2) => {
            if (
              item2.y >= item.y &&
              item2.y <= item.y + 30 &&
              item2.x >= item.x &&
              item2.x <= item.x + 30
            ) {
              arr.splice(i, 1);
              arr2.splice(i2, 1);
              this.score += this.enemyScore;
            }
          });
          // 遍历如果飞机触碰了臭虫游戏结束
          if (
            this.mouseEvent.y >= item.y - 20 &&
            this.mouseEvent.y <= item.y + 50 &&
            this.mouseEvent.x >= item.x - 20 &&
            this.mouseEvent.x <= item.x + 50
          ) {
            this.clearAll();
          }
          // 遍历从缩小界面返回弹出层时，删除越界的臭虫
          if (e[i] && e[i].x && e[i].x >= this.windowWidth) {
            e.splice(i, 1);
            this.enemyCome();
          }
        });
      },
      deep: true,
    },
    // 监听得分，增加臭虫和子弹
    score(val, oldval) {
      if (parseInt(val / 100) != parseInt(oldval / 100)) {
        this.enemySpeed++;
      }
    },
    gameItem: {
      handler(val) {
        // 监听到从缩小状态回到弹出层状态，重新获取弹出层信息
        if (val.small == 2) {
          setTimeout(() => {
            this.getPopInfo();
          }, 1100);
        }
      },
      deep: true,
    },
  },
  mounted() {
    setTimeout(() => {
      this.getPopInfo();
    }, 800); // 动画时间是 0.6s 防止获取不准确

    // 监听浏览器窗口大小变化
    let that = this;
    window.addEventListener("resize", function () {
      clearTimeout(this.windowTime);
      this.windowTime = setTimeout(() => {
        that.getPopInfo();
      }, 200);
    });
  },
  methods: {
    // 缩小
    small() {
      this.$emit("small", this.gameItem);
      setTimeout(() => {
        // 获取弹出层容器的宽度高度
        this.windowWidth = this.$refs.planeWarPop.$el.offsetWidth - 30;
        this.windowHeight = this.$refs.planeWarPop.$el.offsetHeight - 30;
        // 缩小的时候弹出层的 translate 50% 已经没有了
        this.windowLeft = this.$refs.planeWarPop.$el.offsetLeft;
        this.windowTop = this.$refs.planeWarPop.$el.offsetTop;
      }, 1100);
    },
    // 弹出层在移动发出的事件
    popChange(arg) {
      // console.log(arg[0], arg[1]);
      this.windowLeft += arg[0];
      this.windowTop += arg[1];
    },
    popshow() {
      this.$refs.planeWarPop.popshow();
    },
    // 获取弹出层的 宽高 和 上左距离 等信息
    getPopInfo() {
      // 获取弹出层容器的宽度高度
      this.windowWidth = this.$refs.planeWarPop.$el.offsetWidth - 30;
      this.windowHeight = this.$refs.planeWarPop.$el.offsetHeight - 30;
      // 由于 弹出层使用了 translate 50% 所有要获取回之前的 left 和 top
      this.windowLeft =
        this.$refs.planeWarPop.$el.offsetLeft * (1 - this.popWidth / 100);
      this.windowTop =
        this.$refs.planeWarPop.$el.offsetTop * (1 - this.popHeight / 100);
      // console.log("this.windowLeft:", this.windowLeft);
    },
    // 点击判断是否是游戏状态
    getMouse() {
      clearTimeout(this.clickTime);
      let event = window.event;
      this.clickTime = setTimeout(() => {
        if (!this.playState) {
          this.promptMessage();
          // 获取开始时候的子弹位置
          this.mouseEvent.x = event.pageX - this.windowLeft;
          this.mouseEvent.y = event.pageY - this.windowTop;
          this.addBullet();
          this.addEnemy();

          // 添加飞机跟随鼠标移动事件
          document.addEventListener("mousemove", this.mouseMove);

          // 开启增加子弹、增加敌人定时器
          this.addBulletNumTimer();
          this.addEnemyNumTimer();

          this.playState = true;
          this.playGameOver = false;
        } else {
          // 移除飞机跟随鼠标移动事件
          document.removeEventListener("mousemove", this.mouseMove, false);
          this.playState = false;
        }
      }, 200);
    },
    // 控制鼠标移动
    mouseMove(e) {
      let wLeft = this.windowLeft;
      let wTop = this.windowTop;
      // 超出弹出层范围，暂停游戏
      if (
        e.pageX < wLeft ||
        e.pageX > wLeft + this.windowWidth + 30 ||
        e.pageY < wTop ||
        e.pageY > wTop + this.windowHeight + 30
      ) {
        // 移除飞机跟随鼠标移动事件
        document.removeEventListener("mousemove", this.mouseMove, false);
        this.playState = false;
      }
      // 减去 弹出层距离屏幕左边的距离
      this.mouseEvent.x = e.pageX - wLeft;
      this.mouseEvent.y = e.pageY - wTop;

      this.$refs.mouseImg.style.left = e.pageX - 25 - wLeft + "px";
      this.$refs.mouseImg.style.top = e.pageY - 25 - wTop + "px";
    },
    // 添加子弹
    addBullet() {
      this.allBullet.push({
        x: this.mouseEvent.x - 1,
        y: this.mouseEvent.y - this.bulletSpeed - 30,
      });
      this.bulletMove();
    },
    // 添加敌人
    addEnemy() {
      // 生产一个在窗口范围内的整数
      let x = Math.round(Math.random() * this.windowWidth);
      this.allEnemy.push({
        x: x,
        y: this.topPosition,
      });
      this.enemyCome();
    },
    // 子弹移动计时器
    bulletMove() {
      clearInterval(this.bulletTimer);
      this.bulletTimer = setInterval(() => {
        this.allBullet.forEach((item, index, arr) => {
          arr[index].y -= this.bulletSpeed;
        });
      }, 50);
    },
    // 添加子弹计时器
    addBulletNumTimer() {
      this.bulletNumTimer = setInterval(() => {
        this.addBullet();
      }, this.bulletMoveTime);
    },

    /**
     * 敌人来了
     * */
    enemyCome() {
      clearInterval(this.enemyTimer);
      this.enemyTimer = setInterval(() => {
        this.allEnemy.forEach((item, index, arr) => {
          arr[index].y += this.enemySpeed;
        });
      }, 50);
    },
    // 添加敌人计时器
    addEnemyNumTimer() {
      this.enemyNumTimer = setInterval(() => {
        this.addEnemy();
      }, this.enemyComeTime);
    },
    // 停止子弹射击
    stopBulletShot() {
      clearInterval(this.bulletTimer);
      clearInterval(this.bulletNumTimer);
      clearInterval(this.enemyTimer);
      clearInterval(this.enemyNumTimer);
    },
    // 双击游戏结束
    clearAll() {
      this.theGameOver = true;
      clearTimeout(this.clickTime);
      this.stopBulletShot();
      this.playState = false;
      this.allBullet = [];
      this.allEnemy = [];
      // 移除飞机跟随鼠标移动事件
      document.removeEventListener("mousemove", this.mouseMove, false);

      this.$nextTick(() => {
        this.$refs.gameover.popshow();
        // 发送游戏结束事件，上传最高分到数据库
        this.$emit("updateScore", this.gameItem.id, this.finalScore);
        this.scoreShow();
      });
    },
    // 得分分段式显示
    scoreShow() {
      setTimeout(() => {
        // 增加的值 控制在 1 秒
        let addScore = this.score >= 100 ? parseInt(this.score / 100) : 1;
        let addBugNum = this.bugNum >= 100 ? parseInt(this.bugNum / 100) : 1;
        let addFinal =
          this.finalScore >= 100 ? parseInt(this.finalScore / 100) : 1;

        this.playGameOver = true;
        this.gOTimer = setInterval(() => {
          if (this.gOScore.score != this.score) {
            this.gOScore.score += addScore;
          } else {
            if (this.gOScore.bugNum != this.bugNum) {
              this.gOScore.bugNum += addBugNum;
            } else {
              if (this.gOScore.final != this.finalScore) {
                this.gOScore.final += addFinal;
              } else {
                clearInterval(this.gOTimer);
              }
            }
          }
        }, 10);
      }, 200);
    },
    // 退出游戏
    exit() {
      this.stopBulletShot();
      this.$refs.planeWarPop.popclose();
      this.score = 0;
      this.bugNum = 0;
      for (let key of Object.keys(this.gOScore)) {
        this.gOScore[key] = 0;
      }
      this.$emit("gameoverFn", this.gameItem.id);
    },
    // 重新开始游戏
    restart() {
      this.stopBulletShot();
      this.$emit("restartFn", this.gameItem.id);
      /* this.$refs.gameover.popclose();
      this.score = 0;
      this.bugNum = 0;
      for (let key of Object.keys(this.gOScore)) {
        this.gOScore[key] = 0;
      } */
    },
    // 点击了关闭按钮的回调
    popClose() {
      clearTimeout(this.clickTime);
      this.stopBulletShot();
      this.playState = false;
      this.allBullet = [];
      this.allEnemy = [];
      this.score = 0;
      this.bugNum = 0;
    },
    // 提示信息
    promptMessage() {
      this.$message({
        // 可关闭
        showClose: true,
        message: "单击飞机暂停，双击飞机结束游戏噢!",
        // 持续时间
        duration: "2000",
        // Message 距离窗口顶部的偏移量
        offset: 10,
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.plane-wrap {
  position: relative;
}
.playgame {
  position: absolute;
  left: 40%;
  top: 200px;
  width: 60px;
  font-size: 14px;
  color: #00a1d6;
}
.mouse-img {
  position: absolute;
  left: 40%;
  top: 240px;
  width: 50px;
  height: 50px;
  z-index: 2;
  cursor: default;
}
.bullet {
  position: absolute;
  left: 40%;
  top: 140px;
  width: 3px;
  height: 10px;
  border-top-left-radius: 50%;
  border-top-right-radius: 50%;
  /* background: #efbe50; */
  background-image: linear-gradient(#f3dd61, #e0b244);
  z-index: 2;
}
.enemy {
  position: absolute;
  width: 30px;
  height: 30px;
  z-index: 2;
  transform: rotateZ(180deg);
}
.score-wrap {
  position: absolute;
  top: 10px;
  left: 10px;
  color: #3d5970;
  font-size: 16px;
  font-weight: bold;
}
.score {
  display: inline-block;
  margin-right: 30px;
}
</style>