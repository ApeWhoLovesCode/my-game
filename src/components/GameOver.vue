<template>
  <myPop
    class="gameoverPop"
    ref="gameoverPop"
    :close="false"
    :width="width"
    :height="height"
  >
    <div class="title">{{ gameName }}&emsp;游戏结束</div>
    <div class="content">
      <slot></slot>
      <!-- <div class="contentItem">
          消灭敌军: <i>{{ gOScore.score }}</i>
        </div>
        <div v-if="this.gOScore.score == this.score" class="contentItem">
          逃脱敌军: <i>{{ gOScore.bugNum }}</i>
        </div>
        <div v-if="this.gOScore.bugNum == this.bugNum" class="contentItem">
          总得分: <i>{{ gOScore.final }}</i>
        </div> -->
    </div>
    <div class="bottom">
      <el-button class="cancel" @click="exit">退出游戏</el-button>
      <el-button class="confirm" @click="restart">重新开始</el-button>
    </div>
  </myPop>
</template>

<script>
import myPop from "@/components/myPop/myPop.vue";
export default {
  name: "gameover",
  components: {
    myPop,
  },
  props: {
    width: {
      type: Number,
      defalut: 50,
    },
    height: {
      type: Number,
      defalut: 50,
    },
    gameName: {
      type: String,
      defalut: "小游戏",
    },
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    popshow() {
      this.$refs.gameoverPop.popshow();
    },
    popclose() {
      this.$refs.gameoverPop.popclose();
    },
    exit() {
      this.$emit("exit");
    },
    restart() {
      this.$emit("restart");
    },
  },
};
</script>
<style lang='scss'>
/* 这里不要 scoped 因为插槽的样式要用到 */
.gameoverPop {
  .title {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 15px;
    font-weight: bold;
  }
  .content {
    position: absolute;
    left: 10%;
    top: 50%;
    transform: translateY(-50%);
    .gameoverItem {
      opacity: 0;
      font-size: 14px;
      margin-bottom: 5px;
      animation: score 0.3s linear forwards;
      i {
        color: #e9e932;
      }
    }
  }
  .bottom {
    position: absolute;
    bottom: 10px;
    right: 20px;
    .cancel {
      padding: 10px;
      font-size: 13px;
    }
    .confirm {
      padding: 10px;
      font-size: 13px;
      background: #6557f7;
      color: #fff;
    }
    .confirm:hover {
      opacity: 0.8;
    }
  }
}

@keyframes score {
  0% {
    opacity: 0;
    transform: translateX(-50%);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>