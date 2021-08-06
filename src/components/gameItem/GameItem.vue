<template>
  <div class="gameItem">
    <img :src="gameItem.img" alt="" />
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
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  methods: {},
};
</script>
<style lang='scss' scoped>
$width: 100%; /* 声明宽度变量 */
.gameItem {
  cursor: pointer;
  position: relative;
  width: $width;
  height: 17%;
  /* 实现高度为宽度的75%: padding 是根据 width 来调整的 */
  // padding-bottom: 75%;
  overflow: hidden;
  margin-bottom: 10px;
  img {
    display: inline-block;
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
    font-size: 16px;
    // background: rgba(0, 0, 0, 0.5);
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.8),
      rgba(0, 0, 0, 0.05)
    );
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