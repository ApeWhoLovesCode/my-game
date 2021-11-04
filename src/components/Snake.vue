<template>
  <myPop
    ref="snakePop"
    class="snakepop"
    :width="popWidth"
    :height="popHeight"
    :isPx="isPx"
    :smallBox="isPx ? smallBox : {}"
    :outside="gameItem.outside"
    @small="small"
    @alreadyClose="exit"
  >
    <div class="snake-wrap">
      <canvas
        ref="canvas"
        id="mycanvas"
        :width="canvasWidth"
        :height="canvasHeight"
      ></canvas>
      <!-- 墙 -->
      <div :class="isWall ? 'wallShow' : 'wallHide'" class="wall"></div>
      <div
        v-show="isThroughWall"
        :style="{
          top: throughWall.y - 9 + 'px',
          left: throughWall.x - 9 + 'px',
        }"
        :class="throughWall.isTurn ? 'rotateX' : 'rotateY'"
        class="xuanzhuan"
      ></div>
      <!-- 暂停遮罩层 -->
      <div v-show="isPause" class="paseMask">暂停中 §(*￣▽￣*)§</div>
    </div>
    <div class="score">
      <span>得分: {{ score }}</span>
      <span class="level">关卡: {{ level }}</span>
    </div>
    <div class="walltime">边界：{{ wallTime }} / {{ wallInterval }}</div>

    <GameOver
      v-if="gameOver"
      ref="gameover"
      :gameName="gameItem.name"
      :gameId="gameItem.id"
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
      popHeight: 70,
      // 游戏结束
      gameOver: false,
      // 定义画布的宽高
      canvasWidth: 400,
      canvasHeight: 400,
      // 行列
      row: 0,
      col: 0,
      size: 10,
      // 蛇
      snake: {
        x: 20,
        y: 20,
        size: 0,
        xSpeed: 0,
        ySpeed: 0,
        body: [],
        length: 0,
      },
      // 蛋
      egg: {
        x: 0,
        y: 0,
        size: 0,
      },
      // 设置游戏的暂停
      isPause: true,
      // 游戏的定时器
      gameTimer: null,
      // canvas 对象
      canvas: {},
      // 得到 canvas 的 2d 上下文
      ctx: {},
      // 关卡
      level: 1,
      // 分数
      score: 0,
      // 每隔 100ms 蛇移动一次
      drawTime: 100,
      // 游戏结束计算得分定时器
      gOTimer: null,
      // 游戏结束显示得分
      gOScore: { score: 0, final: 0 },
      // 监听浏览器窗口的防抖定时器
      windowTime: null,
      // 是否显示 墙
      isWall: true,
      // 定时开启墙的定时器
      wallTimer: null,
      wallTime: 10,
      // 控制墙的显示与隐藏的间隔时间
      wallInterval: 10,
      // 蛇穿墙的位置
      throughWall: { x: 0, y: 0, isTurn: false },
      // 判断是否穿墙
      isThroughWall: false,
      // 当前蛇移动的方向
      direction: "",
    };
  },
  computed: {
    // 最终得分
    finalScore() {
      return this.score * this.level;
    },
  },
  watch: {
    // 暂停的判断
    isPause(val) {
      if (val) {
        clearInterval(this.gameTimer);
        clearInterval(this.wallTimer);
      } else {
        this.startGame();
      }
    },
    snake: {
      handler(s) {
        let isThrough = false;
        // 判断当前的方向
        if (
          s.body.length > 0 &&
          s.body[s.length - 1] &&
          s.body[s.length - 1].x
        ) {
          // 将跟着头部的那节身体坐标 解构出来
          let { x, y } = s.body[s.length - 1];
          if (s.y == y && s.x - x > 0) {
            this.direction = "right";
          } else if (s.x - x < 0) {
            this.direction = "left";
          } else if (s.x == x && s.y - y > 0) {
            this.direction = "down";
          } else if (s.y - y < 0) {
            this.direction = "up";
          }
        }
        for (let item of s.body) {
          // 判断蛇咬到了自己
          if (s.x == item.x && s.y == item.y) {
            this.snakeDie();
          }
          // 只要有一个蛇身还在穿墙，就一直显示旋转的圈
          if (item.x == this.throughWall.x && item.y == this.throughWall.y) {
            this.isThroughWall = true;
            isThrough = true;
          }
        }
        if (!isThrough) {
          this.isThroughWall = false;
        }
        // 判断蛇是否触碰了边界;
        const { width, height } = this.canvas;
        if (
          this.isWall &&
          (s.x < 0 || s.x >= width || s.y < 0 || s.y >= height)
        ) {
          this.snakeDie();
        }
      },
      deep: true,
    },
    gameOver(val) {
      if (val) {
        clearInterval(this.gameTimer);
        clearInterval(this.wallTimer);
      }
    },
    // 监听墙的显示隐藏
    wallTime(val, oldval) {
      if (val != 0 && val != this.wallInterval) return; // 为了防止多次赋值，优化
      // 减少到 0 ，消除墙
      if (val < oldval && val < this.wallInterval) this.isWall = false;
      // 增加到 间隔时间，显示墙
      else this.isWall = true;
    },
    // 监听得分变化，提升蛇的速度
    score(val, oldval) {
      if (parseInt(val / 20) != parseInt(oldval / 20)) {
        this.level++;
      }
    },
    // 监听现在点的是哪个弹出层 就重新监听用户的键盘事件
    gameItem: {
      handler(val) {
        if (val.outside) this.onKeyDown();
      },
      deep: true,
    },
  },
  mounted() {
    // 刚开始获取浏览器的宽高
    this.popWidth = parseInt(
      (450 * 100) / document.documentElement.clientWidth
    );
    this.popHeight = parseInt(
      (500 * 100) / document.documentElement.clientHeight
    );
    this.snake.size = this.size;
    this.snake.xSpeed = this.size * 1;
    this.egg.size = this.size;
    this.init();
    // 监听浏览器窗口大小变化
    let that = this;
    window.addEventListener("resize", function (e) {
      this.windowTime = setTimeout(() => {
        // if (e.currentTarget.innerWidth <= 1125) {
        that.popWidth = parseInt((450 * 100) / e.currentTarget.innerWidth);
        // if (e.currentTarget.innerHeight <= 643) {
        that.popHeight = parseInt((500 * 100) / e.currentTarget.innerHeight);
      }, 50);
    });
  },
  methods: {
    // 初始化
    init() {
      setTimeout(() => {
        this.canvas = this.$refs.canvas;
        // let canvas = document.getElementById("mycanvas");
        this.ctx = this.canvas.getContext("2d");
        // 定义行列
        this.row = this.canvasWidth / this.size;
        this.col = this.canvasHeight / this.size;
        // 刚开始先画出蛇和蛋来
        this.updateEgg();
        this.drawEgg();
        this.drawSnake();
        // 监听键盘事件
        this.onKeyDown();
        if(!this.isPause) this.startGame();
      }, 200);
    },
    // 开启游戏
    startGame() {
      this.gameTimer = setInterval(() => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawEgg();
        this.updateSnake();
        this.drawSnake();
        if (this.eatEgg()) {
          this.updateEgg();
        }
      }, this.drawTime);
      // 开启墙的定时器
      this.wallTimer = setInterval(() => {
        this.isWall ? this.wallTime-- : this.wallTime++;
      }, 1000);
    },
    // 画蛇
    drawSnake() {
      this.ctx.fillStyle = "#fff";
      for (let i = 0; i < this.snake.body.length; i++) {
        const { x, y } = this.snake.body[i];
        this.ctx.fillRect(x, y, this.snake.size, this.snake.size);
      }
      this.ctx.fillRect(
        this.snake.x,
        this.snake.y,
        this.snake.size,
        this.snake.size
      );
      // 处理穿墙 并保存穿墙的位置
      if (!this.isWall) {
        const { width, height } = this.canvas;
        if (this.snake.x >= width) {
          this.throughWall.x = width - this.size;
          this.throughWall.y = this.snake.y;
          this.throughWall.isTurn = false;
          this.snake.x = 0;
        }
        if (this.snake.x < 0) {
          this.throughWall.x = 0;
          this.throughWall.y = this.snake.y;
          this.throughWall.isTurn = false;
          this.snake.x = width;
        }
        if (this.snake.y >= height) {
          this.throughWall.x = this.snake.x;
          this.throughWall.y = height - this.size;
          this.throughWall.isTurn = true;
          this.snake.y = 0;
        }
        if (this.snake.y < 0) {
          this.throughWall.x = this.snake.x;
          this.throughWall.y = 0;
          this.throughWall.isTurn = true;
          this.snake.y = height;
        }
      }
    },
    // 画蛋
    drawEgg() {
      this.ctx.fillStyle = "#adff2f";
      this.ctx.fillRect(this.egg.x, this.egg.y, this.egg.size, this.egg.size);
    },
    // 更新蛇的位置
    updateSnake() {
      // 让蛇的后一节等于前一节的位置
      for (let i = 0; i < this.snake.body.length - 1; i++) {
        this.snake.body[i] = this.snake.body[i + 1];
      }

      // 吃到东西了, 保存蛇的身体位置，并且将其作为蛇头，不断带领蛇身移动
      if (this.snake.length > 0) {
        this.snake.body[this.snake.length - 1] = {
          x: this.snake.x,
          y: this.snake.y,
        };
      }
      this.snake.x += this.snake.xSpeed;
      this.snake.y += this.snake.ySpeed;
    },
    // 更新蛋的位置
    updateEgg() {
      // 当蛋出现在蛇身体里面的时候，重新执行
      do {
        this.egg.x =
          (Math.floor(Math.random() * this.col - 1) + 1) * this.egg.size;
        this.egg.y =
          (Math.floor(Math.random() * this.row - 1) + 1) * this.egg.size;
      } while (this.snake.body.includes({ x: this.egg.x, y: this.egg.y }));
    },
    // 蛇吃了蛋
    eatEgg() {
      if (this.snake.x == this.egg.x && this.snake.y == this.egg.y) {
        this.snake.length++;
        this.score += 10;
        return true;
      }
      return false;
    },
    // 蛇死亡的处理
    snakeDie() {
      this.gameOver = true;
      this.$nextTick(() => {
        // 2.弹出游戏结束对话框
        this.$refs.gameover.popshow();
        // 发送游戏结束事件，上传最高分到数据库
        this.$emit("updateScore", this.gameItem.id, this.finalScore);
        this.scoreShow();
      });
    },
    // 监听用户的键盘事件
    onKeyDown() {
      document.onkeydown = (e) => {
        switch (e.code) {
          case "ArrowLeft":
            // 判断不能反方向
            if (this.direction == "right") break;
            this.$store.commit("setCurrentKey", "left");
            this.move(-this.size * 1, 0);
            break;
          case "ArrowUp":
            if (this.direction == "down") break;
            this.$store.commit("setCurrentKey", "up");
            this.move(0, -this.size * 1);
            break;
          case "ArrowRight":
            if (this.direction == "left") break;
            this.$store.commit("setCurrentKey", "right");
            this.move(this.size * 1, 0);
            break;
          case "ArrowDown":
            if (this.direction == "up") break;
            this.$store.commit("setCurrentKey", "down");
            this.move(0, this.size * 1);
            break;
          case "Space":
            this.pause();
            break;
        }
      };
    },
    move(x, y) {
      (this.snake.xSpeed = x), (this.snake.ySpeed = y);
    },
    pause() {
      this.isPause = !this.isPause;
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
      this.isPause = true;
      // 暂停游戏
      this.$emit("small", this.gameItem);
    },
    // 显示弹出层
    popshow() {
      this.$refs.snakePop.popshow();
    },
    // 退出游戏
    exit() {
      // 1.停止定时器
      if (this.gameTimer) {
        clearInterval(this.gameTimer);
        clearInterval(this.wallTimer);
      }
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
.snakepop {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #222222;
  color: #777;
  .snake-wrap {
    position: relative;
  }
  #mycanvas {
    background: #302f2f;
    box-shadow: -2px -2px 2px 0px #666666 inset;
    border-radius: 8px;
  }
  .score {
    position: absolute;
    left: 50%;
    top: 12px;
    transform: translateX(-50%);
    color: #888;
    font-size: 16px;
    z-index: 1;
    .level {
      margin-left: 20px;
    }
  }
  .walltime {
    position: absolute;
    left: 20px;
    top: 12px;
    font-size: 16px;
    color: #999;
  }
  .wall {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 400px;
    box-shadow: 0px 0px 2px 2px #a8a8a8;
    border-radius: 10px;
  }
  .wallShow {
    animation: wallShow 0.5s ease-in forwards;
  }
  .wallHide {
    animation: wallHide 0.5s ease forwards;
  }
  // 暂停遮罩层
  .paseMask {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.2);
    color: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    font-size: 14px;
    user-select: none;
  }
}
.xuanzhuan {
  position: absolute;
  left: 0;
  top: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 3px dashed #3878d8;
  z-index: 2;
}

.rotateX {
  animation: rotateX 3s linear infinite;
}
.rotateY {
  animation: rotateY 3s linear infinite;
}
@keyframes rotateY {
  0% {
    transform: rotateY(75deg) rotateZ(0deg);
  }

  100% {
    transform: rotateY(75deg) rotateZ(360deg);
  }
}

@keyframes rotateX {
  0% {
    transform: rotateX(75deg) rotateZ(0deg);
  }

  100% {
    transform: rotateX(75deg) rotateZ(360deg);
  }
}

@keyframes wallShow {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes wallHide {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>