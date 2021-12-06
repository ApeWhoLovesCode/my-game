<template>
  <div
    class="community"
    :class="isCommunityShow ? 'communityShow' : 'communityHide'"
  >
    <div class="title">评论区</div>
    <el-popover
      placement="left"
      width="500"
      v-model="isReply"
    >
      <div class="reply-wrap">
        <el-input
          class="reply-inp"
          type="textarea"
          :autosize="{ minRows: 4}"
          show-word-limit
          :maxlength="1000"
          placeholder="发一条友善的评论吧(*^_^*)"
          v-model="replyContent"
          @keyup.native="sendMsg"
        />
        <el-button class="send" type="small" @click="sendMsg()">发送</el-button>
      </div>
      <el-button slot="reference" class="comments-btn" type="small">发表评论</el-button>
    </el-popover>
    <vue-custom-scrollbar class="scrollComment">
      <CommentItem
        v-for="(item,index) in commentList"
        :key="item.id"
        :comments="item"
        @replayMsg="sendMsg"
        @deleteMsg="deleteMsg($event, index)"
      />
    </vue-custom-scrollbar>
  </div>
</template>

<script>
import vueCustomScrollbar from "vue-custom-scrollbar";
import "vue-custom-scrollbar/dist/vueScrollbar.css";
import CommentItem from "@/components/CommentItem.vue";
import api from "../utils/api.js";
import {mapState} from 'vuex'
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
      replyContent: '',
      isReply: false
    };
  },
  computed: {
    ...mapState(['gameUser'])
  },
  watch: {},
  mounted() {
    this.getCommentList();
  },
  methods: {
    keyup(e) {
      console.log(e);
    },
    async getCommentList() {
      const { data: res } = await api.getComments({userId: this.gameUser.id});
      // console.log(res.data);
      this.commentList = res.data;
    },
    // 发送评论
    async sendMsg(msg) {
      // 按着了shift键时无法发送评论
      if(!msg.fid && (msg.shiftKey || msg.key !== 'Enter')) return
      if(!this.replyContent && !msg.fid) {
        this.$message({type: 'info', message: '你还没有评论哦', duration: 1000})
        return
      }
      // 排除评论中点击确认键的 '\n'
      let content = ''
      if(msg && msg.content) {
        content = this.handleContent(msg.content)
      } else {
        content = this.handleContent(this.replyContent)
      }
      const {data: res} = await api.sendMsg({
        uid: this.gameUser.id, 
        fid: msg && msg.fid,
        to_uid: msg && msg.to_uid,
        content
      })
      // 前端添加评论 - 发一级评论
      if(!msg.fid) {
        this.commentList.unshift(res.data)
      } else {
        // 发二级评论
        const msgI = this.commentList.findIndex(item => item.id === msg.fid)
        this.commentList[msgI].childList.push(res.data)
      }
      if(res.code === 200) this.$message({type:'success',message:'发送成功', duration: 1000})
      else this.$message({type:'warning',message:'发送失败', duration: 1000})
      this.replyContent = ''
      this.isReply = false
    },
    // 处理评论点击确认键 \n 的函数
    handleContent(content) {
      const index = content.lastIndexOf("\n")
      if(index === -1) return content
      return content.substring(0, index)
    },
    // 删除评论
    async deleteMsg(msg, index) {
      const { data: res } = await api.deleteMsg({ id: msg.id })
      if(res.code === 200) this.$message({type:'success',message:'删除成功', duration: 1000})
      else this.$message({type:'warning',message:'删除失败', duration: 1000})
      // 前端删除评论
      if(msg.isOne) {
        this.commentList.splice(index, 1)
      } else {
        const i = this.commentList[index].childList.findIndex(item => item.id === msg.id)
        this.commentList[index].childList.splice(i, 1)
      }
    }
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
  background: #55536e;
  border-radius: 5px;
  box-sizing: border-box;
  padding: 20px 50px;
  // 不提升层级scroll监听不到
  z-index: 95;
  .title {
    font-size: 18px;
    font-weight: bold;
    color: #fff;
    padding: 8px 0;
    margin-right: 100px;
    box-shadow: 0 4px 3px -3px #ccc;
  }
  .comments-btn {
    position: absolute;
    top: 20px;
    right: 50px;
    color: #a793f8;
  }
  .comments-btn:hover {
    background: #efebfa;
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
.reply-wrap {
  padding: 5px 15px;
  width: 92%;
  display: flex;
  .reply-inp {
    flex: 1;
  }
  .send {
    height: 40px;
    margin-left: 10px;
    color: #a793f8;
  }
  .send:hover {
    font-size: 15px;
    background: #fbfaff;
  }
}
</style>