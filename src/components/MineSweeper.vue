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
    <canvas 
      ref="canvas" 
      id="mycanvas" 
      :width="canvasWidth" 
      :height="canvasWidth" 
      @click="getMouse(false, $event)" 
      @contextmenu.prevent.stop="getMouse(true, $event)" 
    />
    <div class="score">
      <el-dropdown class="set" trigger="click" :tabindex="selectLevel" @command="changeLevel">
        <span class="el-dropdown-link">
          难度<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu class="set-select" slot="dropdown">
          <el-dropdown-item 
            v-for="(item, index) in selectLevelArr" 
            :key="index" 
            :class="{active: selectLevel === index}"
            :command="index"
          >
            {{item}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="time">用时：{{usedTimeFormat}}</div>
    </div>
    <GameOver
      v-if="gameOver"
      ref="gameover"
      :gameName="gameItem.name"
      :gameId="gameItem.id"
      :score="usedTimeFormat"
      @exit="exit"
      @restart="restart"
    >
      <div v-if="isSuccess" class="gameoverItem">
        用时: <i>{{ usedTimeFormat }}</i>
      </div>
      <div v-else class="fail gameoverItem">
        <i class="iconfont icon-shibaibiaoqing"></i>&nbsp;游戏失败
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
      // 游戏成功，才上传成绩
      isSuccess: false,
      // 游戏结束
      gameOver: false,
      // 获取canvas画板距离浏览器左/上的距离
      canvasLeft: 0,
      canvasTop: 0,
      // canvas 对象
      canvas: {},
      // 得到 canvas 的 2d 上下文
      ctx: {},
      /* 
       游戏等级数据
       初级 10雷 9*9=81格
       中级 40雷 16*16=256格
       高级 100雷 22*22=484格
       地狱 200雷 25*25=625格
      */
      LevelData: [
        { type: '初级', lineNum: 10, rayNum: 10 },
        { type: '中级', lineNum: 17, rayNum: 40 },
        { type: '高级', lineNum: 23, rayNum: 100 },
        { type: '地狱', lineNum: 26, rayNum: 200 }
      ],
      // 格子宽度
      gridWidth: 30,
      // 线的粗细
      lineWidth: 3,
      // 30(格子宽度) * 9(lineNum-1格子数量) + 3(线粗细) * 10(lineNum) = 300
      canvasWidth: 300,
      // 棋盘的行列 每行每列由10根线分为9个格
      lineNum: 10,
      // 雷的数量
      rayNum: 10,
      rayArr: [],
      // 所有的格子里面的数据 {x, y, score, isPlay, tag}
      // score(0:空 1-8:数字 9:雷) isPlay(是否已经打开) tag(1:旗子 2:问号)
      allArr: [],
      // 计时
      usedTime: 0,
      timer: null,
      // 设置的等级 0:初级 1:中级 2:高级 3:地狱
      selectLevelArr: ['初级','中级','高级','地狱'],
      selectLevel: 0
    };
  },
  computed: {
    // 用时
    usedTimeFormat() {
      let res = ''
      let min = parseInt(this.usedTime / 60 )
      if(min < 1) res = this.usedTime
      else if(min < 60) res = `${min}:${this.usedTime % 60}`
      else res = `${parseInt(min / 60)}:${min % 60}:${this.usedTime % 3600}`
      return res
    }
  },
  watch: {
    // 判断游戏结束
    gameOver(val) {
      if (val) {
        this.$nextTick(() => {
          clearInterval(this.timer)
            this.$refs.gameover.popshow();
          if(this.isSuccess) {
            // 发送游戏结束事件，上传最高分到数据库
            this.$emit("updateScore", this.gameItem.id, this.usedTime);
          }
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
    // 判断游戏是否结束
    allArr: {
      handler(val) {
        const isOver = val.every(arr => {
          // 所有非雷的区域都下棋，游戏才结束
          let res2 = arr.every(item => {
            if(item.score !== 9) return item.isPlay
            return true
          })
          return res2
        })
        if(isOver) {
          this.isSuccess = true
          this.gameOver = true
        }
      },
      deep: true
    }
  },
  mounted() {
    this.init()
    setTimeout(() => {
      this.getCanvasMargin();
    }, 1050);
  },
  destroyed() {
    clearInterval(this.timer)
  },
  methods: {
    init() {
      this.setLevelData()
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
      setTimeout(() => {
        this.canvas = this.$refs.canvas
        this.ctx = this.canvas.getContext("2d")
        // 画棋盘
        this.drawCheckerboard();
        // 保存棋子的坐标
        this.saveLocation();
        // 开始计时
        this.openTiming()
      }, 100);
    },
    // 设置对应等级棋盘和雷的数量
    setLevelData() {
      this.gameOver = false
      this.usedTime = 0
      clearInterval(this.timer)
      const {lineNum, rayNum} = this.LevelData[this.selectLevel]
      // 30(格子宽度) * 9(格子数量) + 3(线粗细) * 10(线的数量) = 300
      this.canvasWidth = this.gridWidth * (lineNum - 1) + this.lineWidth * lineNum
      this.lineNum = lineNum
      this.rayNum = rayNum
      // this.rayNum = 1  // 快速结束游戏
      // 清空格子和雷数组
      this.allArr.length = 0
      this.rayArr.length = 0
    },
    // 获取canvas与浏览器 左边 / 顶部 的距离
    getCanvasMargin() {
      // 获取dom元素对象与浏览器 左边/顶部 的距离 
      this.canvasLeft = this.$refs.canvas.getBoundingClientRect().left;
      this.canvasTop = this.$refs.canvas.getBoundingClientRect().top;
    },
    // 开启计时
    openTiming() {
      this.timer = setInterval(() => {
        this.usedTime += 1
      }, 1000);
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
        this.ctx.strokeStyle = "#c0cce4";
        this.ctx.stroke();
        // 竖线
        this.ctx.beginPath();
        this.ctx.moveTo(begin + gridWidth * i, begin);
        this.ctx.lineTo(begin + gridWidth * i, begin + lineLength);
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = "#c0cce4";
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
        for (let j = 0; j < gridNum; j++) {
          // 保存所有的棋子位置信息
          this.$set(this.allArr[i], j, {
            x: 15 + gridWidth * j,
            y: 15 + gridWidth * i,
            score: 0,
            isPlay: false
          })
          // tag 不用监听
          this.allArr[i][j].tag = 0
          this.drawGrid(gridWidth * j + 3, gridWidth * i + 3)
        }
      }
      // 随机生成雷
      for(let i = 0; i < this.rayNum; i++) {
        let {x, y} = this.randomRay()
        this.rayArr.push([x, y])
        this.allArr[x][y].score = 9
        this.besidRayGrid(x, y)
      }
      const rayArrRes = JSON.parse(JSON.stringify(this.rayArr))
      console.log('作弊专用，雷的位置是：', rayArrRes.sort((a,b)=> a[0] - b[0]))
    },
    // 画格子
    drawGrid(x, y) {
      let img = new Image()
      img.src = require('@/assets/img/grid.png')
      img.onload = () => {
        this.ctx.drawImage(img, x, y, this.gridWidth, this.gridWidth)
      }
    },
    // 随机生成雷
    randomRay() {
      let gridNum = this.lineNum - 2
      let x = Math.round(Math.random() * gridNum)
      let y = Math.round(Math.random() * gridNum)
      if(this.allArr[x][y].score === 9) {
        return this.randomRay()
      } else {
        return {x, y}
      }
    },
    // 雷旁边的格子加1
    besidRayGrid(x, y) {
      // 右边极限值 9-1-1 = 7
      let max = this.lineNum - 1 - 1
      // 上边
      if(y > 0) {
        x > 0 && this.allArr[x - 1][y - 1].score !== 9 && this.allArr[x - 1][y - 1].score++
        this.allArr[x][y - 1].score !== 9 && this.allArr[x][y - 1].score++
        x < max && this.allArr[x + 1][y - 1].score !== 9 && this.allArr[x + 1][y - 1].score++
      }
      // 下边 
      if(y < max) {
        x > 0 && this.allArr[x - 1][y + 1].score !== 9 && this.allArr[x - 1][y + 1].score++
        this.allArr[x][y + 1].score !== 9 && this.allArr[x][y + 1].score++
        x < max && this.allArr[x + 1][y + 1].score !== 9 && this.allArr[x + 1][y + 1].score++
      }
      // 左右剩余两个
      x > 0 && this.allArr[x - 1][y].score !== 9 && this.allArr[x - 1][y].score++
      x < max && this.allArr[x + 1][y].score !== 9 && this.allArr[x + 1][y].score++
    },
    // 点击获取鼠标位置，下棋
    getMouse(isRight, e) {
      if (this.gameOver) return;
      // canvas 中棋子的位置
      let chessX = window.event.pageX - this.canvasLeft;
      let chessY = window.event.pageY - this.canvasTop;
      // 获取鼠标点击 下棋的位置
      for (let i = 0; i < this.lineNum - 1; i++) {
        for (let j = 0; j < this.lineNum - 1; j++) {
          if (!this.allArr[i][j].isPlay) {
            let {x, y, score, tag} = this.allArr[i][j]
            if (
              chessX >= x - 15 &&
              chessX <= x + 15 &&
              chessY >= y - 15 &&
              chessY <= y + 15
            ) {
              if(isRight) {
                let newTag = tag === 0 ? 1 : ( tag === 1 ? 2 : 0)
                this.allArr[i][j].tag = newTag
                this.drawTagRay(x, y, newTag)
              } else {
                if(this.allArr[i][j].tag !== 0) return
                if(score === 0) this.openNearGrid(i, j)
                else this.drawChess(x, y, score);
                this.allArr[i][j].isPlay = true
              }
            }
          }
        }
      }
    },
    // 点击后画每一格
    drawChess(x, y, score) {
      // 画背面正方形
      this.ctx.beginPath()
      this.ctx.fillStyle = '#dbf1fb'
      this.ctx.fillRect(x - 15 + 3, y - 15 + 3, this.gridWidth, this.gridWidth)
      this.ctx.closePath()
      this.ctx.stroke();
      // 画雷
      if(score === 9) {
        let img = new Image()
        img.src = require('@/assets/img/ray.png')
        img.onload = () => {
          this.ctx.drawImage(img, x - 15 + 7, y - 15 + 7, 22, 22)
        }
        this.gameOver = true
        return
      }
      let fontColor = ''
      switch(score) {
        case 0: return;
        case 1: fontColor = '#689eeb'; break;
        case 2: fontColor = '#207210'; break;
        case 3: fontColor = '#b00e0b'; break;
        default: fontColor = '#34016e';
      }
      // 设置字体
      this.ctx.font = "20px bold 黑体";
      this.ctx.fillStyle = fontColor;
      // 设置水平对齐方式
      this.ctx.textAlign = "center";
      // 设置垂直对齐方式
      this.ctx.textBaseline = "middle";
      // 绘制文字（参数：要写的字，x坐标，y坐标）
      this.ctx.fillText(score, x + 3, y + 5);
    },
    // 右键 画旗子或问号
    drawTagRay(x, y, tag) {
      this.drawGrid(x-15+3, y-15+3)
      if(tag === 0) return
      let imgName = tag === 1 ? 'flag' : 'uncertain'
      let img = new Image()
      img.src = require(`@/assets/img/${imgName}.png`)
      img.onload = () => {
        this.ctx.drawImage(img, x - 15 + 7, y - 15 + 7, 22, 22)
      }
    },
    // 点击了附近没有雷的格子 打开旁边所有这样的格子 
    openNearGrid(i, j, isEnd) {
      let max = this.lineNum - 1 - 1
      this.allArr[i][j].isPlay = true
      let {x, y, score} = this.allArr[i][j]
      this.drawChess(x, y, score)
      // 已经打开数字了结束这个递归
      if(isEnd) return
      if(j > 0 && !this.allArr[i][j - 1].isPlay) {  // 上
        if(this.allArr[i][j - 1].score === 0) this.openNearGrid(i, j - 1)
        else this.openNearGrid(i, j - 1, true)
      } 
      if(i < max && !this.allArr[i + 1][j].isPlay) {  // 右
        if(this.allArr[i + 1][j].score === 0) this.openNearGrid(i + 1, j)
        else this.openNearGrid(i + 1, j, true)
      } 
      if(j < max && !this.allArr[i][j + 1].isPlay) {  // 下
        if(this.allArr[i][j + 1].score === 0) this.openNearGrid(i, j + 1)
        else this.openNearGrid(i, j + 1, true)
      }
      if(i > 0 && !this.allArr[i - 1][j].isPlay) {   // 左
        if(this.allArr[i - 1][j].score === 0) this.openNearGrid(i - 1, j)
        else this.openNearGrid(i - 1, j, true)
      }
    },
    // 改变等级
    changeLevel(i) {
      this.selectLevel = i
      this.init()
    },
    // 弹出层移动的回调
    popChange() {
      this.getCanvasMargin();
    },
    // 缩小
    small() {
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
    top: 12px;
    width: 100%;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: -1;
    .set {
      position: absolute;
      left: 20px;
      margin-right: 20px;
      .el-dropdown-link {
        cursor: pointer;
        padding: 2px 5px;
        border-radius: 5px;
        font-size: 16px;
        color: #fff;
      }
      .el-dropdown-link:hover {
        background: rgba(255, 255, 255, .3);
      }
    }
    .time {
      text-align: center;
      color: #052564;
    }
  }
  .fail {
    user-select: none;
    color: #052564;
    font-weight: bold;
    font-size: 18px !important;
    white-space: nowrap;
    .iconfont {
      font-size: 18px;
      color: #052564 !important;
    }
  }
}
.set-select {
  background: rgba(255, 255, 255, .3);
  .el-dropdown-menu__item {
    color: #0a3283;
  }
  .active {
    background: rgba(255, 255, 255, .7);
    color: #021842;
  }
}
</style>