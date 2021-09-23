<template>
  <div id="app">
    <router-view></router-view>
    <BeiAn />
  </div>
</template>

<script>
import BeiAn from "@/components/beian/BeiAn.vue";
export default {
  name: "app",
  components: {
    BeiAn,
  },
  mounted() {
    // 获取当前的时间段
    this.$store.commit("getTime");
  },
};
</script>

<style>
/* body {
  overflow: hidden;
} */
</style>
