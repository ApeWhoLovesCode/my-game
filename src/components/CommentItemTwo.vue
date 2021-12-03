<template>
  <div class="commentItemTwo">
    <div class="left">
      <img :src="replys.avatar" />
    </div>
    <div class="right">
      <div class="content">
        <span class="name">{{ replys.name }}</span>
        <span v-if="replys.to_user" class="reply">回复<i class="reply-user">@{{replys.to_user}}：</i></span>
        {{ replys.content }}
      </div>
      <div class="bottom">
        <span class="time">{{ replys.creat_time }}</span>
        <div class="bottomItem">
          <span class="iconfont icon-dianzan_kuai"></span>
          <span>{{replys.like}}</span>
        </div>
        <div class="bottomItem">
          <span class="iconfont icon-dianzan_kuai cai"></span>
          <span>{{replys.no_like}}</span>
        </div>
        <div class="bottomItem" @click="isReplyShow">
          <span class="iconfont icon-pinglun"></span>
          <span>回复</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import moment from "moment";
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
  // computed: {
  //   createTime() {
  //     let str = moment(this.replys.createTime).format("yyyy-MM-DD hh:mm:ss");
  //     return str;
  //   },
  // },
  watch: {},
  mounted() {},
  methods: {
    isReplyShow() {
      this.$emit("isReplyShow", this.replys);
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
      // 字间距
      letter-spacing: 2px;
      line-height: 22px;
      .name {
        font-size: 14px;
        color: #eeeeee;
        margin-right: 10px;
      }
      .reply {
        .reply-user {
          margin-left: 5px;
          color: #b9abf6;
        }
      }
    }
    .bottom {
      display: flex;
      align-items: center;
      .bottomItem {
        color: #d1d1d1;
        margin-left: 25px;
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