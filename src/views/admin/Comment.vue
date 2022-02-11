<template>
  <div class="page-comment">
    <vue-custom-scrollbar class="scroll-area">
      <el-table border :data="commentList" stripe style="width: 100%" row-key="id" :tree-props="{children: 'childList', hasChildren: ''}">
        <!-- <el-table-column type="expand" header-align="center" align="center" width="70" label="序号" /> -->
        <el-table-column label="评论用户信息" header-align="center" align="center" width="180">
          <template slot-scope="scope">
            <div class="comment-userInfo">
              <!-- <img class="user-img" :src="scope.row.avatar" /> -->
              <div class="name">{{ scope.row.name }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="评论内容" header-align="center" align="left">
          <template slot-scope="scope">
            <div class="comment-content">
              <i v-if="scope.row.share_game">游戏分享：</i>
              {{ scope.row.content }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="点赞/点踩" header-align="center" align="center" width="140">
          <template slot-scope="scope">
            <div class="like-wrap">
              <div class="likeItem" @click="$emit('likeClick', { id: comments.id, index2: undefined, like: true })">
                <span class="iconfont icon-dianzan_kuai"></span>
                <span>{{scope.row.like}}</span>
              </div>
              <div class="likeItem noLike" @click="$emit('likeClick', { id: comments.id, index2: undefined, like: false })">
                <span class="iconfont icon-dianzan_kuai cai"></span>
                <span>{{scope.row.noLike}}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="评论时间" header-align="center" align="center" width="170">
          <template slot-scope="scope">
            <div class="comment-time">{{ scope.row.creat_time }}</div>
          </template>
        </el-table-column>
        <el-table-column label="是否置顶" header-align="center" align="center" width="100">
          <template slot-scope="scope">
            <el-switch 
              v-model="scope.row.isTop" 
              active-color="#8ea0f3" 
              inactive-color="#bbb" 
              :disabled="!!scope.row.fid"
              @change="overHead(scope.row)" 
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" header-align="center" align="center" width="100">
          <template slot-scope="scope">
            <div class="operation">
              <el-button type="danger" icon="el-icon-delete" circle @click="deleteComment(scope.row)"></el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </vue-custom-scrollbar>
    <div class="pagination">
      <el-pagination
        background
        :page-sizes="[5, 10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :page-count="pageCount"
        :current-page.sync="pageNum"
        :page-size.sync="pageSize"
        @size-change="sizeChange"
        @current-change="curSizeChange"
      />
    </div>
  </div>
</template>

<script>
import adminApi from "@/utils/adminApi";
import vueCustomScrollbar from 'vue-custom-scrollbar'
import "vue-custom-scrollbar/dist/vueScrollbar.css"
// import adminPop from '@/components/adminPop/adminPop'
export default {
  components: {
    vueCustomScrollbar,
    // adminPop
  },
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      commentList: [],
      commentListCopy: [],
    };
  },
  computed: {
    pageCount() {
      return Math.ceil(this.commentListCopy.length / this.pageSize) || 1
    }
  },
  created() {
    this.getCommentList()
  },
  methods: {
    // 置顶
    async overHead(comment) {
      let isTop = comment.isTop ? 1 : 0
      await adminApi.overHead({id: comment.id, isTop})
      if(comment.isTop) {
        this.$message({type:'success', message: `用户${comment.name}的评论已被置顶`})
      } else {
        this.$message({type:'info', message: `用户${comment.name}的评论已取消置顶`})
      }
    },
    async getCommentList() {
      const {data: res} = await adminApi.getCommentList()
      const list = res.data
      let num = (this.pageNum - 1) * this.pageSize
      this.commentList = list.slice(num, this.pageSize + num)
      this.commentListCopy = JSON.parse(JSON.stringify(list))
    },
    async deleteComment(comment) {
      this.$confirm('该评论及其所有回复都会被删除，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const {data: res} = await adminApi.deleteComment({id: comment.id})
        if(res.code === 200) {
          this.$message({type: 'success', message: `用户：${comment.name} 的评论删除成功`})
          this.getCommentList()
        } else {
          this.$message({type: 'warning', message: `删除失败`})
        }
      }).catch(() => {});
    },
    sizeChange(size) {
      this.pageNum = 1
      this.commentList = this.commentListCopy.slice(0, size)
    },
    curSizeChange(size) {
      this.$nextTick(() => {
        let num = (size - 1) * this.pageSize
        this.commentList = this.commentListCopy.slice(num, num + this.pageSize)
      })
    }
  }
};
</script>

<style scoped lang="scss">
.page-comment {
  display: flex;
  flex-direction: column;
  height: 100%;
  .scroll-area {
    flex: 1;
    width: 100%;
    /* 开头的名字外面盒子的样式 */
    ::v-deep .el-table__body-wrapper {
      .el-table__row td:first-child {
        .cell {
          display: flex;
          align-items: center;
          padding-left: 20px;
        }
      }
    }
    .comment-userInfo {
      display: flex;
      align-items: center;
      margin-bottom: 0;
      .user-img {
        width: 30px;
        height: 30px;
        border-radius: 5px;
        margin-right: 10px;
      }
      .name {
        flex: 1;
        font-weight: bold;
        padding-left: 10px;
      }
    }
    .comment-content {
      font-size: 14px;
      /* 加了这个属性 \n 才有换行效果 */
      white-space: pre-wrap;
      i {
        color: #677ae5;
      }
    }
    .like-wrap {
      display: flex;
      justify-content: center;
      .likeItem {
        color: #889de2;
        span {
          font-size: 13px;
        }
        .iconfont {
          font-size: 14px;
          margin-right: 4px;
        }
        .cai {
          display: inline-block;
          transform: rotateX(180deg);
        }
      }
      .noLike {
        margin-left: 8px;
        color: #aa88e2;
      }
    }
    .comment-time {
      font-size: 13px;
    }
  }
  .pagination {
    margin-top: 15px;
    text-align: center;
  }
}
</style>
