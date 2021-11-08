<template>
  <div class="page-score" ref="pageScoreRef">
    <el-carousel @change="carouselChange" :interval="4000" type="card" trigger="click" :height="carheight" :autoplay="false">
      <el-carousel-item class="cartItem" :class="{'noCurCard': carIndex !== index}" v-for="(item,index) in scoreList" :key="index">
        <div class="score-head">
          <img class="score-img" :src="item.img">
          <div class="score-title">{{item.game}}</div>
        </div>
        <vue-custom-scrollbar class="scroll-card">
          <el-table :data="item.rankList" stripe style="width: 100%">
            <el-table-column type="index" header-align="center" align="center" width="70" label="序号" />
            <el-table-column label="用户信息" header-align="center" align="center">
              <template slot-scope="scope">
                <div class="userInfo">
                  <img class="avatar" :src="item.img"></img>
                  <div class="name">{{ scope.row.name }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="得分" header-align="center" align="center">
              <template slot-scope="scope">
                <div class="score-num">{{ scope.row.score }}</div>
              </template>
            </el-table-column>
            <el-table-column label="封禁该成绩" header-align="center" align="center">
              <template slot-scope="scope">
                <div>
                  <el-switch v-model="scope.row.isBan" @change="banUser(scope.row)" />
                </div>
              </template>
            </el-table-column>
          </el-table>
        </vue-custom-scrollbar>
        <div class="pagination">
          <el-pagination background layout="prev, pager, next" :total="item.pageTotal" :current-page.sync="item.pageNum" :page-size.sync="item.pageSize"
            @current-change="(param) => curSizeChange(param, index)" />
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import vueCustomScrollbar from 'vue-custom-scrollbar'
import 'vue-custom-scrollbar/dist/vueScrollbar.css'
import adminPop from '@/components/adminPop/adminPop'
import {throttle} from "@/utils/debounce.js"
export default {
  components: {
    vueCustomScrollbar,
    adminPop,
  },
  data() {
    return {
      scoreList: [],
      scoreListCopy: [],
      addUserList: [],
      carheight: '500px',
      carIndex: 0,
      windowTime: null
    }
  },
  created() {},
  mounted() {
    this.getScoreList()
    this.carheight = this.$refs.pageScoreRef.offsetHeight - 20 + 'px'
    this.reSet = throttle(this.reSet, 30, true)
    const that = this
    window.addEventListener("resize", function (e) {
      that.reSet()
    });
  },
  methods: {
    reSet() {
      this.carheight = this.$refs.pageScoreRef.offsetHeight - 20 + 'px'
    },
    getScoreList() {
      let data = [
        {
          game: '贪吃蛇',
          img: require('@/assets/img/logo.png'),
          rankList: [
            { id: 101, name: '李白1', score: '66', isBan: false },
            { id: 102, name: '李白2', score: '66', isBan: true },
            { id: 103, name: '李白3', score: '66', isBan: true },
            { id: 104, name: '李白4', score: '66', isBan: false },
            { id: 105, name: '李白5', score: '66', isBan: false },
            { id: 106, name: '李白6', score: '66', isBan: false },
            { id: 107, name: '李白7', score: '66', isBan: false },
            { id: 108, name: '李白8', score: '66', isBan: false },
            { id: 109, name: '李白9', score: '66', isBan: false },
            { id: 110, name: '李白10', score: '66', isBan: false },
            { id: 111, name: '李白11', score: '66', isBan: false },
            { id: 112, name: '李白12', score: '66', isBan: false },
          ],
        },
        {
          game: '俄罗斯方块',
          img: require('@/assets/img/logo.png'),
          rankList: [
            { id: 101, name: '李白1', score: '66', isBan: false },
            { id: 102, name: '李白2', score: '66', isBan: true },
            { id: 103, name: '李白3', score: '66', isBan: true },
            { id: 104, name: '李白4', score: '66', isBan: false },
            { id: 105, name: '李白5', score: '66', isBan: false },
            { id: 106, name: '李白6', score: '66', isBan: false },
            { id: 107, name: '李白7', score: '66', isBan: false },
            { id: 108, name: '李白8', score: '66', isBan: false },
            { id: 109, name: '李白9', score: '66', isBan: false },
            { id: 110, name: '李白10', score: '66', isBan: false },
            { id: 111, name: '李白11', score: '66', isBan: false },
            { id: 112, name: '李白12', score: '66', isBan: false },
          ],
        },
        {
          game: '飞机大战',
          img: require('@/assets/img/logo.png'),
          rankList: [
            { id: 101, name: '李白1', score: '66', isBan: false },
            { id: 102, name: '李白2', score: '66', isBan: true },
            { id: 103, name: '李白3', score: '66', isBan: true },
            { id: 104, name: '李白4', score: '66', isBan: false },
            { id: 105, name: '李白5', score: '66', isBan: false },
            { id: 106, name: '李白6', score: '66', isBan: false },
            { id: 107, name: '李白7', score: '66', isBan: false },
            { id: 108, name: '李白8', score: '66', isBan: false },
            { id: 109, name: '李白9', score: '66', isBan: false },
            { id: 110, name: '李白10', score: '66', isBan: false },
            { id: 111, name: '李白11', score: '66', isBan: false },
            { id: 112, name: '李白12', score: '66', isBan: false },
          ],
        },
        {
          game: '飞翔的小鸟',
          img: require('@/assets/img/logo.png'),
          rankList: [
            { id: 101, name: '李白1', score: '66', isBan: false },
            { id: 102, name: '李白2', score: '66', isBan: true },
            { id: 103, name: '李白3', score: '66', isBan: true },
            { id: 104, name: '李白4', score: '66', isBan: false },
            { id: 105, name: '李白5', score: '66', isBan: false },
            { id: 106, name: '李白6', score: '66', isBan: false },
            { id: 107, name: '李白7', score: '66', isBan: false },
            { id: 108, name: '李白8', score: '66', isBan: false },
            { id: 109, name: '李白9', score: '66', isBan: false },
            { id: 110, name: '李白10', score: '66', isBan: false },
            { id: 111, name: '李白11', score: '66', isBan: false },
            { id: 112, name: '李白12', score: '66', isBan: false },
          ],
        },
        {
          game: '2048',
          img: require('@/assets/img/logo.png'),
          rankList: [
            { id: 101, name: '李白1', score: '66', isBan: false },
            { id: 102, name: '李白2', score: '66', isBan: true },
            { id: 103, name: '李白3', score: '66', isBan: true },
            { id: 104, name: '李白4', score: '66', isBan: false },
            { id: 105, name: '李白5', score: '66', isBan: false },
            { id: 106, name: '李白6', score: '66', isBan: false },
            { id: 107, name: '李白7', score: '66', isBan: false },
            { id: 108, name: '李白8', score: '66', isBan: false },
            { id: 109, name: '李白9', score: '66', isBan: false },
            { id: 110, name: '李白10', score: '66', isBan: false },
            { id: 111, name: '李白11', score: '66', isBan: false },
            { id: 112, name: '李白12', score: '66', isBan: false },
          ],
        },
      ]
      data.forEach((item) => {
        item['pageNum'] = 1
        item['pageSize'] = 10
        item['pageTotal'] = item.rankList.length
      })
      this.scoreListCopy = JSON.parse(JSON.stringify(data))
      data.forEach((item) => {
        item.rankList = item.rankList.slice(0, 10)
      })
      this.scoreList = data
    },
    // 封禁该成绩
    banUser(user) {},
    // 走马灯切换页面
    carouselChange(i) {
      this.carIndex = i
    },
    curSizeChange(size, i) {
      console.log('curSizeChange', size, i)
      this.$nextTick(() => {
        const list = this.scoreListCopy[i]
        let num = (size - 1) * list.pageSize
        this.scoreList[i].rankList = list.rankList.slice(
          num,
          num + list.pageSize
        )
      })
    },
    messageShow(isSuccess, msg) {
      if (isSuccess) {
        this.$message({ type: 'success', message: `${msg}成功` })
        this.getVersionList()
      } else {
        this.$message({ type: 'error', message: `${msg}失败` })
      }
    },
  },
}
</script>

<style scoped lang="scss">
.page-score {
  height: 100%;
  .noCurCard {
    opacity: 0.5;
  }
  .cartItem {
    background: #fff;
    border-radius: 5px;
    .score-head {
      display: flex;
      height: 10%;
      align-items: center;
      color: #000;
      font-size: 24px;
      font-weight: bold;
      background: #fff;
      padding-left: 20px;
      .score-img {
        height: 80%;
        border-radius: 50%;
      }
      .score-title {
        margin-left: 20px;
        font-size: 22px;
        font-weight: bold;
      }
    }
    .scroll-card {
      width: 100%;
      height: 82%;
      .userInfo {
        display: flex;
        justify-content: center;
        .avatar {
          width: 30px;
          height: 30px;
          margin-right: 10px;
        }
      }
    }
    .pagination {
      box-sizing: border-box;
      padding-top: 5px;
      height: 8%;
      text-align: center;
    }
  }
}
</style>
