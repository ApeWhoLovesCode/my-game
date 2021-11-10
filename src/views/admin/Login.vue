<template>
  <div class="page-admin">
    <div class="content">
      <el-form :model="adminForm" status-icon :rules="rules" ref="adminForm" label-width="110px" class="register_from">
        <el-form-item label="用户名：" prop="username">
          <el-input v-model="adminForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input type="password" v-model="adminForm.password"  @keyup.enter.native="login"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
          <el-button @click="back">返回用户端</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import adminApi from '@/utils/adminApi'
export default {
  name: '',
  props: {},
  data() {
    return {
      // 登录
      adminForm: {
        username: '',
        password: '',
      },
      // 表单验证规则
      rules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名应在3-10位之间',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          {
            min: 3,
            max: 15,
            message: '密码应在3到15位之间',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    login() {
      this.$refs.adminForm.validate(async (valid) => {
        if (valid) {
          try {
            const { username, password } = this.adminForm
            const { data: res } = await adminApi.login({ username, password })
            console.log(res)
            if (res.code === 200) {
              this.$message({ type: 'success', message: '登录成功' })
              this.$store.commit('setAdminUser', res.data)
              this.$router.push('/admin/home')
            } else {
              this.$message({ type: 'error', message: res.data })
            }
          } catch (error) {
            console.log('error', error)
          }
        } else {}
      })
    },
    // 返回登录页面
    back() {
      this.$router.push('/login')
    },
    // 点击重置按钮，重置表单
    resetForm() {
      this.$refs.adminForm.resetFields()
    },
  },
}
</script>
<style lang='scss' scoped>
.page-admin {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(to right, #24243e, #332d77, #24243e);
  min-width: 1000px;
  min-height: 600px;
}
.content {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 500px;
  height: 300px;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.4);
  border-radius: 8px;
  ::v-deep .register_from {
    padding-top: 30px;
    width: 80%;
    height: 60%;
    position: absolute;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -40%);
    // 用户名和密码样式
    .el-form-item__label {
      text-align: right;
      font-size: 18px;
      user-select: none;
      color: #525157;
    }
    .el-form-item__label::before {
      content: '';
    }
    // 错误提示
    .el-form-item__error {
      color: #af2d2d;
    }
    // 登录和重置按钮
    .el-form-item__content {
      display: flex;
      justify-content: center;
      margin-left: 50 !important;
      .el-button {
        margin-right: 15px;
      }
      .el-button:first-child {
        background: #4c44a5;
        border-color: #4c44a5;
      }
      .el-button:first-child:hover {
        opacity: 0.8;
      }
    }
    .el-form-item:last-child {
      margin-bottom: 0;
    }
    .el-form-item:last-child .el-form-item__content {
      margin-top: 10px;
    }
  }
}
</style>