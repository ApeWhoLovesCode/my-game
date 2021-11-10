<template>
  <div class="register">
    <div class="content">
      <el-form
        :model="registerForm"
        status-icon
        :rules="rules"
        ref="registerForm"
        label-width="110px"
        class="register_from"
      >
        <el-form-item label="用户名：" prop="username">
          <el-input v-model="registerForm.username"></el-input>
        </el-form-item>
        <el-form-item label="手机号：" prop="phone">
          <el-input type="phone" v-model="registerForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input type="password" v-model="registerForm.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" prop="checkPass">
          <el-input type="password" v-model="registerForm.checkPass"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="determine">确认注册</el-button>
          <el-button @click="resetForm">重置</el-button>
          <el-button @click="back">返回登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import api from "../utils/api";
export default {
  name: "",
  props: {},
  data() {
    var validatePhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入手机号"));
      } else if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(value)) {
        callback(new Error("手机号码格式错误"));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.registerForm.checkPass !== "") {
          this.$refs.registerForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.registerForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      // 注册的数据表单
      registerForm: {
        username: "",
        phone: "",
        password: "",
        checkPass: "",
      },
      // 表单验证规则
      rules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名应在3-10位之间",
            trigger: "blur",
          },
        ],
        phone: [{ validator: validatePhone, trigger: "blur" }],
        // 验证密码是否合法
        password: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
      },
    };
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    // 确认注册
    determine() {
      this.$refs.registerForm.validate(async (valid) => {
        if (valid) {
          const {username, password, phone} = this.registerForm;
          const { data } = await api.register({ username, password, phone });
          if (data.code == 200) {
            this.$message({
              type: "success",
              message: data.data.message,
              duration: "2000",
            });
            this.$router.push("/login");
          } else {
            this.$message({
              message: data.data.message,
              duration: "2000",
            });
          }
        }
      });
    },
    // 返回登录页面
    back() {
      this.$router.push("/login");
    },
    // 点击重置按钮，重置表单
    resetForm() {
      this.$refs.registerForm.resetFields();
    },
  },
};
</script>
<style lang='scss' scoped>
/* 小于1000px */
@media screen and (max-width: 1000px) {
  .content {
    width: 500px;
    height: 500px;
  }
}
/* 大于等于1000px */
@media screen and (min-width: 1000px) {
  .content {
    width: 600px;
    height: 550px;
  }
}
.register {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #332d77;
  min-width: 1000px;
  min-height: 600px;
}
.content {
  position: absolute;
  left: 50%;
  top: 50%;
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
      content: "";
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