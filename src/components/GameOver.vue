<template>
  <fixedPop
    class="gameoverPop"
    ref="gameoverPop"
  >
    <div class="title">{{ gameName }}&emsp;游戏结束</div>
    <div class="content">
      <div class="gameOverScore">
        <slot></slot>
      </div>
      <!-- 排行榜 -->
      <div class="rankList" v-if="isRankList">
        <div class="rankName">排行榜</div>
        <vue-custom-scrollbar class="scrollRank">
          <div class="rankItem" v-for="item in rankList" :key="item.id">
            <img :src="item.avatar"></img>
            <div class="rankItemData">
              <div class="rankUser">{{item.name}}</div>
              <div class="rankScore">得分：{{item["g" + gameId]}}</div>
            </div>
          </div>
        </vue-custom-scrollbar>
      </div>
    </div>
    <div class="bottom">
      <el-button class="cancel" @click="exit">退出游戏</el-button>
      <el-button class="confirm" @click="restart">重新开始</el-button>
    </div>
  </fixedPop>
</template>

<script>
import fixedPop from "@/components/fixedPop/fixedPop.vue";
import vueCustomScrollbar from "vue-custom-scrollbar";
import "vue-custom-scrollbar/dist/vueScrollbar.css";
import api from "../utils/api.js";
export default {
  name: "gameover",
  components: {
    fixedPop,
    vueCustomScrollbar,
  },
  props: {
    gameName: {
      type: String,
      default: "小游戏",
    },
    gameId: {
      type: Number,
      require: true,
    },
    isRankList: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      // 排行榜数据
      rankList: [],
    };
  },
  computed: {},
  watch: {},
  mounted() {
    this.getRankList();
  },
  methods: {
    // 发起网络请求，获取排行榜数据
    async getRankList() {
      let gameId = "g" + this.gameId;
      const { data } = await api.getRankList({ gameId });
      this.rankList = data.data;
    },
    popshow() {
      this.$refs.gameoverPop.popshow();
    },
    popclose() {
      this.$refs.gameoverPop.popclose();
    },
    exit() {
      this.$emit("exit");
    },
    restart() {
      this.$emit("restart");
    },
  },
};
</script>
<style lang='scss'>
/* 这里不要 scoped 因为插槽的样式要用到 */
.gameoverPop {
  .title {
    text-align: center;
    margin-top: 10px;
    font-size: 15px;
    font-weight: bold;
  }
  .content {
    margin: 20px 0;
    display: flex;
    align-items: center;
    .gameOverScore {
      flex: 2;
      .gameoverItem {
        opacity: 0;
        font-size: 15px;
        margin-bottom: 10px;
        animation: score 0.4s linear 0.3s forwards;
        i {
          color: #e9e932;
        }
      }
      .gameoverItem:last-child {
        margin-bottom: 0;
      }
    }
    .rankList {
      flex: 3;
      user-select: none;
      .rankName {
        user-select: none;
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 5px;
        text-align: center;
      }
      .scrollRank {
        margin: auto;
        width: 100%;
        height: 200px;
      }
      .rankItem {
        display: flex;
        align-items: center;
        height: 40px;
        img {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 10px;
        }
        .rankItemData {
          font-size: 13px;
        }
      }
      .rankItem:last-child {
        margin-bottom: 0;
      }
    }
  }
  .bottom {
    margin: 10px 30px;
    text-align: right;
    .cancel {
      padding: 10px;
      font-size: 13px;
      margin-right: 10px;
    }
    .confirm {
      padding: 10px;
      font-size: 13px;
      background: #6557f7;
      color: #fff;
    }
    .confirm:hover {
      opacity: 0.8;
    }
  }
}

@keyframes score {
  0% {
    opacity: 0;
    transform: translateX(-50px);
  }
  100% {
    opacity: 1;
    transform: translateX(30px);
  }
}
</style>