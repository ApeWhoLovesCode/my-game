<template>
  <div class="commentItemTwo">
    <div class="left">
      <img :src="replys.avatar" />
    </div>
    <div class="right">
      <!-- 一级评论 -->
      <div class="content">
        <span class="name">{{ replys.nickname }}</span>
        {{ replys.content }}
      </div>
      <div class="bottom">
        <div class="bottomItem">
          <span class="iconfont icon-dianzan_kuai"></span>
          <span>102</span>
        </div>
        <div class="bottomItem">
          <span class="iconfont icon-dianzan_kuai cai"></span>
          <span>5</span>
        </div>
        <div class="bottomItem" @click="isReplyShow">
          <span class="iconfont icon-pinglun"></span>
          <span>回复</span>
        </div>
        <span class="time">{{ createTime }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "commentItemTwo",
  props: {
    replys: {
      type: Object,
      require: false,
    },
    isReply: {
      type: Boolean,
    },
  },
  data() {
    return {};
  },
  computed: {
    createTime() {
      let str = moment(this.replys.createTime).format("yyyy-MM-DD hh:mm:ss");
      return str;
    },
  },
  watch: {},
  mounted() {},
  methods: {
    isReplyShow() {
      this.$emit("isReplyShow", this.replys.nickname);
    },
  },
};
</script>
<style lang='scss' scoped>
.commentItemTwo {
  width: 100%;
  padding: 10px 0;
  display: flex;
  .left {
    width: 50px;
    img {
      margin-top: 10px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      overflow: hidden;
    }
  }
  .right {
    flex: 1;
    .content {
      font-size: 13px;
      padding: 5px 10px 5px 0;
      .name {
        font-size: 14px;
        font-weight: bold;
        color: #c4c3d8;
        margin-right: 15px;
      }
    }
    .bottom {
      display: flex;
      align-items: center;
      .bottomItem {
        color: #d1d1d1;
        margin-right: 25px;
        cursor: pointer;
        span {
          font-size: 13px;
        }
        .iconfont {
          font-size: 14px;
          margin-right: 6px;
        }
        .cai {
          display: inline-block;
          transform: rotateX(180deg);
        }
      }
      .bottomItem:hover {
        color: #889de2 !important;
      }
      .time {
        color: #c2c2c2;
        font-size: 12px;
      }
    }
  }
}
</style>