<template>
  <myPop
    ref="twoFourPop"
    class="twoFourpop"
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
      :gameName="gameItem.name"
      :gameId="gameItem.id"
      :score="gOScore.final"
      @exit="exit"
      @restart="restart"
    >
      <div class="gameoverItem">
        得分: <i>{{ gOScore.score }}</i>
      </div>
      <div class="gameoverItem">
        奖励分: <i>{{ gOScore.reward }}</i>
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
      // 合出128就有奖励分
      reward: 0,
      // 游戏结束
      gameOver: false,
      // 记录当前是是否为暂停状态
      isPause: false,
      // 游戏结束显示分数的定时器
      gOTimer: null,
      // 游戏结束显示得分
      gOScore: { score: 0, reward: 0, final: 0 },
      // canvas 对象
      canvas: {},
      // 得到 canvas 的 2d 上下文
      ctx: {},
      // 每个盒子的宽度
      boxWidth: 0,
      // 盒子间的间距
      boxMargin: 0,
      // 盒子的颜色
      boxColor: {
        0: "#e9f8fe",
        2: "#aae6fd",
        4: "#81d6f8",
        8: "#40bff1",
        16: "#00b2f8",
        32: "#0393cc",
        64: "#2a88f3",
        128: "#0c67cf",
        256: "#0453ad",
        512: "#042bad",
        1024: "#780ef1",
        2048: "#8409d6",
      },
      // 二维数组对应里面的盒子数据
      boxArr: [],
      // 当前的按键
      currentKey: { key: "", num: 0 },
    };
  },
  computed: {
    // 最终得分
    finalScore() {
      return this.score + this.reward;
    },
    // 判断是否已经排列好了
    checkSorted() {
      return (arr) => {
        let flag = false;
        // 先处理 0 的情况
        if (
          (arr[0] == 0 && arr[1] == 0 && arr[2] == 0 && arr[3] == 0) ||
          (arr[0] > 0 && arr[1] == 0 && arr[2] == 0 && arr[3] == 0) ||
          (arr[0] > 0 && arr[1] > 0 && arr[2] == 0 && arr[3] == 0) ||
          (arr[0] > 0 && arr[1] > 0 && arr[2] > 0 && arr[3] == 0) ||
          (arr[0] > 0 && arr[1] > 0 && arr[2] > 0 && arr[3] > 0)
        ) {
          flag = true;
        }
        // 如果有一个相邻数字是相等的就是还没排列好
        if (
          (arr[0] == arr[1] && arr[0] != 0) ||
          (arr[1] == arr[2] && arr[1] != 0) ||
          (arr[2] == arr[3] && arr[2] != 0)
        ) {
          flag = false;
        }
        return flag;
      };
    },
  },
  watch: {
    // 判断游戏结束，弹窗
    gameOver(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.gameover.popshow();
          // 发送游戏结束事件，上传最高分到数据库
          this.$emit("updateScore", this.gameItem.id, this.finalScore);
          this.scoreShow();
        });
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
    this.init();
  },
  methods: {
    // 初始化
    init() {
      setTimeout(() => {
        this.canvas = this.$refs.canvas;
        this.ctx = this.canvas.getContext("2d");
        // 获取画布内盒子的大小和间距
        this.boxWidth = (this.canvas.width * 0.8) / 4;
        this.boxMargin = (this.canvas.width * 0.2) / 5;
        // 初始化二维数组并赋值为 0
        for (let i = 0; i < 4; i++) {
          this.boxArr.push([]);
          for (let j = 0; j < 4; j++) {
            this.boxArr[i][j] = 0;
          }
        }
        this.createRandom();
        this.createRandom();
        this.drawInterface();
        this.drawText();
        this.onKeyDown();
      }, 100);
    },
    // 画界面
    drawInterface() {
      this.ctx.beginPath();
      this.ctx.fillStyle = "#576eb9";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      let color, x, y;
      // 遍历数组 辨认数组的当前值 并赋上颜色
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          color = this.boxColor[this.boxArr[i][j]];
          x = this.boxMargin + j * (this.boxWidth + this.boxMargin);
          y = this.boxMargin + i * (this.boxWidth + this.boxMargin);
          this.drawRect(x, y, color);
        }
      }
    },
    // 画文字
    drawText() {
      let x, y;
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (this.boxArr[i][j] > 0) {
            this.ctx.beginPath();
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "middle";
            this.ctx.fillStyle = "#3a5075";
            this.ctx.font = "40px Arial";
            x =
              this.boxMargin +
              j * (this.boxWidth + this.boxMargin) +
              this.boxWidth / 2;
            y =
              this.boxMargin +
              i * (this.boxWidth + this.boxMargin) +
              this.boxWidth / 2;
            // 在画布上对应的位置写上二维数组中的值
            this.ctx.fillText(this.boxArr[i][j], x, y);
          }
        }
      }
    },
    // 画矩形
    drawRect(x, y, color) {
      this.ctx.beginPath(); // 1.创建路径
      this.ctx.fillStyle = color;
      this.ctx.moveTo(x, y); // 2.移动绘制点
      let w = this.boxWidth;
      let m = this.boxMargin;
      // 这是画一个矩形的四个圆角
      // arcTo(起点x, y, 终点x, y, 半径) 分别是 右上 右下 左下 左上
      this.ctx.arcTo(x + w, y, x + w, y + 1, m * 0.7);
      this.ctx.arcTo(x + w, y + w, x + w - 1, y + w, m * 0.7);
      this.ctx.arcTo(x, y + w, x, y + w - 1, m * 0.7);
      this.ctx.arcTo(x, y, x + 1, y, m * 0.7);
      this.ctx.fill();
    },
    // 在空白的位置随机创建一个 2
    createRandom() {
      let x = Math.round(Math.random() * 3);
      let y = Math.round(Math.random() * 3);
      this.boxArr[x][y] == 0
        ? ((this.boxArr[x][y] = 2), (this.score += 2))
        : this.createRandom();
    },
    // 对数字的合并或移动操作
    moveBoxArr(arr) {
      for (let i = 0; i < 3; i++) {
        // 0和其他数字交换位置
        if (arr[i] == 0) {
          let temp = arr[i];
          arr[i] = arr[i + 1];
          arr[i + 1] = temp;
        }
        // 如果两个数字相同就相加
        if (arr[i] != 0 && arr[i] == arr[i + 1]) {
          arr[i] = arr[i] + arr[i + 1];
          this.score += arr[i];
          // 合出128就有奖励分
          arr[i] == 128 ? (this.reward += arr[i]) : "";
          arr[i + 1] = 0;
        }
      }
      // 如果当前已经排好序就返回数组，否处继续排序
      if (this.checkSorted(arr)) {
        return arr;
      } else {
        return this.moveBoxArr(arr);
      }
    },
    // 根据按键, 对数字的处理
    accordingKey(key) {
      this.$store.commit("setCurrentKey", key);
      // 处理按键，防止一直按一个键位
      if (this.currentKey.key == key) {
        this.currentKey.num++;
      } else {
        this.currentKey.key = key;
        this.currentKey.num = 0;
      }
      if (this.currentKey.num > 5) {
        this.$message({
          showClose: true,
          message: "该方向按了很多次了，试试别的方向吧",
          duration: "1500",
          offset: 10,
        });
      } else {
        for (let i = 0; i < 4; i++) {
          var arr = new Array();
          let x, y;
          key == "left" || key == "right" ? (x = i) : "";
          key == "up" || key == "down" ? (y = i) : "";
          // 由于是向左操作，将每行的数字都给一个数组，用于操作判断
          for (let j = 0; j < 4; j++) {
            key == "left" || key == "right" ? (y = j) : "";
            key == "up" || key == "down" ? (x = j) : "";
            arr[j] = this.boxArr[x][y];
          }
          // 如果点击的是右或下就 将数组反序排列
          key == "right" || key == "down" ? arr.reverse() : "";
          // 数字还没操作好就去操作
          if (!this.checkSorted(arr)) arr = this.moveBoxArr(arr);
          key == "right" || key == "down" ? arr.reverse() : "";
          // 重新赋值
          for (let j = 0; j < 4; j++) {
            key == "left" || key == "right" ? (y = j) : "";
            key == "up" || key == "down" ? (x = j) : "";
            this.boxArr[x][y] = arr[j];
          }
        }
        if (this.isGameOver() == 1) {
          this.$message({
            showClose: true,
            message: "该方向已经无法移动了，试试别的方向吧",
            duration: "1500",
            // Message 距离窗口顶部的偏移量
            offset: 10,
          });
        } else if (this.isGameOver() == 0) {
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          this.createRandom();
          this.drawInterface();
          this.drawText();
        } else {
          this.gameOver = true;
        }
      }
    },
    // 监听用户的键盘事件
    onKeyDown() {
      document.onkeydown = (e) => {
        switch (e.code) {
          case "ArrowLeft":
            this.accordingKey("left");
            break;
          case "ArrowUp":
            this.accordingKey("up");
            break;
          case "ArrowRight":
            this.accordingKey("right");
            break;
          case "ArrowDown":
            this.accordingKey("down");
            break;
        }
      };
    },
    // 判断页面已经铺满了数字
    isFullNum() {
      for (let i = 0; i < 4; i++) {
        if (this.boxArr[i].indexOf(0) != -1) {
          return false;
        }
      }
      return true;
    },
    // 判断游戏是否已经结束
    // 0:数字还没铺满。 1:铺满了但相邻数还有相等的。 2:无法移动了游戏结束。
    isGameOver() {
      // 页面铺满数字的前提
      if (this.isFullNum()) {
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            // 如果相邻的数(每个数的右和下数字)还相等就表示游戏还没结束
            if (
              this.boxArr[i][j] == this.boxArr[i][j + 1] ||
              this.boxArr[i][j] == this.boxArr[i + 1][j]
            ) {
              return 1;
            }
          }
        }
        // 最后一行和最后一列的判断
        for (let i = 0; i < 3; i++) {
          if (
            this.boxArr[3][i] == this.boxArr[3][i + 1] ||
            this.boxArr[i][3] == this.boxArr[i + 1][3]
          ) {
            return 1;
          }
        }
        // 如果以上条件都满足了，游戏就结束了
        return 2;
      }
      return 0;
    },
    // 得分分段式显示
    scoreShow() {
      setTimeout(() => {
        // 增加的值 控制在 1 秒
        let addScore = this.score >= 100 ? parseInt(this.score / 100) : 1;
        let addReward = this.reward >= 100 ? parseInt(this.reward / 100) : 1;
        let addFinal =
          this.finalScore >= 100 ? parseInt(this.finalScore / 100) : 1;
        this.gOTimer = setInterval(() => {
          if (this.gOScore.score < this.score) {
            this.gOScore.score += addScore;
          } else {
            if (this.gOScore.reward < this.reward) {
              this.gOScore.reward += addReward;
            } else {
              if (this.gOScore.final < this.finalScore) {
                this.gOScore.final += addFinal;
              } else {
                clearInterval(this.gOTimer);
              }
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
  background: #bee2eb;
  #mycanvas {
    border-radius: 20px;
  }
  .score {
    position: absolute;
    left: 50%;
    top: 12px;
    transform: translateX(-50%);
    font-size: 18px;
    color: #332d75;
    user-select: none;
  }
}
</style>