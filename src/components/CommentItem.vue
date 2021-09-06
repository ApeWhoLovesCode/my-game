<template>
  <div class="commentItem">
    <div class="left">
      <img src="../assets/img/snake.png" />
    </div>
    <div class="right">
      <div class="header">
        <span class="name">肥栋</span>
        <span class="gameName">#贪吃蛇</span>
      </div>
      <div class="content">
        每次失望一次，我就少做一件爱你的事，直到最后备注改成全名、取消特别关注、上线不主动找你、收起你送的东西、删掉你所有的照片、再也不偷偷看你的时候，就是该说再见的时候了。多年后你会不会记得，曾经有一个人很努力的珍惜过你。——失望是一天天积累的，离开是很长的决定…
        每次失望一次，我就少做一件爱你的事，直到最后备注改成全名、取消特别关注、上线不主动找你、收起你送的东西、删掉你所有的照片、再也不偷偷看你的时候，就是该说再见的时候了。多年后你会不会记得，曾经有一个人很努力的珍惜过你。——失望是一天天积累的，离开是很长的决定…
      </div>
      <div class="bottom">
        <span class="time">2021年9月6日&nbsp;16:44</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "commentItem",
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
.commentItem {
  width: 100%;
  padding: 20px 0;
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  .left {
    width: 50px;
    img {
      width: 80%;
      border-radius: 50%;
      overflow: hidden;
    }
  }
  .right {
    flex: 1;
    .name {
      font-size: 14px;
      font-weight: bold;
      color: #474294;
      margin-right: 15px;
    }
    .gameName {
      font-size: 14px;
      color: #474294;
    }
    .content {
      font-size: 13px;
      padding: 5px 0;
    }
    .bottom {
      .time {
        font-size: 12px;
        color: #c2c2c2;
      }
    }
  }
}
</style>