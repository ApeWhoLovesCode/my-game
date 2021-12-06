<template>
  <div class="page-comment">
    <vue-custom-scrollbar class="scroll-area">
      <el-table :data="commentList" stripe style="width: 100%">
        <el-table-column type="index" header-align="center" align="center" width="70" label="序号" />
        <el-table-column label="评论用户信息" header-align="center" align="center">
          <template slot-scope="scope">
            <div class="userInfo">
              <img class="user-img" :src="scope.row.avatar" />
              <div class="name">{{ scope.row.name }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="评论内容" header-align="center" align="center">
          <template slot-scope="scope">
            <div class="comment-content">{{ scope.row.content }}</div>
          </template>
        </el-table-column>
        <el-table-column label="评论时间" header-align="center" align="center">
          <template slot-scope="scope">
            <div class="comment-content">{{ scope.row.creat_time }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" header-align="center" align="center">
          <template slot-scope="scope">
            <div class="delete">
              <el-button type="danger" icon="el-icon-delete" @click="deleteComment(scope.row)" circle></el-button>
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
      pageSize: 5,
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
  mounted() {

  },
  methods: {
    async getCommentList() {
      const {data: res} = await adminApi.getCommentList()
      console.log(res.data);
      const list = res.data
      let num = (this.pageNum - 1) * this.pageSize
      this.commentList = list.slice(num, this.pageSize + num)
      this.commentListCopy = JSON.parse(JSON.stringify(list))
    },
    deleteComment() {

    },
    sizeChange() {

    },
    curSizeChange() {

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
    .userInfo {
      display: flex;
      align-items: center;
      .user-img {
        width: 30px;
        height: 30px;
        border-radius: 5px;
        margin-right: 10px;
      }
      .name {
        flex: 1;
        font-weight: bold;
      }
    }
    .comment-content {
      font-size: 14px;
    }
  }
  .pagination {
    text-align: center;
  }
}
</style>
