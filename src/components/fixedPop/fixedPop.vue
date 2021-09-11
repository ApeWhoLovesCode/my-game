<template>
  <div v-if="isShow" ref="fixedPop" class="popContent center">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "",
  props: {
    width: {
      type: Number,
      default: 50,
    },
    height: {
      type: Number,
      default: 50,
    },
  },
  data() {
    return {
      // 是否显示(v-if)
      isShow: false,
    };
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
      // 将一些回调延迟，等到 DOM 更新之后再开始执行
      this.$nextTick(() => {
        var pop = this.$refs.fixedPop;
        // 1.当我们鼠标按下，就获得鼠标在盒子内的坐标
        pop.addEventListener("mousedown", (e) => {
          // 处于游戏状态 和 缩小状态无法移动
          if (this.playState || this.isPx) {
            return;
          }
          let x = e.pageX - pop.offsetLeft;
          let y = e.pageY - pop.offsetTop;
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
          return;
        });
      });
    },
    small() {
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
.popContent {
  position: absolute;
  background: #fff;
  border-radius: 2vw;
  box-shadow: 0 0 20px 10px rgba(31, 31, 31, 0.3);
  min-width: 350px;
  opacity: 0.9;
  z-index: 101;
}
.center {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: center 0.7s ease-out;
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