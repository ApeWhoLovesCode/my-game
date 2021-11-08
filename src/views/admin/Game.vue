<template>
  <div class="page-game">
    <vue-custom-scrollbar class="scroll-area">
      <el-table :data="gameList" stripe style="width: 100%">
        <el-table-column type="index" header-align="center" align="center" width="70" label="序号" />
        <el-table-column label="游戏图片" header-align="center" align="center" width="100">
          <template slot-scope="scope">
            <img class="game-img" :src="scope.row.img" alt="">
          </template>
        </el-table-column>
        <el-table-column label="游戏名称" header-align="center" align="center">
          <template slot-scope="scope">
            <div class="name">{{ scope.row.name }}</div>
          </template>
        </el-table-column>
        <el-table-column label="游戏介绍" header-align="center" align="center">
          <template slot-scope="scope">
            <div class="name">{{ scope.row.introduction }}</div>
          </template>
        </el-table-column>
        <el-table-column label="上架 / 下架" header-align="center" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.isBan" @change="banGame(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="修改游戏信息" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="editGame(scope.row.id)" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
    </vue-custom-scrollbar>
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="gameListCopy.length"
        :current-page.sync="pageNum"
        :page-size.sync="pageSize"
        @current-change="curSizeChange"
      />
    </div>
    <adminPop ref="myPopRef" title="编辑游戏信息" >
      <div class="gamepop-wrap">
        <el-form
          ref="gameForm"
          :model="editGameList"
          :rules="gameRule"
          label-width="90px"
          hide-required-asterisk
          class="editgameListForm"
        >
          <el-form-item label="游戏名称：" prop="name">
            <el-input v-model="editGameList.name" class="popInput" maxlength="10" show-word-limit placeholder="请输入用户姓名" />
          </el-form-item>
          <el-form-item label="游戏介绍：" prop="introduction">
            <el-input v-model="editGameList.introduction" maxlength="100" show-word-limit type="textarea" class="popInput" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item>
            <el-button @click="cancel">取消</el-button>
            <el-button type="primary" @click="save">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </adminPop>
  </div>
</template>

<script>
import vueCustomScrollbar from 'vue-custom-scrollbar'
import "vue-custom-scrollbar/dist/vueScrollbar.css"
import adminPop from '@/components/adminPop/adminPop'
export default {
  components: {
    vueCustomScrollbar,
    adminPop
  },
  data() {
    return {
      gameList: [],
      gameListCopy: [],
      pageNum: 1,
      pageSize: 5,
      editGameList: {},
      gameRule: {
        name: [
            { required: true, message: '请输入游戏名字', trigger: 'blur' },
            { min: 1, max: 15, message: '名字长度应在1 - 15位之间', trigger: 'blur' }
        ],
        introduction:[
          { required: true, message: '请输入游戏简介', trigger: 'blur' },
          { min: 1, max: 100, message: '游戏简介长度不得超过100', trigger: 'blur' }
        ]
      }
    };
  },
  created() {

  },
  mounted() {
    this.getGameList()
  },
  methods: {
    getGameList() {
      let data = [
        { id: 101, introduction: '阿达哒哒哒', name: '贪吃蛇', img: require('@/assets/img/logo.png'), isBan: true },
        { id: 102, introduction: '阿达哒哒哒', name: '俄罗斯方块', img: require('@/assets/img/logo.png'), isBan: true },
        { id: 103, introduction: '阿达哒哒哒', name: '2048', img: require('@/assets/img/logo.png'), isBan: true },
        { id: 104, introduction: '阿达哒哒哒', name: '五子棋', img: require('@/assets/img/logo.png'), isBan: true },
        { id: 105, introduction: '阿达哒哒哒', name: '飞翔的小鸟', img: require('@/assets/img/logo.png'), isBan: true },
        { id: 106, introduction: '阿达哒哒哒', name: '飞机大战', img: require('@/assets/img/logo.png'), isBan: true },
        { id: 107, introduction: '阿达哒哒哒', name: '英雄联盟', img: require('@/assets/img/logo.png'), isBan: false }
      ]
      this.gameList = data.slice(0, this.pageSize)
      this.gameListCopy = JSON.parse(JSON.stringify(data))
    },
    banGame() {

    },
    editGame(id) {
      this.getEditGameList()
      this.$refs.myPopRef.popshow()
      // 阻止输入框事件冒泡，防止触发弹出层的移动
      this.$nextTick(() => {
        var popInput = document.querySelectorAll('.popInput')
        popInput.forEach(item => {
          item.addEventListener('mousedown', e => {
            e.stopPropagation()
          })
        })
      })
    },
    getEditGameList() {
      this.editGameList = {}
    },
    save() {

    },
    cancel() {
      this.$refs.myPopRef.popclose()
    },
    curSizeChange(size) {
      this.$nextTick(() => {
        let num = (size - 1) * this.pageSize
        this.gameList = this.gameListCopy.slice(num, num + this.pageSize)
      })
    },
    messageShow(isSuccess, msg) {
      if (isSuccess) {
        this.$message({ type: 'success', message: `${msg}成功` })
        this.getVersionList()
      } else {
        this.$message({ type: 'error', message: `${msg}失败` })
      }
    },
  }
};
</script>

<style scoped lang="scss">
.page-game {
  display: flex;
  flex-direction: column;
  height: 100%;
  .scroll-area {
    display: flex;
    align-items: center;
    flex: 1;
    width: 100%;
    .game-img {
      width: 50px;
      height: 50px;
    }
    .name {
      font-weight: bold;
    }
  }
  .pagination {
    margin-top: 10px;
    height: 30px;
    text-align: center;
  }
  .gamepop-wrap {
    margin-top: 30px;
  }
}
</style>
