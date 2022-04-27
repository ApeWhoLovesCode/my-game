<template>
  <myPop
    ref="bridPop"
    class="bridpop"
    :width="popWidth"
    :height="popHeight"
    :isPx="isPx"
    :smallBox="isPx ? smallBox : {}"
    :outside="gameItem.outside"
    @small="small"
    @alreadyClose="exit"
  >
    <canvas
      @click="birdUp"
      ref="canvas"
      id="mycanvas"
      width="750"
      height="500"
    ></canvas>
    <div class="score">
      <span>得分：{{ score }}</span>
      <span>等级：{{ level }}</span>
    </div>
    <div v-if="isPause" class="pause">暂停中，按空格继续~</div>
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
        等级: <i>{{ level }}</i>
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
      // 弹出层的宽高 px
      popWidth: 40,
      popHeight: 80,
      // 当前分数
      score: 0,
      // 关卡
      level: 1,
      // 游戏结束
      gameOver: false,
      // 记录当前是是否为暂停状态
      isPause: true,
      // 游戏结束显示分数的定时器
      gOTimer: null,
      // 游戏结束显示得分
      gOScore: { score: 0, final: 0 },
      // canvas 对象
      canvas: {},
      // 得到 canvas 的 2d 上下文
      ctx: {},
      // 系统时间
      // 所有静态图片资源
      imglist: {
        bird: require("../assets/img/birdimg/birds.png"),
        land: require("../assets/img/birdimg/land750.png"),
        pipe_t: require("../assets/img/birdimg/pipe_t.png"),
        pipe_b: require("../assets/img/birdimg/pipe_b.png"),
        sky: require("../assets/img/birdimg/sky750.png"),
      },
      // 加载完成的图片
      imgOnloadObj: null,
      // 点击小鸟上升的值
      clickUpNum: -2,
      bird: {
        x: 100,
        y: 100,
        w: 52, // 图片中鸟的宽和高
        h: 45,
        speed: 1.5, // 下落速度
        addSpeed: 0.05, // 增加速度
      },
      // x 方向的速度
      xSpeed: 2,
      // 地 天
      land: { x: 0, x2: 750, y: 112, addSpeed: 0.05 },
      sky: { x: 0, x2: 750, addSpeed: 0.05 },
      // 管 gapY: 上下管的间隙 x:左右管的间隙。 index:判断当前是鸟经过第几个管
      pipe: { x: 0, gapY: 120, gapX: 200.5, index: 0 },
      allPipe: [],
    };
  },
  computed: {
    // 最终得分
    finalScore() {
      return this.score * this.level;
    },
  },
  watch: {
    isPause(val) {
      if (!val) {
        this.startAnimation();
      }
    },
    bird: {
      handler(b) {
        // 撞到地或天空了
        if (b.y <= b.h / 3 || b.y >= this.canvas.height - this.land.y - b.h / 2) {
          this.gameOver = true;
        }
        // 撞到管道了
        for (let p of this.allPipe) {
          if (
            b.x >= p.x &&
            b.x <= p.x + 52 &&
            !(b.y > p.r && b.y < p.r + this.pipe.gapY)
          ) {
            this.gameOver = true;
          }
        }
      },
      deep: true,
    },
    // 判断得分
    allPipe: {
      handler(val) {
        for (let i in val) {
          if (val[i].x < 48 && i == this.pipe.index) {
            this.pipe.index = i * 1 + 1;
            this.score += 10;
            if (this.pipe.index == val.length) {
              this.pipe.index = 0;
            }
            return;
          }
        }
      },
      deep: true,
    },
    // 监听得分变化，提升速度
    score(val, oldval) {
      if (parseInt(val / 20) != parseInt(oldval / 20)) {
        this.level++;
        this.xSpeed += 0.5;
        this.bird.addSpeed += 0.01;
        this.clickUpNum -= 0.2;
      }
    },
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
    gameItem: {
      handler(val) {
        if (val.outside) this.onKeyDown();
      },
      deep: true,
    },
  },
  mounted() {
    // 刚开始获取浏览器的宽高
    this.popWidth = parseInt((800 * 100) / document.documentElement.clientWidth);
    this.popHeight = parseInt((600 * 100) / document.documentElement.clientHeight);
    // 监听浏览器窗口大小变化
    window.addEventListener("resize", this.getPopInfo);
    this.init();
  },
  destroyed() {
    window.removeEventListener('resize', this.getPopInfo)
  },  
  methods: {
    getPopInfo(e) {
      this.popWidth = parseInt((800 * 100) / e.currentTarget.innerWidth);
      this.popHeight = parseInt((600 * 100) / e.currentTarget.innerHeight);
    },
    // 初始化
    init() {
      setTimeout(() => {
        this.canvas = this.$refs.canvas;
        this.ctx = this.canvas.getContext("2d");
        // 根据地图宽度 生成对应数量的管  (750 + 52 ) / 4 = 200.5
        for (
          let n = 401;
          n <= this.canvas.width + 200.5 + 52;
          n += this.pipe.gapX
        ) {
          // r: 管突出的距离
          this.allPipe.push({
            x: n,
            // 随机数为：天空到地面的距离 / 2 (限制最小为 54) 500-112=388
            r: parseInt(Math.random() * 140 + 54),
          });
        }
        this.onKeyDown()
        // 加载图片
        let that = this;
        this.loadImage(this.imglist, function (imgObj) {
          that.imgOnloadObj = imgObj
          that.startAnimation()
        });
      }, 300);
    },
    // 开启动画绘画
    startAnimation() {
      let that = this;
      (function go() {
        that.run();
        if (that.isPause || that.gameOver) {
          return
        }
        // 时间间隔为 1000/60 每秒 60 帧
        requestAnimationFrame(go);
      })();
    },
    run() {
      const imgObj = this.imgOnloadObj
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      // 天
      this.updateSky();
      this.drawSky(imgObj["sky"]);
      // 管
      this.updatePipe();
      this.drawPipe(imgObj["pipe_t"], imgObj["pipe_b"]);
      // 地
      this.updateLand();
      this.drawLand(imgObj["land"]);
      // 鸟
      this.updateBird();
      this.drawBird(imgObj["bird"]);
    },
    // 画鸟
    drawBird(img) {
      let b = this.bird;
      this.ctx.save(); // 保存当前的绘图状态
      this.ctx.translate(b.x, b.y);
      // 弧长 = nπr / 180，n是角度数
      this.ctx.rotate((Math.PI / 180) * 10 * b.speed);
      // (image, x, y, 切片width, 切片height, 切片x, y, w, h)
      this.ctx.drawImage(img, 0, 0, b.w, b.h, -b.w / 2, -b.h / 2, b.w, b.h);
      this.ctx.restore(); // 恢复之前保存的绘图状态
    },
    // 更新鸟
    updateBird() {
      this.bird.y += this.bird.speed;
      // 加快下落速度
      this.bird.speed += this.bird.addSpeed;
    },
    // 画管
    drawPipe(imgTop, imgBottom) {
      for (let p of this.allPipe) {
        // 管突出的距离   420是管的长度
        this.ctx.drawImage(imgTop, p.x, p.r - 420);
        this.ctx.drawImage(imgBottom, p.x, p.r + this.pipe.gapY);
        // 52 管的宽度
        if (p.x <= -52) {
          p.x = 750;
          p.r = parseInt(Math.random() * 120 + 74);
        }
      }
    },
    // 更新管
    updatePipe() {
      for (let p of this.allPipe) {
        p.x -= this.xSpeed;
      }
    },
    // 画地
    drawLand(img) {
      this.ctx.drawImage(img, this.land.x, this.canvas.height - this.land.y); // x 和 y 坐标
      this.ctx.drawImage(img, this.land.x2, this.canvas.height - this.land.y);
    },
    // 更新地
    updateLand() {
      this.land.x -= this.xSpeed;
      this.land.x2 -= this.xSpeed;
      this.land.x <= -750 ? (this.land.x = 750) : "";
      this.land.x2 <= -750 ? (this.land.x2 = 750) : "";
    },
    // 画天空
    drawSky(img) {
      this.ctx.drawImage(img, this.sky.x, 0);
      this.ctx.drawImage(img, this.sky.x2, 0);
    },
    // 更新天空
    updateSky() {
      this.sky.x -= this.xSpeed;
      this.sky.x2 -= this.xSpeed;
      this.sky.x <= -750 ? (this.sky.x = 750) : "";
      this.sky.x2 <= -750 ? (this.sky.x2 = 750) : "";
    },
    // 点击画板 小鸟上升
    birdUp() {
      if(this.isPause) return
      this.bird.speed = this.clickUpNum;
    },
    // 加载图片
    loadImage(imgUrl, callback) {
      var imgObj = {}; // 保存图片资源
      var tempImg,
        imgLength = 0,
        loaded = 0;
      for (var key in imgUrl) {
        imgLength++; // 初始化要加载图片的总数
        tempImg = new Image();
        tempImg.src = imgUrl[key];
        imgObj[key] = tempImg;
        tempImg.onload = function () {
          loaded++; // 统计已经加载完毕的图像
          // 所有的图片都加载完毕
          if (loaded >= imgLength) {
            // 把加载完毕的资源传给回调供其使用
            callback(imgObj);
          }
        };
      }
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
          case "Space": this.isPause = !this.isPause; break;
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
      this.$refs.bridPop.popshow();
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
.bridpop {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to bottom, #44a8b1, #cac586);
  #mycanvas {
    border-radius: 8px;
    color: #aa9cc5;
  }
  .pause {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba($color: #000000, $alpha: .5);
    color: #fff;
    padding: 8px 16px;
    border-radius: 4px;
    user-select: none;
  }
  .score {
    position: absolute;
    left: 50%;
    top: 12px;
    transform: translateX(-50%);
    color: #ccc926;
    font-size: 18px;
    user-select: none;
  }
  .score span:first-child {
    margin-right: 20px;
  }
}
</style>