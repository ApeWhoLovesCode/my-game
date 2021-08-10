<template>
  <myPop
    ref="Pop"
    class="pop"
    :width="popWidth"
    :height="popHeight"
    :isPx="isPx"
    :smallBox="isPx ? smallBox : {}"
    :outside="gameItem.outside"
    @small="small"
    @alreadyClose="exit"
  >
    <canvas ref="canvas" id="mycanvas" width="500" height="500"></canvas>
    <div class="score">
      <span>得分：{{ score }}</span>
    </div>
    <GameOver
      v-if="gameOver"
      ref="gameover"
      :width="isPx ? 30 : 65"
      :height="35"
      @exit="exit"
      @restart="restart"
    >
      <div class="gameoverItem">
        关卡奖励: <i>{{ level }}</i>
      </div>
      <div class="gameoverItem">
        得分: <i>{{ gOScore.score }}</i>
      </div>
      <div class="gameoverItem">
        总得分: <i>{{ gOScore.final }}</i>
      </div>
    </GameOver>
  </myPop>
</template>

<script>
import myPop from "@/components/myPop/myPop.vue";
import GameOver from "@/components/GameOver.vue";
export default {
  name: "",
  components: {
    myPop,
    GameOver,
  },
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
      popHeight: 80,
      // 当前分数
      score: 0,
      // 关卡
      level: 1,
      // 游戏结束
      gameOver: false,
      // 记录当前是是否为暂停状态
      isPause: false,
      // 游戏结束显示分数的定时器
      gOTimer: null,
      // 游戏结束显示得分
      gOScore: { score: 0, final: 0 },
    };
  },
  computed: {
    // 最终得分
    finalScore() {
      return this.score * this.level;
    },
  },
  watch: {},
  mounted() {
    // 刚开始获取浏览器的宽高
    this.popWidth = parseInt(
      (600 * 100) / document.documentElement.clientWidth
    );
    this.popHeight = parseInt(
      (600 * 100) / document.documentElement.clientHeight
    );
    // 监听浏览器窗口大小变化
    let that = this;
    window.addEventListener("resize", function (e) {
      this.windowTime = setTimeout(() => {
        that.popWidth = parseInt((600 * 100) / e.currentTarget.innerWidth);
        that.popHeight = parseInt((600 * 100) / e.currentTarget.innerHeight);
      }, 50);
    });
  },
  methods: {
    // 得分分段式显示
    scoreShow() {
      setTimeout(() => {
        // 增加的值 控制在 1 秒
        let addScore = this.score >= 100 ? parseInt(this.score / 100) : 1;
        let addFinal =
          this.finalScore >= 100 ? parseInt(this.finalScore / 100) : 1;
        this.gOTimer = setInterval(() => {
          if (this.gOScore.score < this.score) {
            this.gOScore.score += addScore;
          } else {
            if (this.gOScore.final < this.finalScore) {
              this.gOScore.final += addFinal;
            } else {
              clearInterval(this.gOTimer);
            }
          }
        }, 10);
      }, 100);
    },
    // 监听用户的键盘事件
    onKeyDown() {
      document.onkeydown = (e) => {
        switch (e.code) {
          case "ArrowLeft":
            break;
          case "ArrowUp":
            break;
          case "ArrowRight":
            break;
          case "ArrowDown":
            break;
        }
      };
    },
    // 缩小
    small() {
      this.isPause = true;
      // 暂停游戏
      this.$emit("small", this.gameItem);
    },
    // 显示弹出层
    popshow() {
      this.$refs.twoFourPop.popshow();
    },
    // 退出游戏
    exit() {
      // 1.停止定时器
      this.$emit("gameoverFn", this.gameItem.id);
    },
    // 重新开始
    restart() {
      this.$emit("restartFn", this.gameItem.id);
    },
  },
};
</script>
<style lang='scss' scoped>
.twoFourpop {
  display: flex;
  align-items: center;
  justify-content: center;
  // background: linear-gradient(to bottom, #12c2e9, #c471ed, #f64f59);
  background: #6ed4eb;
  #mycanvas {
    border-radius: 8px;
  }
  .score {
    position: absolute;
    left: 50%;
    top: 12px;
    transform: translateX(-50%);
    font-size: 18px;
    color: #e9e9e9;
    user-select: none;
  }
}
</style>