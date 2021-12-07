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
        <el-popover
          v-if="replys.isMe"
          placement="top"
          width="190"
          v-model="visible"
        >
          <div class="delete-pop">
            <div class="delete-text">您确定要删除该评论吗？</div>
            <div class="delete-bottom">
              <span class="cancel" @click="visible=false">取消</span>
              <span class="determine" @click="deleteMsg">确定</span>
            </div>
          </div>
          <div slot="reference" class="bottomItem">
            <span class="iconfont icon-changyonggoupiaorenshanchu"></span>
            <span>删除</span>
          </div>
        </el-popover>
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
    return {
      visible: false
    };
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
    deleteMsg() {
      this.$emit('deleteMsg', {id:this.replys.id, isOne:false});
      this.visible = false
    }
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
      /* 加了这个属性 \n 才有换行效果 */
      white-space: pre-wrap;
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