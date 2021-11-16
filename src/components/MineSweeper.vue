<template>
  <myPop
    ref="mineSweeperPopRef"
    class="mineSweeperPop"
    :width="popWidth"
    :height="popHeight"
    :isPx="isPx"
    :smallBox="isPx ? smallBox : {}"
    :outside="gameItem.outside"
    @small="small"
    @alreadyClose="exit"
    @popChange="popChange"
  >
    <canvas ref="canvas" id="mycanvas" :width="canvasWidth" :height="canvasWidth" @click="getMouse"></canvas>
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
      // 30 * 9(格子) + 10 * 3(线) = 300
      canvasWidth: 300,
      // 获取canvas画板距离浏览器左/上的距离
      canvasLeft: 0,
      canvasTop: 0,
      // canvas 对象
      canvas: {},
      // 得到 canvas 的 2d 上下文
      ctx: {},
      // 棋盘的行列 每行每列由10根线分为9个格
      lineNum: 10,
      // 格子宽度
      gridWidth: 30,
      // 所有的各自里面的数据 0:空 1-8:数字 9:雷
      allArr: [],
      // 雷的数量
      rayNum: 10,
      // 已经打开的数组
      openArr: []
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
    let width = this.canvasWidth + 60
    // 刚开始获取浏览器的宽高
    this.popWidth = parseInt(
      (width * 100) / document.documentElement.clientWidth
    );
    this.popHeight = parseInt(
      (width * 100) / document.documentElement.clientHeight
    );
    // 监听浏览器窗口大小变化
    let that = this;
    window.addEventListener("resize", function (e) {
      this.windowTime = setTimeout(() => {
        that.popWidth = parseInt((width * 100) / e.currentTarget.innerWidth);
        that.popHeight = parseInt((width * 100) / e.currentTarget.innerHeight);
      }, 50);
    });
    this.init()
  },
  methods: {
    init() {
      setTimeout(() => {
        this.canvas = this.$refs.canvas
        this.ctx = this.canvas.getContext("2d")
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
      // 获取dom元素对象与浏览器 左边/顶部 的距离 
      this.canvasLeft = this.$refs.canvas.getBoundingClientRect().left;
      this.canvasTop = this.$refs.canvas.getBoundingClientRect().top;
    },
    // 画棋盘
    drawCheckerboard() {
      let begin = 1.5; // 开始的位置
      let lineLength = this.canvasWidth; // 每条线的总长度
      let gridWidth = this.gridWidth + 3; // 每个格子加右边/下边线的宽度
      for (let i = 0; i < this.lineNum; i++) {
        // 横线
        this.ctx.beginPath();
        this.ctx.moveTo(begin, begin + gridWidth * i);
        this.ctx.lineTo(begin + lineLength, begin + gridWidth * i);
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = "#689eeb";
        this.ctx.stroke();
        // 竖线
        this.ctx.beginPath();
        this.ctx.moveTo(begin + gridWidth * i, begin);
        this.ctx.lineTo(begin + gridWidth * i, begin + lineLength);
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = "#689eeb";
        this.ctx.stroke();
      }
    },
    // 初始化每个位置的值
    saveLocation() {
      let gridWidth = this.gridWidth + 3;
      // 总格子数
      let gridNum = this.lineNum - 1
      for (let i = 0; i < gridNum; i++) {
        this.allArr.push([]);
        this.openArr.push([]);
        for (let j = 0; j < gridNum; j++) {
          // 保存所有的棋子位置信息
          this.allArr[i][j] = {
            x: 15 + gridWidth * j,
            y: 15 + gridWidth * i,
            score: 0,
            isPlay: false
          };
          // 将所有的位置置为 0
          this.openArr[i][j] = null;
        }
      }
      // 随机生成雷
      for(let i = 0; i < this.rayNum; i++) {
        let {x, y} = this.randomRay()
        this.allArr[x][y].score = 9
      }
      console.log(this.allArr)
    },
    // 随机生成雷
    randomRay() {
      let gridNum = this.lineNum - 2
      let x = Math.round(Math.random() * gridNum)
      let y = Math.round(Math.random() * gridNum)
      console.log(x, y)
      if(this.allArr[x][y].score === 9) {
        console.log('重复了')
        this.randomRay()
      } else {
        return {x, y}
      }
    },
    // 点击获取鼠标位置，下棋
    getMouse() {
      if (this.gameOver) return;
      // canvas 中棋子的位置
      let chessX = window.event.pageX - this.canvasLeft;
      let chessY = window.event.pageY - this.canvasTop;
      // 获取鼠标点击 下棋的位置
      for (let i = 0; i < this.lineNum - 1; i++) {
        for (let j = 0; j < this.lineNum - 1; j++) {
          if (!this.allArr[i][j].isPlay) {
            let {x, y, score} = this.allArr[i][j]
            if (
              chessX >= x - 15 &&
              chessX <= x + 15 &&
              chessY >= y - 15 &&
              chessY <= y + 15
            ) {
              this.openArr[i][j] = score;
              this.drawChess(x, y, score);
              // 判断游戏是否结束
              // if (this.checkChess(i, j, chess)) {
              //   this.gameOver = true;
              //   return;
              // }
              // return;
            }
          }
        }
      }
    },
    // 画棋子
    drawChess(x, y, score) {
      // 设置字体
      this.ctx.font = "18px bold 黑体";
      // 设置颜色
      this.ctx.fillStyle = "#ff0";
      // 设置水平对齐方式
      this.ctx.textAlign = "center";
      // 设置垂直对齐方式
      this.ctx.textBaseline = "middle";
      // 绘制文字（参数：要写的字，x坐标，y坐标）
      this.ctx.fillText(score, x, y);
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
      setTimeout(() => {
        this.getCanvasMargin();
      }, 1050);
    },
    // 显示弹出层
    popshow() {
      this.$refs.mineSweeperPopRef.popshow();
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
.mineSweeperPop {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #94b5e4;
  padding-top: 30px;
  #mycanvas {
    border-radius: 2px;
    background-image: radial-gradient(#a1c4fd 0%, #c2e9fb 100%);
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