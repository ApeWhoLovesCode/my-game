<template>
  <div class="tx-content">
    <div class="content"></div>
    <div class="tx-top"></div>
    <div class="tx-bottom"></div>
    <div class="tx-left"></div>
    <div class="tx-right"></div>
    <div class="tx-line"></div>
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
  created() {},
  methods: {},
};
</script>
<style scoped>
.tx-content {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow: hidden;
}

.content {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 250px;
  background-size: 100% 100%;
}

.tx-line {
  position: absolute;
  left: 0;
  top: 49.5%;
  height: 0.5%;
  background: linear-gradient(to right, #4e47b1, #7f78e4);
  box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.5);
  animation: lineMove 0.3s ease-out 0.1s backwards;
  z-index: 11;
}

.tx-top {
  position: absolute;
  width: 100%;
  height: 50%;
  background: linear-gradient(to bottom, #28274b, #3c358b);
  z-index: 10;
  animation: topMove 0.6s ease-out 0.4s forwards;
}

.tx-bottom {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 50%;
  background: linear-gradient(to top, #28274b, #3c358b);
  z-index: 10;
  animation: bottomMove 0.6s ease-out 0.4s forwards;
}

.tx-left {
  position: absolute;
  left: 0;
  width: 50%;
  height: 100%;
  background: linear-gradient(to right, #28274b, #3c358b);
  z-index: 7;
  animation: leftMove 0.6s ease-out 0.4s forwards;
}

.tx-right {
  position: absolute;
  right: 0;
  width: 50%;
  height: 100%;
  background: linear-gradient(to left, #28274b, #3c358b);
  z-index: 7;
  animation: rightMove 0.6s ease-out 0.4s forwards;
}

@keyframes lineMove {
  from {
    right: 100%;
  }

  to {
    right: 0;
  }
}

@keyframes topMove {
  from {
    top: 0;
  }

  to {
    top: -50%;
    border-radius: 50%;
  }
}

@keyframes bottomMove {
  from {
    bottom: 0;
  }

  to {
    bottom: -50%;
    border-radius: 50%;
  }
}

@keyframes leftMove {
  from {
    left: 0;
  }

  to {
    left: -50%;
    border-radius: 40%;
  }
}

@keyframes rightMove {
  from {
    right: 0;
  }

  to {
    right: -50%;
    border-radius: 40%;
  }
}
</style>