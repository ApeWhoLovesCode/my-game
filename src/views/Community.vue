<template>
  <div class="community">
    <div class="title">评论区</div>
    <vue-custom-scrollbar class="scrollComment">
      <CommentItem />
      <CommentItem />
      <CommentItem />
      <CommentItem />
      <CommentItem />
      <CommentItem />
    </vue-custom-scrollbar>
  </div>
</template>

<script>
import vueCustomScrollbar from "vue-custom-scrollbar";
import "vue-custom-scrollbar/dist/vueScrollbar.css";
import CommentItem from "@/components/CommentItem.vue";
export default {
  name: "community",
  components: {
    vueCustomScrollbar,
    CommentItem,
  },
  props: {},
  data() {
    return {
      settings: {
        suppressScrollY: false,
        suppressScrollX: false,
        wheelPropagation: false,
      },
    };
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {},
};
</script>
<style lang='scss' scoped>
.community {
  // position: relative;
  position: absolute;
  left: 50%;
  top: 52%;
  transform: translate(-50%, -50%);
  width: 90%;
  height: 90%;
  background: rgba(255, 255, 255, 0.4);
  box-sizing: border-box;
  padding: 20px 30px;
  // 不提升层级scroll监听不到
  z-index: 1;
  .title {
    font-size: 16px;
    font-weight: bold;
    color: #000;
    padding-bottom: 20px;
  }
  .scrollComment {
    margin: auto;
    width: 100%;
    height: calc(100% - 40px);
  }
}
</style>