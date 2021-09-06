<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "app",
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
