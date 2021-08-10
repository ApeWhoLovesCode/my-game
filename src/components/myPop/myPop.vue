<template>
  <!-- <div v-if="isShow" class="pop-wrap"> -->
  <div
    v-if="isShow"
    v-show="!isHide"
    ref="mypop"
    :style="{
      width: popWidth,
      height: popHeight,
      zIndex: outside ? '101' : '100',
      minHeight: minHeight + 'px',
      top: popPosition.top,
      left: popPosition.left,
      background: isPx
        ? 'linear-gradient(to right, #24243e, #332d77, #24243e)'
        : '',
    }"
    class="popContent center"
  >
    <div v-if="close" class="head">
      <!-- <img v-show="!isPx" class="small" @click="small" src="./small.png" />
      <img v-show="!isPx" class="close" @click="popclose" src="./close.png" /> -->
      <span v-show="!isPx" class="small iconfont icon-minus" @click="small" />
      <span
        v-show="!isPx"
        class="close iconfont icon-close"
        @click="popclose"
      />
    </div>
    <slot></slot>
  </div>
  <!-- </div> -->
</template>

<script>
export default {
  name: "",
  props: {
    // 是否是采用 px 作为单位(缩小状态)
    isPx: {
      type: Boolean,
      default: false,
    },
    smallBox: {
      type: Object,
      require: false,
    },
    width: {
      type: Number,
      default: 50,
    },
    height: {
      type: Number,
      default: 50,
    },
    // 用于关闭 缩小和关闭按钮
    close: {
      type: Boolean,
      default: true,
    },
    // 点击的弹出层的优先级
    outside: {
      type: Boolean,
      default: false,
    },
    playState: {
      type: Boolean,
      default: false,
    },
    minHeight: {
      type: Number,
      require: false,
    },
  },
  data() {
    return {
      // 是否显示(v-if)
      isShow: false,
      // 是否隐藏(用于缩小)
      isHide: false,
    };
  },
  computed: {
    popWidth() {
      if (this.isPx) {
        // setTimeout(() => {
        return this.smallBox.width + "px";
        // }, 1000);
      } else {
        return this.width + "%";
      }
    },
    popHeight() {
      if (this.isPx) {
        // setTimeout(() => {
        return this.smallBox.height + "px";
        // }, 1000);
      } else {
        return this.height + "%";
      }
    },
    popPosition() {
      if (this.isPx) {
        // setTimeout(() => {
        return {
          left: this.smallBox.left + "px",
          top: this.smallBox.top + "px",
        };
        // }, 1000);
      } else {
        return { top: 50 + "%", left: 50 + "%" };
      }
    },
  },
  watch: {
    isShow(val) {
      if (val) {
        this.popMove();
      }
    },
  },
  methods: {
    // 控制弹出层移动的方法
    popMove() {
      var that = this;
      // 将一些回调延迟，等到 DOM 更新之后再开始执行
      this.$nextTick(() => {
        // var pop = document.querySelector(".popContent"); // 先获取飞机会获取错误
        var pop = this.$refs.mypop;
        // console.log(pop);
        // 1.当我们鼠标按下，就获得鼠标在盒子内的坐标
        var currentPageX;
        var currentPageY;
        pop.addEventListener("mousedown", (e) => {
          // 处于游戏状态 和 缩小状态无法移动
          if (this.playState || this.isPx) {
            return;
          }
          let x = e.pageX - pop.offsetLeft;
          let y = e.pageY - pop.offsetTop;
          currentPageX = e.pageX;
          currentPageY = e.pageY;
          // 2.鼠标移动的时候 把鼠标在页面中的坐标 减去鼠标在盒子内的坐标 就是模态框的坐标
          document.addEventListener("mousemove", move);
          function move(e) {
            pop.style.left = e.pageX - x + "px";
            pop.style.top = e.pageY - y + "px";
          }
          // 3.鼠标弹起，就让鼠标移动事件移除
          document.addEventListener("mouseup", function (e) {
            document.removeEventListener("mousemove", move);
          });
        });
        pop.addEventListener("mouseup", (e) => {
          if (this.playState || this.isPx) {
            // console.log("正在游戏中，无法移动");
            return;
          }
          // 将鼠标移动的距离告诉飞机大战
          that.$emit(
            "popChange",
            e.pageX - currentPageX,
            e.pageY - currentPageY
          );
        });
      });
    },
    // 弹出层移动的方法

    small() {
      // this.isHide = true;
      this.$emit("small");
    },
    popshow() {
      this.isShow = true;
    },
    popclose() {
      this.$emit("alreadyClose");
      this.isShow = false;
    },
  },
};
</script>
<style scoped>
.tsx {
  background: greenyellow;
}
.popContent {
  position: absolute;
  /* z-index: 101; */
  background: #fff;
  border-radius: 2vw;
  box-shadow: 0 0 20px 10px rgba(31, 31, 31, 0.3);
  min-width: 350px;
}
.center {
  top: 50%;
  left: 50%;
  /* margin: -25% 0 0 -25%; */
  transform: translate(-50%, -50%);
  animation: center 0.6s ease-out;
}
.head {
  position: absolute;
  top: 11px;
  right: 13px;
  height: 25px;
}
.head span {
  display: inline-block;
  height: 100%;
  font-size: 24px;
  cursor: pointer;
}
.small {
  margin-right: 10px;
}

@keyframes center {
  from {
    left: 0;
    top: 0;
    opacity: 0;
  }
  to {
    opacity: 1;
    left: 50%;
    top: 50%;
  }
}
</style>