<template>
  <div class="login">
    <canvas id="mycanvas"> </canvas>
    <div class="content">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/img/logo.png" />
      </div>
      <el-form
        :model="loginForm"
        :rules="rules"
        ref="loginForm"
        label-width="100px"
        class="login_form"
      >
        <el-form-item label="用户名：" prop="username">
          <el-input ref="username" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input ref="password" type="password" v-model="loginForm.password" @keyup.enter.native="login"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login()">登录</el-button>
          <el-button @click="registered()">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-tooltip effect="light" content="管理员端" placement="bottom">
      <div class="el-icon-user-solid admin" @click="$router.push('/admin/Login')"></div>
    </el-tooltip>
  </div>
</template>

<script>
import api from "../utils/api";
import { mapState } from "vuex";
export default {
  name: "",
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
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
        // 验证密码是否合法
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "密码应在3到15位之间",
            trigger: "blur",
          },
        ],
      },
      canvas: null,
      // window大小变化的定时器
      windowTime: null,
    };
  },
  computed: {
    ...mapState(["timeHello"]),
  },
  watch: {},
  mounted() {
    if(this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if(this.loginForm.password === '') {
      this.$refs.password.focus()
    }
    setTimeout(() => {
      this.canvasOperation();
    }, 100);
    // 监听浏览器窗口大小变化
    let that = this;
    window.addEventListener("resize", function () {
      clearTimeout(this.windowTime);
      this.windowTime = setTimeout(() => {
        that.getCanvas();
      }, 200);
    });
  },
  methods: {
    // 登录
    login() {
      this.$refs.loginForm.validate(async (valid) => {
        if(valid) {
          let username = this.loginForm.username;
          let password = this.loginForm.password;
          const { data } = await api.login({ username, password });
          // 将用户信息保存到 vuex 和本地中
          this.$store.commit("setUserInfo", data.data);
          if (data.code == 200) {
            this.$notify({
              title: "登录成功",
              message: `${this.timeHello}，${data.data.name}`,
              type: "success",
              duration: 1500,
              customClass: "loginNotify",
            });
            this.$router.push("/home");
          } else {
            this.$message({
              type: "error",
              message: "用户名或密码错误",
              duration: "2000",
            });
          }
        } else {}
      });
    },
    // 注册
    registered() {
      this.$router.push("/register");
    },
    // 重新获取canvas的信息
    getCanvas() {
      this.canvas.width = document.documentElement.clientWidth - 30;
      this.canvas.height = document.documentElement.clientHeight - 30;
    },
    // canvas 操作
    canvasOperation() {
      var canvas = document.querySelector("#mycanvas");
      var ctx = canvas.getContext("2d");
      this.canvas = canvas;
      // 画布的尺寸   获取页面可视宽度高度
      canvas.width = document.documentElement.clientWidth - 30;
      canvas.height = document.documentElement.clientHeight - 30;

      var ballArr = [];
      var ballLine = 100; // 小球间距多少就连线
      function Ball() {
        this.x = parseInt(Math.random() * canvas.width);
        this.y = parseInt(Math.random() * canvas.height);
        this.r = 5;
        this.color = getRandom();
        // 乘10除10为了保留小数(防止0的出现)
        this.dx = parseInt((Math.random() * 4 - 2) * 10) / 10;
        this.dy = parseInt((Math.random() * 4 - 2) * 10) / 10;
        ballArr.push(this);
        // 自己在数组中的位置记录一下  用this.index确保画出来的线是单向的
        this.index = ballArr.length - 1;
      }
      // 小球的更新
      Ball.prototype.update = function () {
        this.x += this.dx;
        this.y += this.dy;
        // 当小球出屏幕了 反弹
        if (this.x < this.r || this.x > canvas.width - this.r) {
          this.dx = -this.dx;
        }
        if (this.y < this.r || this.y > canvas.height - this.r) {
          this.dy = -this.dy;
        }
      };
      // 小球的渲染
      Ball.prototype.render = function () {
        ctx.beginPath();
        // 透明度
        ctx.globalAlpha = 1;
        // 画小球
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        // 画线的逻辑   只画比自己大的一方就行了，否则就会有两根线
        for (var i = this.index; i < ballArr.length; i++) {
          // 绝对值
          if (
            Math.abs(ballArr[i].x - this.x) < ballLine &&
            Math.abs(ballArr[i].y - this.y) < ballLine
          ) {
            ctx.strokeStyle = "#fff";
            ctx.beginPath();
            // 根据当前两个已经连线的小球的距离，进行线的透明度设置
            // pow 次方，sqrt开根     球和球之间 的距离
            ctx.globalAlpha =
              10 /
              Math.sqrt(
                Math.pow(ballArr[i].x - this.x, 2) +
                  Math.pow(ballArr[i].y - this.y, 2)
              );
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(ballArr[i].x, ballArr[i].y);
            ctx.closePath();
            ctx.stroke();
          }
        }
      };
      // 创建20个小球
      for (let i = 0; i < 30; i++) {
        new Ball();
      }
      setInterval(function () {
        // 清除画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i in ballArr) {
          ballArr[i].update();
          ballArr[i].render();
        }
      }, 20);

      // 随机颜色
      function getRandom() {
        var allType = "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f";
        var allTypeArr = allType.split(",");
        var color = "#";
        for (var i = 0; i < 6; i++) {
          // 得到一个 0-数组长度的随机数
          var random = parseInt(Math.random() * allTypeArr.length);
          color += allTypeArr[random];
        }
        return color;
      }
    },
  },
};
</script>
<style lang='scss' scoped>
/* 小于1000px */
@media screen and (max-width: 1000px) {
  .content {
    width: 500px;
    height: 300px;
  }
}
/* 大于等于1000px */
@media screen and (min-width: 1000px) {
  .content {
    width: 600px;
    height: 360px;
  }
}
.login {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #332d77;
  min-width: 1000px;
  min-height: 600px;
}
#mycanvas {
  position: absolute;
  width: 100%;
  height: 100%;
}
.admin {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 30px;
  color: #e6e6e6;
  cursor: pointer;
  padding: 3px;
  border-radius: 6px;
}
.admin:hover {
  background: rgba(#84828d, 0.3);
}
.content {
  position: absolute;
  left: 50%;
  top: 50%;
  // transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.4);
  border-radius: 8px;
  animation: down 1s 0.2s ease both;
  ::v-deep .login_form {
    padding-top: 30px;
    width: 80%;
    height: 60%;
    position: absolute;
    left: 50%;
    top: 50%;
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
      margin-left: 0 !important;
      .el-button:first-child {
        margin-right: 50px;
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
// 登录区域动画
@keyframes down {
  0% {
    opacity: 0;
    transform: translate(-50%, -150%);
  }
  60% {
    opacity: 1;
    transform: translate(-50%, -40%);
  }
  100% {
    transform: translate(-50%, -50%);
  }
}

// 头像
.avatar_box {
  border: 1px solid #6fade8;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 12px #41e2ff;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  /* 添加动画 */
  animation: pulse 2.5s linear infinite;
  user-select: none;
}
.avatar_box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
/* 动画 */
@keyframes pulse {
  0% {
    width: 100px;
    height: 100px;
  }
  60% {
    width: 120px;
    height: 120px;
    opacity: 0.4;
  }

  100% {
    width: 140px;
    height: 140px;
    opacity: 0;
  }
}
</style>