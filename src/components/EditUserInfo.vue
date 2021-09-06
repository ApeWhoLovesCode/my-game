<template>
  <!-- 修改用户信息对话框 -->
  <el-drawer
    title="修改用户信息"
    :visible.sync="isEditUserInfo"
    direction="rtl"
    :before-close="editUserInfoComplete"
  >
    <div class="editUserMain">
      <div class="editUserItem">
        <span>用户名：</span>
        <div class="item-Input">
          <el-input
            v-model="userInfo.name"
            placeholder="请输入用户名:"
            @blur="reviseName"
          ></el-input>
          <p v-show="!userRules.name">用户名应在3-10位之间</p>
        </div>
        <el-button
          type="primary"
          :class="{ completeName: userRules.name }"
          icon="el-icon-check"
          size="mini"
          plain
          circle
          @click="reviseNameOK"
        ></el-button>
      </div>
      <div class="editUserItem">
        <span>电子邮箱：</span>
        <div class="item-Input">
          <el-input
            v-model="userInfo.email"
            placeholder="请输入电子邮箱:"
            @blur="reviseEmail"
          ></el-input>
          <p v-show="!userRules.email">请输入正确的电子邮箱</p>
        </div>
        <el-button
          type="primary"
          :class="{ completeName: userRules.email }"
          icon="el-icon-check"
          size="mini"
          plain
          circle
          @click="reviseEmailOK"
        ></el-button>
      </div>
      <div class="editUserItem">
        <span>原密码：</span>
        <div class="item-Input">
          <el-input
            v-model="userInfo.pass"
            placeholder="请输入原密码:"
            @blur="revisePass"
          ></el-input>
          <p v-show="!userRules.pass">原密码错误</p>
        </div>
        <el-button
          type="primary"
          :class="{ completeName: userRules.pass }"
          icon="el-icon-check"
          size="mini"
          plain
          circle
          @click="revisePassOK"
        ></el-button>
      </div>
      <div class="editUserItem">
        <span>新密码：</span>
        <div class="item-Input">
          <el-input
            v-model="userInfo.newPass"
            placeholder="请输入新密码:"
            @blur="newPassRules"
          ></el-input>
          <p v-show="!userRules.newPass">密码应在3到15位之间</p>
        </div>
        <el-button
          type="primary"
          :class="{ completeName: userRules.newPass }"
          icon="el-icon-check"
          size="mini"
          plain
          circle
          @click="newPassOK"
        ></el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
export default {
  name: "EditUserInfo",
  props: {
    isEditUserInfo: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      userInfo: {
        name: "",
        email: "",
        pass: "",
        newPass: "",
      },
      userRules: {
        name: true,
        email: true,
        pass: true,
        newPass: true,
      },
    };
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    // 点击修改用户信息弹出层外部
    editUserInfoComplete() {
      this.$confirm("确认要保存修改吗？", "修改个人信息", {
        center: true,
        iconClass: "el-icon-user",
      })
        .then(() => {
          // this.isEditUserInfo = false;
          this.$emit("closeUserInfo");
        })
        .catch(() => {
          // this.isEditUserInfo = false;
          this.$emit("closeUserInfo");
        });
    },
    // 修改姓名
    reviseName() {
      let name = this.userInfo.name;
      // 名字长度少于3位多于10位
      if (name.length < 3 || name.length > 10) {
        this.userRules.name = false;
        return;
      }
      // 名字验证通过
      this.userRules.name = true;
    },
    reviseNameOK() {
      if (!this.userRules.name) {
        return;
      }
      console.log("重命名");
    },
    // 修改电子邮箱
    reviseEmail() {
      //  \w 等价于 [^A-Za-z0-9_]
      var myreg = /^([\w+\.])+@\w+([.]\w+)+$/;
      // /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/

      if (!myreg.test(this.userInfo.email)) {
        this.userRules.email = false;
        return;
      }
      this.userRules.email = true;
    },
    reviseEmailOK() {
      if (!this.userRules.email) {
        return;
      }
      console.log("修改邮箱成功");
    },
    // 修改密码
    revisePass() {},
    revisePassOK() {
      if (!this.userRules.pass) {
        return;
      }
      console.log("修改密码成功");
    },
    // 新密码
    newPassRules() {
      let newPass = this.userInfo.newPass;
      if (newPass.length < 3 || newPass.length > 15) {
        this.userRules.newPass = false;
        return;
      }
      this.userRules.newPass = true;
    },
    newPassOK() {
      // 原密码 和 新密码 的验证规则通过后才可以修改
      if (!this.userRules.pass || !this.userRules.newPass) {
        return;
      }
      console.log("重置密码");
    },
  },
};
</script>
<style lang='scss' scoped>
// 修改用户信息对话框
.editUserMain {
  padding: 20px 25px;
  .editUserItem {
    margin-bottom: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      display: inline-block;
      font-size: 16px;
      white-space: nowrap;
      color: #333;
    }
    .item-Input {
      position: relative;
      flex: 1;
      margin-right: 10px;
      p {
        position: absolute;
        left: 2px;
        bottom: -16px;
        font-size: 12px;
        margin: 0;
        color: red;
      }
    }
    .el-button {
      width: 28px;
      height: 28px;
    }
    .completeName {
      background: #409eff;
      color: #fff;
    }
  }
}
</style>