<template>
  <div class="page-home">
    <div v-for="(item,i) in tabsList" :key="i" class="tabs" :class="`tabitem${i+1}`">
      <router-link :to="item.path">
        <div class="tabTo">{{item.tab}}</div>
      </router-link>
    </div>
    <div class="content">
      <!-- <vue-custom-scrollbar class="scroll-area"> -->
        <router-view></router-view>
      <!-- </vue-custom-scrollbar> -->
    </div>
  </div>
</template>

<script>
import vueCustomScrollbar from 'vue-custom-scrollbar'
import "vue-custom-scrollbar/dist/vueScrollbar.css"
import {mapState} from 'vuex'
export default {
  components: {
    vueCustomScrollbar
  },
  data() {
    return {
      tabsList: [{tab: '用户管理', path: '/admin/user'},{tab: '游戏管理', path: '/admin/game'},{tab: '评论管理', path: '/admin/comment'},{tab: '得分管理', path: '/admin/score'}],
    }
  },
  computed: {
    ...mapState(['adminUser'])
  },
  created() {
    if(this.adminUser.token !== 'lhh_token_07') {
      this.$router.push('/admin/login')
    }
  },
  mounted() {},
  methods: {},
}
</script>

<style scoped lang="scss">
.page-home {
  position: relative;
  min-width: 1200px;
  min-height: 600px;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(to right, #24243e, #332d77, #24243e);
  .content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    height: 80%;
    // background: #c4c2e0;
    background: rgba(255, 255, 255, .3);
    box-sizing: border-box;
    padding: 30px 100px;
    .scroll-area {
      margin: auto;
      width: 100%;
      height: 100%;
    }
  }
  .tabs {
    position: absolute;
    box-sizing: border-box;
    z-index: 1;
    width: 200px;
    height: 200px;
    font-size: 24px;
    cursor: pointer;
    overflow: hidden;
    box-shadow: 0 0 20px 5px rgba(113, 92, 185, 0.5);
    user-select: none;
    .tabTo {
      width: 100%;
      height: 100%;
    }
  }
  .tabs:hover {
    opacity: .9;
  }
  .tabitem1 {
    left: 0;
    top: 0;
    border-radius: 0 0 100% 0;
    padding-left: 30px;
    line-height: 150px;
    background-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
  .tabitem2 {
    right: 0;
    top: 0;
    border-radius: 0 0 0 100%;
    text-align: right;
    padding-right: 30px;
    line-height: 150px;
    background-image: linear-gradient(225deg, #667eea 0%, #764ba2 100%);
  }
  .tabitem3 {
    right: 0;
    bottom: 0;
    border-radius: 100% 0 0 0;
    text-align: right;
    padding-right: 30px;
    line-height: 250px;
    background-image: linear-gradient(315deg, #667eea 0%, #764ba2 100%);
  }
  .tabitem4 {
    left: 0;
    bottom: 0;
    border-radius: 0 100% 0 0;
    padding-left: 30px;
    line-height: 250px;
    background-image: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  }
}
</style>
