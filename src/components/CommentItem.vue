<template>
  <div class="commentItem">
    <div class="left">
      <img :src="comments.avatar" />
    </div>
    <div class="right">
      <div class="header">
        <span class="name">{{ comments.name }}</span>
        <span class="gameName">#贪吃蛇</span>
      </div>
      <!-- 一级评论 -->
      <div class="content">
        {{ comments.content }}
      </div>
      <div class="bottom">
        <span class="time">{{ comments.creat_time }}</span>
        <div class="bottomItem">
          <span class="iconfont icon-dianzan_kuai"></span>
          <span>{{comments.like}}</span>
        </div>
        <div class="bottomItem">
          <span class="iconfont icon-dianzan_kuai cai"></span>
          <span>{{comments.no_like}}</span>
        </div>
        <div class="bottomItem" @click="replyClick">
          <span class="iconfont icon-pinglun"></span>
          <span>回复</span>
        </div>
        <el-popover
          v-if="comments.isMe"
          placement="top"
          width="200"
          v-model="visible"
        >
          <div class="delete-pop">
            <div class="delete-text">删除评论后，评论下所有回复都会被删除是否继续？</div>
            <div class="delete-bottom">
              <span class="cancel" @click="visible=false">取消</span>
              <span class="determine" @click="$emit('deleteMsg', {id:comments.id, isOne:true});visible=false">确定</span>
            </div>
          </div>
          <div slot="reference" class="bottomItem">
            <span class="iconfont icon-changyonggoupiaorenshanchu"></span>
            <span>删除</span>
          </div>
        </el-popover>
      </div>
      <!-- 二级评论 -->
      <div class="twoComment">
        <CommentItemTwo
          v-for="item in replyComments"
          :key="item.id"
          :replys="item"
          :isReply="isReply"
          @isReplyShow="isReplyShow"
          @deleteMsg="$emit('deleteMsg', $event)"
        />
        <div class="seeReply" v-if="!isShowMoreReply">
          共有{{ comments.childList.length }}条回复,
          <span @click="isShowMoreReply = true">点击查看</span>
        </div>
        <template v-if="isShowMoreReply">
          <CommentItemTwo
            v-for="item in moreReplyComments"
            :key="item.id"
            :replys="item"
            :isReply="isReply"
            @isReplyShow="isReplyShow"
            @deleteMsg="$emit('deleteMsg', $event)"
          />
        </template>
      </div>
      <!-- 回复 -->
      <div class="reply" v-if="isReply">
        <el-input
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 5 }"
          :placeholder="replyPlaceholder"
          :maxlength="1000"
          show-word-limit
          v-model="replyContent"
          @keyup.native="sendMsg"
        />
        <el-button type="small" @click="sendMsg({key: 'Enter'})">发表评论</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import CommentItemTwo from "@/components/CommentItemTwo.vue";

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
      // 回复的人名 iid 只用于显示隐藏评论框
      replyUser: { iid: this.comments.uid,uid: null, name: this.comments.name},
      // 超过 3 个的二级评论
      moreReplyComments: [],
      // 显示更多回复
      isShowMoreReply: true,
      // 删除弹出层的显示与隐藏
      visible: false
    };
  },
  computed: {
    // 回复的人
    replyPlaceholder() {
      return "回复 @" + this.replyUser.name + "：";
    },
    // 截取前三个评论，多余的存到另一个数组中
    replyComments() {
      let replyList = this.comments.childList;
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
      if (this.comments.uid == this.replyUser.iid) {
        this.isReply = !this.isReply;
      } else {
        this.replyContent = ''
        this.replyUser.iid = this.comments.uid;
        this.replyUser.uid = null;
        this.replyUser.name = this.comments.name;
        this.isReply = true;
      }
    },
    isReplyShow(user) {
      if (user.uid == this.replyUser.iid) {
        this.isReply = !this.isReply;
      } else {
        this.replyContent = ''
        this.replyUser.iid = user.uid;
        this.replyUser.uid = user.uid;
        this.replyUser.name = user.name;
        this.isReply = true;
      }
    },
    sendMsg(e) {
      if(e.shiftKey || e.key !== 'Enter') return
      if(!this.replyContent) {
        this.$message({type: 'info', message: '你还没有评论哦', duration: 1000})
        return
      } 
      const msg = {fid: this.comments.id, to_uid: this.replyUser.uid, content: this.replyContent}
      this.$emit('replayMsg', msg)
      this.replyContent = ''
      this.isReply = false
      this.replyUser = { iid: 0, uid: 0, name: ''}
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
    max-width: 1000px;
    .name {
      font-size: 14px;
      font-weight: bold;
      color: #cedaff;
      margin-right: 15px;
    }
    .gameName {
      font-size: 14px;
      color: #cedaff;
    }
    .content {
      font-size: 14px;
      padding: 5px 20px 5px 0;
      // 字间距
      letter-spacing: 2px;
      line-height: 22px;
      /* 加了这个属性 \n 才有换行效果 */
      white-space: pre-wrap;
    }
    .bottom {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      .bottomItem {
        color: #d1d1d1;
        margin-left: 25px;
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
          color: #948eec;
          cursor: pointer;
          padding: 1px 5px;
          border-radius: 3px;
        }
        span:hover {
          color: #fff;
          background: #9f9ed3;
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
        margin-left: 15px;
        width: 80px;
        font-size: 14px;
        line-height: 18px;
        // 字间距
        letter-spacing: 4px;
        white-space: unset;
        height: 100%;
        background: #a793f8;
        border: none;
        color: #e9e9e9;
      }
      .el-button:hover {
        opacity: 0.85;
        color: #fff;
      }
    }
  }
}
/* 删除二次确认 */
.delete-pop {
  padding: 5px 15px;
  .delete-text {
    color: #67686f;
    font-size: 14px;
  }
  .delete-bottom {
    display: flex;
    justify-content: center;
    font-size: 12px;
    margin-top: 10px;
    span {
      padding: 3px 8px;
      cursor: pointer;
      border-radius: 3px;
      margin-right: 12px;
    }
    span:last-child {
      margin-right: 0;
    }
    .cancel {
      background: #e9e9e9;
    }
    .determine {
      background: #a895ec;
      color: #fff;
    }
    span:hover {
      opacity: 0.8;
    }
  }
}
</style>