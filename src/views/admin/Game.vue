<template>
  <div class="page-game">
    <vue-custom-scrollbar class="scroll-area">
      <el-table border :data="gameList" stripe style="width: 100%">
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
        <el-table-column label="游戏规则" header-align="center" align="center">
          <template slot-scope="scope">
            <div class="rules">{{ scope.row.rules }}</div>
          </template>
        </el-table-column>
        <el-table-column label="上架 / 下架" header-align="center" align="center">
          <template slot-scope="scope">
            <el-switch 
              v-model="scope.row.isban" 
              active-text="下架" 
              inactive-text="上架"  
              active-color="#b18ef3" 
              inactive-color="#8ea0f3" 
              @change="banGame(scope.row)" 
            />
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
    <adminPop ref="myPopRef" title="编辑游戏信息" :height="1" >
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
            <el-input v-model="editGameList.name" class="popInput" maxlength="10" show-word-limit placeholder="请输入游戏名称" />
          </el-form-item>
          <el-form-item label="游戏规则：" prop="rules">
            <el-input v-model="editGameList.rules" :rows="3" maxlength="255" show-word-limit type="textarea" class="popInput" placeholder="请输入游戏规则" />
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
import adminApi from "@/utils/adminApi";
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
      pageSize: 10,
      editGameList: {},
      gameRule: {
        name: [
            { required: true, message: '游戏名称不能为空', trigger: 'blur' },
            { min: 1, max: 15, message: '名字长度应在1 - 15位之间', trigger: 'blur' }
        ],
        rules:[
          { required: true, message: '请输入游戏简介', trigger: 'blur' },
          { min: 1, max: 255, message: '游戏简介长度不得超过255', trigger: 'blur' }
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
    async getGameList() {
      try {
        const {data: res} = await adminApi.getGameList()
        const list = res.data
        list.forEach(item => {
          if(item.isban) item.isban = true
          else item.isban = false
        })
        let num = (this.pageNum - 1) * this.pageSize
        this.gameList = list.slice(num, this.pageSize + num)
        this.gameListCopy = JSON.parse(JSON.stringify(list))
      } catch (error) {
        console.log("error", error)
      }
    },
    async banGame(game) {
      let isban = game.isban ? 1 : 0
      await adminApi.editGame({id: game.id, isban})
      if(game.isban) {
        this.messageShow(true, `${game.name}已下架`)
      } else {
        this.messageShow(true, `${game.name}已上架`)
      }
    },
    editGame(id) {
      this.getEditGame(id)
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
    async getEditGame(id) {
      const {data: res} = await adminApi.getGame({id})
      if(res.code === 200) {
        this.editGameList = res.data
      }
    },
    save() {
      this.$refs.gameForm.validate(async (valid) => {
        if(valid) {
          const {id, name, rules} = this.editGameList
          const {data: res} = await adminApi.editGame({id, name, rules})
          if(res.code === 200) {
            this.messageShow(true, `修改成功`)
            this.$refs.myPopRef.popclose()
            this.getGameList()
          }
        }
      })
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
        this.$message({ type: 'success', message: `${msg}` })
      } else {
        this.$message({ type: 'error', message: `${msg}` })
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
    flex: 1;
    width: 100%;
    .game-img {
      width: auto;
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
