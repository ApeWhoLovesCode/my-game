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
    <GameOver
      v-if="gameOver"
      ref="gameover"
      :width="isPx ? 30 : 65"
      :height="35"
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
      popWidth: 30,
      popHeight: 90,
      // 游戏结束
      gameOver: false,
    };
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    // 缩小
    small() {
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
</style>