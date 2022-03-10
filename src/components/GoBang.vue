<template>
  <myPop
    ref="goBangPop"
    class="goBangpop"
    :width="popWidth"
    :height="popHeight"
    :isPx="isPx"
    :smallBox="isPx ? smallBox : {}"
    :outside="gameItem.outside"
    @small="small"
    @alreadyClose="exit"
    @popChange="popChange"
  >
    <canvas
      ref="canvas"
      id="mycanvas"
      :width="canvasWidth"
      :height="canvasWidth"
      @click="getMouse"
    ></canvas>
    <div class="chess">
      <img :class="{ chessRotate: isBlack }" :src="chessImg.black" />
      <img :class="{ chessRotate: !isBlack }" :src="chessImg.white" />
    </div>
    <GameOver
      v-if="gameOver"
      ref="gameover"
      :gameName="gameItem.name"
      :gameId="gameItem.id"
      :isRankList="false"
      @exit="exit"
      @restart="restart"
    >
      <div class="gameoverItem">
        <div class="gameover-img">
          <img :src="isBlack ? chessImg.black : chessImg.white" />
          <span>胜利</span>
        </div>
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
      // 游戏结束显示分数的定时器
      gOTimer: null,
      // 游戏结束显示得分
      gOScore: { score: 0, final: 0 },
      // 30 * 14(格子) + 15(线) + 15+15(边缘) == 465
      canvasWidth: 465,
      // 获取canvas画板距离浏览器左/上的距离
      canvasLeft: 0,
      canvasTop: 0,
      // canvas 对象
      canvas: {},
      // 得到 canvas 的 2d 上下文
      ctx: {},
      // 棋盘的行列 每行每列由15根线分为14个格
      lineNum: 15,
      // 格子宽度
      gridWidth: 30,
      // 所有可能下的棋子坐标的数组
      allChessArr: [],
      // 已经下棋的棋子坐标数组  0:没棋  1:黑  2:白
      chessArr: [],
      // 当前下棋的颜色
      isBlack: true,
      chessImg: {
        black: require("../assets/img/chess_black.png"),
        white: require("../assets/img/chess_white.png"),
      },
    };
  },
  computed: {
    // 最终得分
    finalScore() {
      return this.score * this.level;
    },
  },
  watch: {
    // 判断游戏结束
    gameOver(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.gameover.popshow();
          // 发送游戏结束事件，上传最高分到数据库
          // this.$emit("updateScore", this.gameItem.id, this.score);
          this.scoreShow();
        });
      }
    },
    // 监听现在点的是哪个弹出层 就重新监听用户的键盘事件
    gameItem: {
      handler(val) {
        // 监听到从缩小状态回到弹出层状态，重新获取弹出层信息
        if (val.small == 2) {
          setTimeout(() => {
            this.getCanvasMargin();
          }, 1100);
        }
      },
      deep: true,
    },
  },
  mounted() {
    // 刚开始获取浏览器的宽高
    this.popWidth = parseInt(
      (550 * 100) / document.documentElement.clientWidth
    );
    this.popHeight = parseInt(
      (550 * 100) / document.documentElement.clientHeight
    );
    // 监听浏览器窗口大小变化
    let that = this;
    window.addEventListener("resize", function (e) {
      this.windowTime = setTimeout(() => {
        that.popWidth = parseInt((550 * 100) / e.currentTarget.innerWidth);
        that.popHeight = parseInt((550 * 100) / e.currentTarget.innerHeight);
      }, 50);
    });
    this.init();
  },
  methods: {
    // 初始化
    init() {
      setTimeout(() => {
        this.canvas = this.$refs.canvas;
        this.ctx = this.canvas.getContext("2d");
        // 画棋盘
        this.drawCheckerboard();
        // 保存棋子的坐标
        this.saveLocation();
      }, 100);
      setTimeout(() => {
        this.getCanvasMargin();
      }, 1050);
    },
    // 获取canvas与浏览器 左边 / 顶部 的距离
    getCanvasMargin() {
      // 获取dom元素对象与浏览器 左边/顶部 的距离      5是border
      this.canvasLeft = this.$refs.canvas.getBoundingClientRect().left + 5;
      this.canvasTop = this.$refs.canvas.getBoundingClientRect().top + 5;
    },
    // 画棋盘
    drawCheckerboard() {
      let begin = 15; // 开始的位置
      let lineLength = this.canvasWidth - 30; // 每条线的总长度
      let gridWidth = this.gridWidth + 1; // 每个格子加右边/下边线的宽度
      for (let i = 0; i < this.lineNum; i++) {
        // 横线
        this.ctx.beginPath();
        this.ctx.moveTo(begin, begin + gridWidth * i);
        this.ctx.lineTo(begin + lineLength, begin + gridWidth * i);
        this.ctx.strokeStyle = "#763a0d";
        this.ctx.stroke();
        // 竖线
        this.ctx.beginPath();
        this.ctx.moveTo(begin + gridWidth * i, begin);
        this.ctx.lineTo(begin + gridWidth * i, begin + lineLength);
        this.ctx.strokeStyle = "#763a0d";
        this.ctx.stroke();
      }
      // 画中间的五个点
      let arr = [
        { x: 3, y: 3 },
        { x: 3, y: 11 },
        { x: 7, y: 7 },
        { x: 11, y: 3 },
        { x: 11, y: 11 },
      ];
      for (let item of arr) {
        this.ctx.beginPath();
        this.ctx.arc(
          begin + gridWidth * item.x, begin + gridWidth * item.y, 
          5, 0, 2 * Math.PI
        );
        this.ctx.fillStyle = "#763a0d";
        this.ctx.fill();
      }
    },
    // 保存棋子的坐标
    saveLocation() {
      let gridWidth = this.gridWidth + 1;
      for (let i = 0; i < this.lineNum; i++) {
        this.allChessArr.push([]);
        this.chessArr.push([]);
        for (let j = 0; j < this.lineNum; j++) {
          // 保存所有的棋子位置信息
          this.allChessArr[i][j] = {
            x: 15 + gridWidth * j,
            y: 15 + gridWidth * i,
            isPlay: false,
          };
          // 将所有的棋子置为 0
          this.chessArr[i][j] = 0;
        }
      }
    },
    // 点击获取鼠标位置，下棋
    getMouse() {
      if (this.gameOver) return;
      // canvas 中棋子的位置
      let chessX = window.event.pageX - this.canvasLeft;
      let chessY = window.event.pageY - this.canvasTop;
      let x, y;
      // 获取鼠标点击 下棋的位置
      for (let i = 0; i < this.lineNum; i++) {
        for (let j = 0; j < this.lineNum; j++) {
          if (this.chessArr[i][j] == 0) {
            x = this.allChessArr[i][j].x;
            y = this.allChessArr[i][j].y;
            if (
              chessX >= x - 15 &&
              chessX <= x + 15 &&
              chessY >= y - 15 &&
              chessY <= y + 15
            ) {
              let isBlack = this.isBlack;
              let chess = isBlack ? 1 : 2;
              // 1:黑  2:白
              this.chessArr[i][j] = chess;
              this.drawChess(x, y, isBlack);
              // 判断游戏是否结束
              if (this.checkChess(i, j, chess)) {
                this.gameOver = true;
                return;
              }
              this.isBlack = !this.isBlack; // 下棋颜色取反
              return;
            }
          }
        }
      }
    },
    // 画棋子
    drawChess(x, y, isBlack) {
      let img = new Image();
      isBlack
        ? (img.src = this.chessImg.black)
        : (img.src = this.chessImg.white);
      img.onload = () => {
        // (image, x, y, 切片width, 切片height, 切片x, y, w, h)
        this.ctx.drawImage(img, x - 15, y - 15, 28, 28);
      };
    },
    // 检查是否胜利了
    checkChess(i, j, chess) {
      let x = { sum: 1, isL: true, isR: true },
        y = { sum: 1, isL: true, isR: true },
        z = { sum: 1, isL: true, isR: true },
        z2 = { sum: 1, isL: true, isR: true };
      for (let a = 1; a < 5; a++) {
        // 处理行
        x.isL && j + a < 15 && this.chessArr[i][j + a] == chess
          ? x.sum++
          : (x.isL = false);
        x.isR && j - a >= 0 && this.chessArr[i][j - a] == chess
          ? x.sum++
          : (x.isR = false);
        // 处理列
        y.isL && i + a < 15 && this.chessArr[i + a][j] == chess
          ? y.sum++
          : (y.isL = false);
        y.isR && i - a >= 0 && this.chessArr[i - a][j] == chess
          ? y.sum++
          : (y.isR = false);
        // 处理斜边1 '\'
        z.isL && i + a < 15 && j + a < 15 && this.chessArr[i + a][j + a] == chess
          ? z.sum++
          : (z.isL = false);
        z.isR && i - a >= 0 && j - a >= 0 && this.chessArr[i - a][j - a] == chess
          ? z.sum++
          : (z.isR = false);
        // 处理斜边2 '/'
        z2.isL && i + a < 15 && j - a >= 0 && this.chessArr[i + a][j - a] == chess
          ? z2.sum++
          : (z2.isL = false);
        z2.isR && i - a >= 0 && j + a < 15 && this.chessArr[i - a][j + a] == chess
          ? z2.sum++
          : (z2.isR = false);
      }
      // console.log("x: ", x.sum, "y: ", y.sum, "z: ", z.sum, "z2: ", z2.sum);
      if (x.sum >= 5 || y.sum >= 5 || z.sum >= 5 || z2.sum >= 5) return true;
      return false;
    },
    // 弹出层移动的回调
    popChange() {
      this.getCanvasMargin();
    },
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
    // 缩小
    small() {
      // 暂停游戏
      this.$emit("small", this.gameItem);
      setTimeout(() => {
        this.getCanvasMargin();
      }, 1050);
    },
    // 显示弹出层
    popshow() {
      this.$refs.goBangPop.popshow();
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
.goBangpop {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ad7358;
  #mycanvas {
    border: 5px solid #8b4b1c;
    border-radius: 8px;
    background: #d5a77f;
  }
  .chess {
    position: absolute;
    left: 50%;
    top: 2px;
    transform: translateX(-50%);
    font-size: 16px;
    font-weight: bold;
    color: #c6a08d;
    user-select: none;
    img {
      width: 25px;
      height: 25px;
      padding: 2px;
    }
    .chessRotate {
      border-radius: 50%;
      border: 2px inset #b8eac6;
      animation: chess 3s linear infinite;
    }
  }
  .chess img:first-child {
    margin-right: 20px;
  }
  // 游戏结束里面的图片
  .gameover-img {
    display: flex;
    justify-content: center;
    align-content: center;
    transform: translateX(-30px);
    margin: 15px 0;
    img {
      width: 40px;
      height: 40px;
      margin-right: 20px;
    }
    span {
      font-size: 30px;
      color: #caca15;
    }
  }
}
@keyframes chess {
  0% {
    opacity: 0.6;
    transform: rotate(0deg);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
    transform: rotate(360deg);
  }
}
</style>