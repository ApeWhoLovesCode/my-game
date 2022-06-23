<template>
  <div class="gameItem">
    <el-image :src="gameItem.img" fit="cover" />
    <div class="title">{{ gameItem.name }}</div>
  </div>
</template>

<script>
export default {
  name: "gameItem",
  props: {
    gameItem: {
      type: Object,
      default() {
        return {};
      },
    },
  }
};
</script>
<style lang='scss' scoped>
.gameItem {
  cursor: pointer;
  position: relative;
  width: 100%;
  // height: 17%;
  /* 实现高度为宽度的75%: padding 是根据 width 来调整的 */
  // padding-bottom: 75%;
  overflow: hidden;
  .el-image {
    width: 100%;
    height: 100%;
  }
  .title {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    background: linear-gradient(to top,rgba(0, 0, 0, 0.9),rgba(0, 0, 0, 0));
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    user-select: none;
  }
}
.gameItem:hover {
  opacity: 0.8;
}
</style>