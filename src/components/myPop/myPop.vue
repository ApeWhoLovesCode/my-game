<template>
  <!-- <div v-if="isShow" class="pop-wrap"> -->
  <div
    v-if="isShow"
    v-show="!isHide"
    :style="{
      width: width + '%',
      height: height + '%',
      zIndex: outside ? '101' : '100',
      minHeight: minHeight + 'px',
    }"
    class="popContent center"
  >
    <div v-if="close" class="head">
      <img class="small" @click="small" src="./small.png" />
      <img class="close" @click="popclose" src="./close.png" />
    </div>
    <slot></slot>
  </div>
  <!-- </div> -->
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
    close: {
      type: Boolean,
      default: true,
    },
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
      console.log(1111);
      var that = this;
      // 将一些回调延迟，等到 DOM 更新之后再开始执行
      this.$nextTick(() => {
        var pop = document.querySelector(".popContent");
        // 1.当我们鼠标按下，就获得鼠标在盒子内的坐标
        var currentPageX;
        var currentPageY;
        pop.addEventListener("mousedown", (e) => {
          if (this.playState) {
            console.log("正在游戏中，无法移动");
            return;
          }
          console.log("move");
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
          if (this.playState) {
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
  top: 10px;
  right: 10px;
  height: 25px;
}
.head img {
  height: 100%;
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