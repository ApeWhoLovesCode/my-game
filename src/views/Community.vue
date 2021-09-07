<template>
  <div
    class="community"
    :class="isCommunityShow ? 'communityShow' : 'communityHide'"
  >
    <div class="title">评论区</div>
    <vue-custom-scrollbar class="scrollComment">
      <CommentItem
        v-for="item in commentList"
        :key="item.id"
        :comments="item"
      />
    </vue-custom-scrollbar>
  </div>
</template>

<script>
import vueCustomScrollbar from "vue-custom-scrollbar";
import "vue-custom-scrollbar/dist/vueScrollbar.css";
import CommentItem from "@/components/CommentItem.vue";
import api from "../utils/api.js";
export default {
  name: "community",
  components: {
    vueCustomScrollbar,
    CommentItem,
  },
  props: {
    isCommunityShow: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      commentList: [],
    };
  },
  computed: {},
  watch: {},
  mounted() {
    this.getCommentList();
  },
  methods: {
    async getCommentList() {
      const { data: list } = await api.getCommentList();
      console.log(list.data);
      this.commentList = list.data;
    },
  },
};
</script>
<style lang='scss' scoped>
.community {
  position: absolute;
  left: 50%;
  top: 52%;
  transform: translate(-50%, -50%);
  width: 90%;
  height: 90%;
  // background: rgba(255, 255, 255, 0.4);
  background: #7f7d98;
  border-radius: 5px;
  box-sizing: border-box;
  padding: 20px 30px;
  // 不提升层级scroll监听不到
  z-index: 95;
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
.community .commentItem:last-child {
  border-bottom: 0;
}
.communityShow {
  animation: show 0.8s ease both;
}
.communityHide {
  animation: hide 0.8s ease both;
}
@keyframes show {
  0% {
    opacity: 0;
    transform: translate(150%, -50%);
  }
  60% {
    opacity: 1;
    transform: translate(-53%, -50%);
  }
  100% {
    transform: translate(-50%, -50%);
  }
}
@keyframes hide {
  0% {
    transform: translate(-50%, -50%);
  }
  40% {
    opacity: 1;
    transform: translate(-53%, -50%);
  }
  100% {
    opacity: 0;
    transform: translate(150%, -50%);
  }
}
</style>