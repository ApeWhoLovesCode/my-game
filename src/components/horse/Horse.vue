<template>
  <div class="main">
    <section>
      <div class="horse">A</div>
      <div class="horse">D</div>
      <div class="horse">M</div>
      <div class="horse">I</div>
      <div class="horse">N</div>
    </section>
    <div class="welcome">
      <h1>welcome</h1>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
/* 3D位移：translate3d(x,y,z) 
  3D旋转：rotate3d(x,y,z,deg) 沿着自定义轴旋转 deg为角度 左手定则 拇指轴方向 4指旋转正方向
  透视：perspective   透视就是视距(人眼到屏幕的距离)
  3D呈现transfrom-style*/
.main {
  perspective: 1000px;
}
section {
  position: relative;
  width: 12vw;
  height: 12vw;
  margin: 10vh auto;
  transform-style: preserve-3d;
  /* 添加动画 */
  animation: rotate 18s linear infinite;
  background: url('../../assets/img/logo.png') no-repeat;
  background-size: 100% 100%;
}

@keyframes rotate {
  0% {
    transform: rotateY(0);
  }

  100% {
    transform: rotateY(360deg);
  }
}

section .horse {
  position: absolute;
  left: 30%;
  top: 30%;
  width: 6vw;
  height: 6vw;
  font-size: 6vw;
  color: #41b883;
  /* background: url(./horse_img/logo.png) no-repeat;
  background-size: 100% 100%; */
}

/* 先旋转好再移动距离 */
.horse:nth-child(1) {
  transform: rotateY(0) translateZ(20vw);
}
.horse:nth-child(2) {
  transform: rotateY(72deg) translateZ(20vw);
}
.horse:nth-child(3) {
  transform: rotateY(144deg) translateZ(20vw);
}
.horse:nth-child(4) {
  transform: rotateY(216deg) translateZ(20vw);
}
.horse:nth-child(5) {
  transform: rotateY(288deg) translateZ(20vw);
}

.welcome {
  margin: 10vh;
  text-align: center;
  font-size: 3vw;
  color: #41b883;
}
</style>