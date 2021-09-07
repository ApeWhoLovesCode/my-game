<template>
  <div class="commentItem">
    <div class="left">
      <img :src="comments.avatar" />
    </div>
    <div class="right">
      <div class="header">
        <span class="name">{{ comments.nickname }}</span>
        <span class="gameName">#贪吃蛇</span>
      </div>
      <!-- 一级评论 -->
      <div class="content">
        {{ comments.content }}
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
        <div class="bottomItem" @click="replyClick">
          <span class="iconfont icon-pinglun"></span>
          <span>回复</span>
        </div>
        <span class="time">{{ createTime }}</span>
      </div>
      <!-- 二级评论 -->
      <div class="twoComment">
        <CommentItemTwo
          v-for="item in replyComments22"
          :key="item.id"
          :replys="item"
          :isReply="isReply"
          @isReplyShow="isReplyShow"
        />
        <div class="seeReply" v-if="!isShowMoreReply">
          共有{{ comments.replyComments.length }}条回复,
          <span @click="isShowMoreReply = true">点击查看</span>
        </div>
        <template v-if="isShowMoreReply">
          <CommentItemTwo
            v-for="item in moreReplyComments"
            :key="item.id"
            :replys="item"
            :isReply="isReply"
            @isReplyShow="isReplyShow"
          />
        </template>
      </div>
      <!-- 回复 -->
      <div class="reply" v-if="isReply">
        <el-input
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 5 }"
          :placeholder="replyPlaceholder"
          v-model="replyContent"
        />
        <el-button type="small">发表评论</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import CommentItemTwo from "@/components/CommentItemTwo.vue";
import moment from "moment";

export default {
  name: "commentItem",
  components: {
    CommentItemTwo,
  },
  props: {
    comments: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      isReply: false,
      // 回复的内容
      replyContent: "",
      // 回复的人名
      replyName: this.comments.nickname,
      // 超过 3 个的二级评论
      moreReplyComments: [],
      // 显示更多回复
      isShowMoreReply: true,
    };
  },
  computed: {
    // 处理后端的时间字符串
    createTime() {
      let str = moment(this.comments.createTime).format("yyyy-MM-DD hh:mm:ss");
      return str;
    },
    // 回复的人
    replyPlaceholder() {
      return "回复 @" + this.replyName + "：";
    },
    // 截取前三个评论，多余的存到另一个数组中
    replyComments22() {
      let replyList = this.comments.replyComments;
      if (replyList.length <= 3) {
        return replyList;
      } else {
        this.moreReplyComments = replyList.slice(3, replyList.length);
        this.isShowMoreReply = false;
        return replyList.slice(0, 3);
      }
    },
  },
  watch: {},
  methods: {
    // 点击了回复
    replyClick() {
      if (this.comments.nickname == this.replyName) {
        this.isReply = !this.isReply;
      } else {
        this.replyName = this.comments.nickname;
        this.isReply = true;
      }
    },
    isReplyShow(name) {
      if (name == this.replyName) {
        this.isReply = !this.isReply;
      } else {
        this.replyName = name;
        this.isReply = true;
      }
    },
  },
};
</script>
<style lang='scss' scoped>
.commentItem {
  width: 100%;
  padding: 20px 0;
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  .left {
    width: 50px;
    margin-right: 10px;
    img {
      margin-top: 10px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
    }
  }
  .right {
    flex: 1;
    .name {
      font-size: 14px;
      font-weight: bold;
      color: #474294;
      margin-right: 15px;
    }
    .gameName {
      font-size: 14px;
      color: #413a9e;
    }
    .content {
      font-size: 14px;
      padding: 5px 20px 5px 0;
    }
    .bottom {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      .bottomItem {
        color: #d1d1d1;
        margin-right: 25px;
        cursor: pointer;
        span {
          font-size: 14px;
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
    // 二级评论
    .twoComment {
      .seeReply {
        font-size: 13px;
        color: #e0e3e6;
        span {
          display: inline-block;
          color: #40399c;
          cursor: pointer;
          padding: 1px 3px;
          border-radius: 3px;
        }
        span:hover {
          background: #b0afdb;
        }
      }
    }
    // 回复
    .reply {
      display: flex;
      padding: 10px 20px 10px 50px;
      .el-input {
        flex: 1;
      }
      // 输入文本框
      .el-textarea {
        max-width: 500px;
      }
      .el-button {
        margin-left: 20px;
        width: 80px;
        font-size: 14px;
        line-height: 18px;
        // 字间距
        letter-spacing: 4px;
        white-space: unset;
        height: 100%;
        background: #a798eb;
        border: none;
        color: #e9e9e9;
      }
      .el-button:hover {
        opacity: 0.8;
        color: #fff;
      }
    }
  }
}
</style>