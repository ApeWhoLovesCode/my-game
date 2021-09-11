<template>
  <!-- 修改用户信息对话框 -->
  <el-drawer
    title="修改用户信息"
    :visible.sync="isEditUserInfo"
    direction="rtl"
    :before-close="editUserInfoComplete"
  >
    <div class="editUserMain">
      <div class="tips">点击下方按钮完成修改</div>
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
        <span>手机号：</span>
        <div class="item-Input">
          <el-input
            v-model="userInfo.phone"
            placeholder="请输入手机号:"
            @blur="revisePhone"
          ></el-input>
          <p v-show="!userRules.phone">请输入正确的手机号</p>
        </div>
        <el-button
          type="primary"
          :class="{ completeName: userRules.phone }"
          icon="el-icon-check"
          size="mini"
          plain
          circle
          @click="revisePhoneOK"
        ></el-button>
      </div>
      <div class="editUserItem">
        <span>原密码：</span>
        <div class="item-Input">
          <el-input
            type="password"
            v-model="userInfo.pass"
            placeholder="请输入原密码:"
            @blur="revisePass"
          ></el-input>
          <p v-show="!userRules.pass">密码应在3到15位之间</p>
        </div>
        <div style="width:28px;height=28px"></div>
      </div>
      <div class="editUserItem">
        <span>新密码：</span>
        <div class="item-Input">
          <el-input
            type="password"
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
import { mapState } from "vuex";
import api from "@/utils/api";
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
        phone: "",
        pass: "",
        newPass: "",
      },
      userRules: {
        name: true,
        phone: true,
        pass: true,
        newPass: true,
      },
    };
  },
  computed: {
    ...mapState(["gameUser"]),
  },
  watch: {},
  mounted() {
    this.userInfo.name = this.gameUser.name;
    this.userInfo.phone = this.gameUser.phone;
  },
  methods: {
    // 点击修改用户信息弹出层外部
    editUserInfoComplete() {
      this.$confirm("您已经完成个人信息的修改了吗？", "关闭用户编辑界面", {
        showClose: false,
        center: true,
        iconClass: "el-icon-user",
      })
        .then(() => {
          this.$emit("closeUserInfo");
        })
        .catch(() => {});
    },
    // 调用修改用户信息的接口
    async editUser(params) {
      const { data } = await api.editUser(params);
      this.$store.commit("setUserInfo", data.data);
      this.$message({
        type: "success",
        message: "修改成功",
        duration: 1000,
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
      this.editUser({ username: this.userInfo.name, id: this.gameUser.id });
    },
    // 修改电话号码
    revisePhone() {
      var reg = /^1(3|4|5|6|7|8|9)\d{9}$/;
      if (!reg.test(this.userInfo.phone)) {
        this.userRules.phone = false;
        return;
      }
      this.userRules.phone = true;
    },
    revisePhoneOK() {
      if (!this.userRules.phone) {
        return;
      }
      this.editUser({ phone: this.userInfo.phone, id: this.gameUser.id });
    },
    // 修改密码
    revisePass() {
      let pass = this.userInfo.pass;
      if (pass.length < 3 || pass.length > 15) {
        this.userRules.pass = false;
        return;
      }
      this.userRules.pass = true;
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
    async newPassOK() {
      // 原密码 和 新密码 的验证规则通过后才可以修改
      if (
        !this.userRules.pass ||
        !this.userRules.newPass ||
        !this.userInfo.pass
      ) {
        return;
      }
      let id = this.gameUser.id;
      let password = this.userInfo.pass;
      let newPassword = this.userInfo.newPass;
      const { data } = await api.editPass({ id, password, newPassword });
      if (data.code == 200) {
        this.$message({
          type: "success",
          message: "修改密码成功",
          duration: 1000,
        });
        this.userInfo.pass = "";
        this.userInfo.newPass = "";
      } else {
        this.$message({
          type: "error",
          message: "原密码错误",
          duration: 1000,
        });
      }
    },
  },
};
</script>
<style lang='scss' scoped>
// 修改用户信息对话框
.editUserMain {
  padding: 20px 25px;
  text-align: right;
  .tips {
    display: inline-block;
    width: 70px;
    height: 30px;
    font-size: 12px;
    margin-bottom: 25px;
    animation: tips 3s linear infinite;
  }
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
@keyframes tips {
  0% {
    opacity: 1;
    font-size: 13px;
  }
  40% {
    opacity: 0;
    font-size: 12px;
  }
  50% {
    opacity: 0;
    font-size: 12px;
  }
  90% {
    font-size: 13px;
    opacity: 1;
  }
  100% {
    font-size: 13px;
    opacity: 1;
  }
}
</style>