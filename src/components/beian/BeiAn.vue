<template>
  <!-- 备案号 -->
  <div class="beianWrap">
    <el-tooltip effect="dark" content="粤ICP备2021132408号" placement="top">
      <div class="beian-slot" slot="content">
        <div>粤ICP备2021132408号</div>
        <div>个人邮箱：970519495@qq.com</div>
        <div>本网站用于展示一些自己练习前端技术的小游戏</div>
      </div>
      <a class="beian-a" href="http://beian.miit.gov.cn/">
        粤ICP备2021132408号</a
      >
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: "",
  props: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {},
};
</script>
<style lang='scss' scoped>
// 备案号
.beianWrap {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  .beian-a {
    font-size: 12px;
    color: #818181;
  }
  .beian-a:hover {
    font-size: 13px;
    color: #aaaaaa;
  }
}
.beian-slot {
  text-align: center;
}
// 备案号 end
</style>