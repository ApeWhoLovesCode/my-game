<template>
  <div class="page-user">
    <el-button @click="editUser(false)" plain >新增用户<i class="el-icon-user-solid el-icon--right"></i></el-button>
    <vue-custom-scrollbar class="scroll-area">
      <el-table :data="userList" stripe style="width: 100%">
        <el-table-column type="index" header-align="center" align="center" width="70" label="序号" />
        <el-table-column label="用户id" header-align="center" align="center" width="100">
          <template slot-scope="scope">
            <div class="name">{{ scope.row.id }}</div>
          </template>
        </el-table-column>
        <el-table-column label="用户信息" header-align="center" align="center">
          <template slot-scope="scope">
            <div class="userInfo">
              <img class="user-img" :src="scope.row.avatar" />
              <div class="name">{{ scope.row.name }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="手机号" header-align="center" align="center">
          <template slot-scope="scope">
            <div class="phone">{{ scope.row.phone }}</div>
          </template>
        </el-table-column>
        <el-table-column label="封号" header-align="center" align="center">
          <template slot-scope="scope">
            <div><el-switch v-model="scope.row.isBan" @change="banUser(scope.row)" /></div>
          </template>
        </el-table-column>
        <el-table-column label="操作" header-align="center" align="center">
          <template slot-scope="scope">
            <div class="delete">
              <el-button type="primary" icon="el-icon-edit" @click="editUser(true, scope.row.id)" circle></el-button>
              <el-button type="danger" icon="el-icon-delete" @click="deleteUser(scope.row.id)" circle></el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </vue-custom-scrollbar>
    <div class="pagination">
      <el-pagination
        background
        :page-sizes="[2, 5, 10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :page-count="pageCount"
        :current-page.sync="pageNum"
        :page-size.sync="pageSize"
        @size-change="sizeChange"
        @current-change="curSizeChange"
      />
    </div>
    <adminPop ref="myPopRef" title="用户编辑" :width="isEdit ? 1 : 400" :height="1">
      <div class="userpop-wrap">
        <el-form
          ref="UserForm"
          :model="addUserList"
          :rules="userRule"
          label-width="90px"
          hide-required-asterisk
          class="addUserListForm"
        >
          <el-form-item label="姓名：" prop="name">
            <el-input v-model="addUserList.name" class="popInput" maxlength="10" show-word-limit placeholder="请输入用户姓名" />
          </el-form-item>
          <el-form-item label="手机号：" prop="phone">
            <el-input v-model="addUserList.phone" class="popInput" maxlength="11" show-word-limit placeholder="请输入手机号" />
          </el-form-item>
          <template v-if="!isEdit">
            <el-form-item label="密码：" prop="pass">
              <el-input v-model="addUserList.pass" type="password" class="popInput" maxlength="15"  placeholder="请输入用户姓名" />
            </el-form-item>
            <el-form-item label="确认密码：" prop="checkPass">
              <el-input v-model="addUserList.checkPass" type="password" class="popInput" maxlength="15"  placeholder="请输入手机号" />
            </el-form-item>
          </template>
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
import api from "@/utils/adminApi";
import vueCustomScrollbar from 'vue-custom-scrollbar'
import "vue-custom-scrollbar/dist/vueScrollbar.css"
import adminPop from '@/components/adminPop/adminPop'
export default {
  components: {
    vueCustomScrollbar,
    adminPop
  },
  data() {
    var phoneValidator = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(value)) {
        callback(new Error('手机号码格式错误'))
      } else {
        callback()
      }
    }
    return {
      userList: [],
      userListCopy: [],
      pageNum: 1,
      pageSize: 10,
      addUserList: [],
      userRule: {
        name: [
            { required: true, message: '请输入名字', trigger: 'blur' },
            { min: 3, max: 10, message: '名字长度应在3 - 10位之间', trigger: 'blur' }
          ],
        phone: [{ validator: phoneValidator, trigger: 'blur' }]
      },
      // 用于判断是 "编辑状态" 还是 "新增状态" 使用弹出层
      isEdit: false
    }
  },
  computed: {
    pageCount() {
      return Math.ceil(this.userListCopy.length / this.pageSize) || 1
    }
  },
  created() {},
  mounted() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const {data: res} = await api.getAllUser()
      const list = res.data
      list.forEach(item => {
        if(item.isBan) item.isBan = true
        else item.isBan = false
      })
      this.userList = list.slice(0, this.pageSize)
      this.userListCopy = JSON.parse(JSON.stringify(list))
    },
    // 编辑用户
    editUser(isEdit, id) {
      this.isEdit = isEdit
      if(isEdit) this.getEditUset(id)
      else this.addUserList = {}
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
    // 获取单个用户的信息
    getEditUset(id) {
      this.addUserList = {name: 'aaa', phone: '123456'}
    },
    save() {

    },
    cancel() {
      this.$refs.myPopRef.popclose()
    },
    // 删除用户
    deleteUser() {

    },
    // 封禁用户
    async banUser(user) {
      let isBan = user.isBan ? 1 : 0
      await api.editUser({id: user.id, isBan})
      if(user.isBan) {
        this.messageShow(true, `${user.name}已被封号`)
      } else {
        this.messageShow(true, `${user.name}已经解封`)
      }
    },
    // 页码改变
    sizeChange(size) {
      this.pageNum = 1
      this.userList = this.userListCopy.slice(0, size)
    },
    // 当前页码发生改变
    curSizeChange(size) {
      this.$nextTick(() => {
        let num = (size - 1) * this.pageSize
        this.userList = this.userListCopy.slice(num, num + this.pageSize)
      })
    },
    messageShow(isSuccess, msg) {
      if (isSuccess) {
        this.$message({ type: 'success', message: `${msg}` })
        // this.getUserList()
      } else {
        this.$message({ type: 'error', message: `${msg}` })
      }
    },
  },
}
</script>

<style scoped lang="scss">
.page-user {
  display: flex;
  flex-direction: column;
  height: 100%;
  .scroll-area {
    flex: 1;
    width: 100%;
    .userInfo {
      display: flex;
      align-items: center;
      justify-content: center;
      .user-img {
        width: 40px;
        height: 40px;
        margin-right: 10px;
      }
      .name {
        font-weight: bold;
      }
    }
  }
  .pagination {
    text-align: center;
    margin-top: 20px;
    height: 30px;
  }
  .userpop-wrap {
    margin-top: 30px;
  }
}
</style>
