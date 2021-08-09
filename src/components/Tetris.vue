<template>
  <myPop
    ref="tetrisPop"
    class="tetrispop"
    :width="popWidth"
    :height="popHeight"
    :minHeight="650"
    :isPx="isPx"
    :smallBox="isPx ? smallBox : {}"
    :outside="gameItem.outside"
    @small="small"
    @alreadyClose="exit"
  >
    <!-- 背景容器 -->
    <div id="container" class="container">
      <div class="score">
        <div>得分: {{ score }}</div>
        <div>关卡: {{ level }}</div>
      </div>
      <div class="dotted_line"></div>
      <!-- 暂停遮罩层 -->
      <div v-show="isPause" class="paseMask">暂停中（可作弊§(*￣▽￣*)§）</div>
      <!-- 16宫格 4 * 4 -->
      <!-- 块元素 -->
      <div v-for="(item, index) in currentModel">
        <div
          v-for="(item2, index2) in item"
          :class="item[0].isFixed ? 'fixed_model' : 'activity_model'"
        ></div>
      </div>
    </div>
    <GameOver
      v-if="theGameOver"
      ref="gameover"
      :width="isPx ? 30 : 90"
      :height="30"
      :gameName="gameItem.name"
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
// import { minxin } from "@/utils/minxins.js";
import myPop from "@/components/myPop/myPop.vue";
import GameOver from "@/components/GameOver.vue";
export default {
  name: "tetris",
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
      popWidth: 30,
      popHeight: 90,
      // 常量 每次移动的距离 步长 24
      STEP: 24,
      // 分割容器 336 * 576 -> 14 * 24
      COL_COUNT: 14,
      ROW_COUNT: 24,
      // 创建每个模型的数据源
      MODELS: [
        // 第一个模型数据源(L型)
        {
          0: {
            row: 1,
            col: 0,
            isFixed: false,
          },
          1: {
            row: 1,
            col: 1,
          },
          2: {
            row: 1,
            col: 2,
          },
          3: {
            row: 0,
            col: 2,
          },
        },
        // 第二个样式(凸字型)
        {
          0: {
            row: 0,
            col: 1,
            isFixed: false,
          },
          1: {
            row: 1,
            col: 0,
          },
          2: {
            row: 1,
            col: 1,
          },
          3: {
            row: 1,
            col: 2,
          },
        },
        // 第三个样式(田字型)
        {
          0: {
            row: 0,
            col: 1,
            isFixed: false,
          },
          1: {
            row: 1,
            col: 1,
          },
          2: {
            row: 0,
            col: 2,
          },
          3: {
            row: 1,
            col: 2,
          },
        },
        // 第四个样式(一字型)
        {
          0: {
            row: 0,
            col: 0,
            isFixed: false,
          },
          1: {
            row: 0,
            col: 1,
          },
          2: {
            row: 0,
            col: 2,
          },
          3: {
            row: 0,
            col: 3,
          },
        },
        // 第五个样式(Z字型)
        {
          0: {
            row: 0,
            col: 1,
            isFixed: false,
          },
          1: {
            row: 0,
            col: 2,
          },
          2: {
            row: 1,
            col: 2,
          },
          3: {
            row: 1,
            col: 3,
          },
        },
      ],
      // 变量 所有的模型
      currentModel: [],
      // 记录所有块元素的位置
      // key = 行_列 ：value = 块元素
      fixedBlocks: {},
      // 标记16宫格的位置
      moveX: 0,
      moveY: 0,
      // 当前模型的索引
      currentIndex: -1,
      // 定时器的变量
      mInterval: null,
      // 当前分数
      score: 0,
      // 关卡
      level: 1,
      // 记录当前是是否为暂停状态
      isPause: false,
      // 暂停加载
      loading: null,
      // 判断游戏是否结束
      theGameOver: false,
      // 游戏结束显示分数的定时器
      gOTimer: null,
      // 游戏结束显示得分
      gOScore: { score: 0, final: 0 },
      // 监听浏览器窗口的防抖定时器
      windowTime: null,
    };
  },
  watch: {
    score(val, oldval) {
      if (parseInt(val / 100) != parseInt(oldval / 100)) {
        this.level++;
      }
    },
    isPause: {
      handler(val) {
        if (val) {
          clearInterval(this.mInterval);
          return;
        }
        this.autoDown();
      },
    },
    // 监听现在点的是哪个弹出层 就重新监听用户的键盘事件
    gameItem: {
      handler(val) {
        if (val.outside) this.onKeyDown();
      },
      deep: true,
    },
  },
  onLoad() {
    // this.init()
  },
  onReady() {},
  mounted() {
    // 刚开始获取浏览器的宽高
    this.popWidth = parseInt(
      (400 * 100) / document.documentElement.clientWidth
    );
    this.popHeight = parseInt(
      (630 * 100) / document.documentElement.clientHeight
    );
    this.init();
    // 监听浏览器窗口大小变化
    let that = this;
    window.addEventListener("resize", function (e) {
      this.windowTime = setTimeout(() => {
        if (e.currentTarget.outerWidth >= 1200) {
          // console.log((400 * 100) / e.currentTarget.outerWidth);
          that.popWidth = parseInt((400 * 100) / e.currentTarget.outerWidth);
        }
        if (e.currentTarget.outerHeight >= 833) {
          // console.log((700 * 100) / e.currentTarget.outerHeight);
          that.popHeight = parseInt((630 * 100) / e.currentTarget.outerHeight);
        }
      }, 50);
    });
  },
  computed: {
    // 根据得分调节速度
    speed() {
      if (this.level >= 10) {
        return 100;
      }
      return 600 - this.level * 50;
    },
    // 最终得分
    finalScore() {
      return this.score * this.level;
    },
  },
  methods: {
    // 缩小
    small() {
      // 暂停游戏
      this.isPause = true;
      clearInterval(this.mInterval);
      this.$emit("small", this.gameItem);
    },
    popshow() {
      this.$refs.tetrisPop.popshow();
    },
    // 入口方法
    init() {
      this.createModel();
      this.onKeyDown();
      setTimeout(() => {
        this.isPause = true;
      }, 550);
    },

    // 根据模型的数据源来创建对应的块元素
    createModel() {
      // 判断游戏是否已经结束了
      if (this.isGameOver()) {
        this.gameOver();
        return;
      }
      // 1.当前模型索引加一
      this.currentIndex++;
      // 重新初始化 16宫格的位置
      this.moveX = 0;
      this.moveY = 0;
      // 2.确定当前使用了哪一个模型
      // 先深拷贝数据
      // let obj = JSON.parse(JSON.stringify(this.MODELS[0]))
      // 随机数 $lodash.random (从 0 到 this.MODELS.length - 1) 之间
      let obj = this.$lodash.cloneDeep(
        this.MODELS[this.$lodash.random(0, this.MODELS.length - 1)]
      );
      // es6 将对象转为数组
      this.currentModel.push(Object.values(obj));

      // 3.设置当前块元素所在的 x, y 坐标
      this.positionModel();

      // 4.让模型自动下落
      this.autoDown();
    },

    // 监听用户的键盘事件
    onKeyDown() {
      document.onkeydown = (e) => {
        switch (e.code) {
          // 左
          case "ArrowLeft":
            this.move(-1, 0);
            break;
          // 上
          case "ArrowUp":
            // this.move(0, -1)
            this.rotate();
            break;
          // 右
          case "ArrowRight":
            this.move(1, 0);
            break;
          // 下
          case "ArrowDown":
            this.checkBound();
            this.move(0, 1);
            break;
          // 空格键
          case "Space":
            this.pause();
            break;
        }
      };
    },

    // 移动
    move(x, y) {
      if (
        this.isTouch(
          this.moveX + x,
          this.moveY + y,
          this.currentModel[this.currentIndex]
        )
      ) {
        // 底部的触碰发生在移动16宫格的时候
        // 此次移动是因为 y 轴的移动而引起的
        if (y !== 0) {
          // 模型之间底部发生了触碰
          this.fixedBottomModel();
        }
        // 表示要发生触碰
        return;
      }

      // 控制16宫格移动
      this.moveX += x;
      this.moveY += y;
      // 根据16宫格的位置重新定位块元素
      this.positionModel();
    },

    // 设置当前块元素所在的 x, y 坐标
    positionModel() {
      // 设置位置前先判断是否越界
      this.checkBound();
      this.$nextTick(function () {
        let eles = document.querySelectorAll(".activity_model");
        for (let i = 0; i < eles.length; i++) {
          // 找到每个块元素对应的数据(行、列)
          let blockModel = this.currentModel[this.currentIndex][i];
          // 根据每个块元素对应的数据来指定块元素的位置
          // 每个块元素的位置由两个值确定：
          // 1、16宫格所在的位置 this.moveX。2、块元素在16宫格的位置 blockModel.row
          let top = (this.moveY + blockModel.row) * this.STEP + "px";
          let left = (this.moveX + blockModel.col) * this.STEP + "px";
          // console.log(top)
          // console.log(left)
          this.$set(eles[i].style, "top", top);
          this.$set(eles[i].style, "left", left);
          // this.$set(eles[i].style, "fontSize", "30px")
          // console.log(eles[i].style)
          // }
        }
      });
    },

    // 旋转模型
    rotate() {
      // 克隆一下 currentModel
      let cloneCurrentModel = this.$lodash.cloneDeep(
        this.currentModel[this.currentIndex]
      );

      // 算法：
      // 移动后的行 = 移动前的列
      // 移动后的列 = 3 - 移动前的行
      cloneCurrentModel.forEach((item, index, arr) => {
        let temp = arr[index].row;
        arr[index].row = arr[index].col;
        arr[index].col = 3 - temp;
      });

      // 如果触碰了就 不需要这次旋转的操作 不保存这个旋转数据
      if (this.isTouch(this.moveX, this.moveY, cloneCurrentModel)) {
        return;
      }

      // 没有触碰 就接受了这次旋转操作
      // this.currentModel[this.currentIndex] = cloneCurrentModel
      this.currentModel[this.currentIndex].forEach((item, index, arr) => {
        let temp = arr[index].row;
        arr[index].row = arr[index].col;
        arr[index].col = 3 - temp;
      });

      this.positionModel();
    },

    // 控制模型只能在容器中移动
    checkBound() {
      // 定义模型可以活动的边界
      let leftBound = 0,
        rightBound = this.COL_COUNT,
        bottomBound = this.ROW_COUNT;
      // 当有一块元素超出了边界之后，让16宫格后退一步
      this.currentModel[this.currentIndex].forEach((item, i) => {
        // 左侧越界
        if (item.col + this.moveX < leftBound) {
          // 16宫格往右移动一步
          this.moveX++;
        }
        // 右侧越界
        if (item.col + this.moveX >= rightBound) {
          this.moveX--;
        }
        // 底部越界
        if (item.row + this.moveY >= bottomBound) {
          this.moveY--;
          // 把模型固定在底部
          this.fixedBottomModel();
        }
      });
    },

    // 把模型固定到底部
    fixedBottomModel() {
      // 1.改变模型中块元素的样式
      // 2.让模型不可以再进行移动
      this.currentModel[this.currentIndex][0].isFixed = true;

      this.$nextTick(function () {
        // 记录该块元素所在的位置
        let fixedClass = document.querySelectorAll(".fixed_model");
        for (let i = 0; i < this.currentModel[this.currentIndex].length; i++) {
          let blockModel = this.currentModel[this.currentIndex][i];
          // 固定的16宫格内的当前块索引
          let currentI =
            fixedClass.length - this.currentModel[this.currentIndex].length + i;
          this.fixedBlocks[
            this.moveY + blockModel.row + "_" + (this.moveX + blockModel.col)
          ] = fixedClass[currentI];
        }

        // 判断是否要请空该行
        this.isRemoveLine();

        // 3.创建新的模型
        this.createModel();
      });
    },

    // 判断模型之间的触碰问题
    // x,y 表示16宫格（将要/下一步）移动的位置
    // model 表示当前模型数据源（将要）完成的变化（旋转等）
    isTouch(x, y, model) {
      // 判断触碰，就是判断活动中的模型（将要移动到的位置）是否已经存在被固定的（块元素）
      // 如果存在返回 true 表示（将要）移动的位置会发生触碰
      for (let k in model) {
        let blockModel = model[k];
        // 该位置是否已经存在块元素?
        if (this.fixedBlocks[y + blockModel.row + "_" + (x + blockModel.col)]) {
          return true;
        }
      }
      return false;
    },

    // 判断一行是否被铺满
    isRemoveLine() {
      // 一行中每列都存在块元素
      // 遍历所有行
      for (let i = 0; i < this.ROW_COUNT; i++) {
        // 标记符: 假设当前行已经被铺满了
        let flag = true;
        // 遍历所有列
        for (let j = 0; j < this.COL_COUNT; j++) {
          // 如果当前行中有一列没有数据，那么就说明当前行没有被铺满
          if (!this.fixedBlocks[i + "_" + j]) {
            flag = false;
            break;
          }
        }
        if (flag) {
          // 该行已经被铺满了
          this.removeLine(i);
          // 得分++
          this.score += 100;
        }
      }
    },

    // 清理被铺满的这行
    removeLine(line) {
      this.$nextTick(function () {
        // 获取所有 块元素外面的 16 宫格
        let allNodes = document.querySelector("#container").childNodes;
        console.log(allNodes);
        // 遍历该行中的所有列
        for (let i = 0; i < this.COL_COUNT; i++) {
          // 1.删除该行中所有的块元素
          allNodes.forEach((item) => {
            for (let j = 0; j < item.children.length; j++) {
              // 如果删除了一个块元素就退出循环
              if (item.children[j] === this.fixedBlocks[line + "_" + i]) {
                item.removeChild(this.fixedBlocks[line + "_" + i]);
                return;
              }
            }
          });

          // 2.删除该行中所有块元素的数据源
          this.fixedBlocks[line + "_" + i] = null;
        }
        this.downLine(line);
      });
    },

    // 让被清理行上的块元素下落
    downLine(line) {
      // 遍历被清理行之上的所有行
      for (let i = line - 1; i >= 0; i--) {
        // 该行中的所有列
        for (let j = 0; j < this.COL_COUNT; j++) {
          // 如果没有数据 就跳到下一次循环
          if (!this.fixedBlocks[i + "_" + j]) continue;
          // 存在数据
          // 1.被清理行之上的 所有块元素 的数据源 的行数 + 1
          this.fixedBlocks[i + 1 + "_" + j] = this.fixedBlocks[i + "_" + j];
          // 2.让块元素在容器中的位置下落
          this.fixedBlocks[i + 1 + "_" + j].style.top =
            (i + 1) * this.STEP + "px";
          // 3.清理掉之前的块元素
          this.fixedBlocks[i + "_" + j] = null;
        }
      }
    },

    // 让模型自动下落
    autoDown() {
      if (this.mInterval) {
        clearInterval(this.mInterval);
      }
      this.mInterval = setInterval(() => {
        this.move(0, 1);
      }, this.speed);
    },

    // 暂停
    pause() {
      this.isPause = !this.isPause;
      // if (!this.isPause) {
      //   this.isPause = !this.isPause;
      //   clearInterval(this.mInterval);
      //   // this.loading = this.$loading.service({
      //   //   lock: true,
      //   //   text: "作弊暂停中！！（可移动）",
      //   //   spinner: "el-icon-loading",
      //   //   background: "rgba(0, 0, 0, 0.7)",
      //   // });
      //   return;
      // }
      // // this.loading.close();
      // this.isPause = !this.isPause;
      // this.autoDown();
    },

    // 判断游戏结束
    isGameOver() {
      // 当第 0 行有元素时
      for (let i = 0; i < this.COL_COUNT; i++) {
        // if (this.fixedBlocks["23_" + i]) {
        if (this.fixedBlocks["3_" + i]) {
          return true;
        }
      }
      return false;
    },

    // 结束掉游戏
    gameOver() {
      this.theGameOver = true;
      // 1.停止定时器
      if (this.mInterval) {
        clearInterval(this.mInterval);
      }

      this.$nextTick(() => {
        // 2.弹出游戏结束对话框
        this.$refs.gameover.popshow();
        this.scoreShow();
      });
    },
    // 得分分段式显示
    scoreShow() {
      setTimeout(() => {
        // 增加的值 控制在 1 秒
        let addScore = this.score >= 100 ? parseInt(this.score / 100) : 1;
        let addFinal =
          this.finalScore >= 100 ? parseInt(this.finalScore / 100) : 1;
        this.gOTimer = setInterval(() => {
          if (this.gOScore.score != this.score) {
            this.gOScore.score += addScore;
          } else {
            if (this.gOScore.final != this.finalScore) {
              this.gOScore.final += addFinal;
            } else {
              clearInterval(this.gOTimer);
            }
          }
        }, 10);
      }, 100);
    },
    exit() {
      // 1.停止定时器
      if (this.mInterval) {
        clearInterval(this.mInterval);
      }
      this.$emit("gameoverFn", this.gameItem.id);
    },
    restart() {
      this.$emit("restartFn", this.gameItem.id);
    },
  },
};
</script>

<style lang="scss" scoped>
/* 颜色变量 */
$bgc-color: #cbe4f8;
$bgc-deep-color: #8cb4b7;
$base-color: #58b1b6;
/* 游戏区域大小 */
$game-width: 336px;
$game-height: 576px;
$game-item: 24px;
.tetrispop {
  // background-color: #50a09d;
  background: linear-gradient(to right, #50a09d, #78d4d1, #50a09d);
}
.container {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: $game-width;
  height: $game-height;
  border-radius: 10px;
  background-image: linear-gradient(to bottom, $bgc-color, $bgc-deep-color);
  // 虚线
  .dotted_line {
    position: absolute;
    top: 91px; // 4行 * 24 - 5
    left: 0;
    right: 0;
    border-bottom: 5px dotted #58b1b6;
  }
  // 成绩
  .score {
    position: absolute;
    right: 30px;
    top: 20px;
    color: #58b1b6;
    font-size: 20px;
    z-index: 1;
  }
  // v-hrml 类名前面加这个才会有效果 /deep/
  .activity_model {
    position: absolute;
    left: 0;
    top: 0;
    box-sizing: border-box;
    display: inline-block;
    width: $game-item;
    height: $game-item;
    background-color: $base-color;
    border: 3px solid #f5f5f5;
    border-radius: 5px;
  }
  // 固定到底部添加的类名
  .fixed_model {
    position: absolute;
    box-sizing: border-box;
    display: inline-block;
    width: $game-item;
    height: $game-item;
    background-color: #fefefe;
    border: 3px solid #999999;
    border-radius: 5px;
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
  }
}
</style>
