<template>
  <div v-if="isShow" class="pop-wrap">
    <div :style="{ width: popWidth, height: popHeight}" :class="direction" class="popContent">
      <div v-if="title" class="adminPop-title">{{ title }}</div>
      <div v-if="close" class="adminPop-close el-icon-close" @click="popclose" />
      <slot />
    </div>
    <div class="adminPop-mask" @click="popclose" />
  </div>
</template>

<script>
export default {
  name: 'adminPop',
  props: {
    direction: {
      type: String,
      default: 'center'
    },
    // 为 1 的时候为自适应
    width: {
      type: Number,
      default: 400
    },
    // 为 1 的时候为自适应
    height: {
      type: Number,
      default: 300
    },
    close: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isShow: false
    }
  },
  computed: {
    popWidth() {
      if (this.width === 1) return 'auto'
      if (this.direction === 'top' || this.direction === 'bottom') {
        return 100 + '%'
      }
      return this.width + 'px'
    },
    popHeight() {
      if (this.height === 1) return 'auto'
      if (this.direction === 'left' || this.direction === 'right') {
        return 100 + '%'
      }
      return this.height + 'px'
    }
  },
  watch: {
    isShow(val) {
      if (val && this.direction === 'center') {
        this.popMove()
      }
    }
  },
  methods: {
    // 控制弹出层移动的方法
    popMove() {
      // 将一些回调延迟，等到 DOM 更新之后再开始执行
      this.$nextTick(() => {
        var pop = document.querySelector('.popContent')
        // 1.当我们鼠标按下，就获得鼠标在盒子内的坐标
        pop.addEventListener('mousedown', (e) => {
          const x = e.pageX - pop.offsetLeft
          const y = e.pageY - pop.offsetTop
          // 2.鼠标移动的时候 把鼠标在页面中的坐标 减去鼠标在盒子内的坐标 就是模态框的坐标
          document.addEventListener('mousemove', move)
          function move(e) {
            pop.style.left = e.pageX - x + 'px'
            pop.style.top = e.pageY - y + 'px'
          }
          // 3.鼠标弹起，就让鼠标移动事件移除
          document.addEventListener('mouseup', function() {
            document.removeEventListener('mousemove', move)
          })
        })
      })
    },
    popshow() {
      this.isShow = true
    },
    popclose() {
      this.isShow = false
    }
  }
}
</script>
<style scoped lang="scss">
.pop-wrap {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 999;
  .popContent {
    position: fixed;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 0 20px #777;
    z-index: 999;
    padding: 15px 30px;
    .adminPop-title {
      width: 100%;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 10px;
      cursor: default;
      user-select: none;
    }
    .adminPop-close {
      position: absolute;
      top: 15px;
      right: 15px;
      font-size: 24px;
      cursor: pointer;
      z-index: 999;
    }
  }
  .adminPop-mask {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 998;
  }
  .center {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: center 0.6s ease;
  }
  .top {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    animation: top 0.6s ease-out forwards;
  }
  .bottom {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    animation: bottom 0.6s ease-out forwards;
  }
  .left {
    height: 100%;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    animation: left 0.6s ease-out forwards;
  }
  .right {
    height: 100%;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    animation: right 0.6s ease-out forwards;
  }
  @keyframes center {
    0% {
      opacity: 0;
      transform: translate(-50%, -150%);
    }
    65% {
      opacity: 1;
      transform: translate(-50%, -40%);
    }
    100% {
      transform: translate(-50%, -50%);
    }
  }
  @keyframes top {
    from {
      top: -50%;
      opacity: 0;
    }
    to {
      top: 0;
      opacity: 1;
    }
  }
  @keyframes bottom {
    from {
      bottom: -50%;
      opacity: 0;
    }
    to {
      bottom: 0;
      opacity: 1;
    }
  }
  @keyframes left {
    from {
      left: -50%;
      opacity: 0;
    }
    to {
      left: 0;
      opacity: 1;
    }
  }
  @keyframes right {
    from {
      right: -50%;
      opacity: 0;
    }
    to {
      right: 0;
      opacity: 1;
    }
  }
}
</style>
