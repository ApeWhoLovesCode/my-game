import myPop from "@/components/myPop/myPop.vue";
import GameOver from "@/components/GameOver.vue";

export const mixin = {
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
  },
}