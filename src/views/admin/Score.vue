<template>
  <div class="page-score" ref="pageScoreRef">
    <el-carousel @change="carouselChange" :interval="4000" type="card" trigger="click" :height="carheight" :autoplay="false">
      <el-carousel-item class="cartItem" :class="{'noCurCard': carIndex !== index}" v-for="(item,index) in scoreList" :key="index">
        <div class="score-head">
          <img class="score-img" :src="item.img">
          <div class="score-title">{{item.name}}</div>
        </div>
        <vue-custom-scrollbar class="scroll-card">
          <el-table :data="item.rankList" stripe style="width: 100%">
            <el-table-column type="index" header-align="center" align="center" width="70" label="序号" />
            <el-table-column label="用户信息" header-align="center" align="center">
              <template slot-scope="scope">
                <div class="userInfo">
                  <img class="avatar" :src="scope.row.avatar"></img>
                  <div class="name">{{ scope.row.name }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="item.id !== 107 ? '得分' : '用时'" header-align="center" align="center">
              <template slot-scope="scope">
                <div class="score-num">{{ item.id !== 107 ? scope.row.score : usedTime(scope.row.score) }}</div>
              </template>
            </el-table-column>
            <el-table-column label="封禁该成绩" header-align="center" align="center">
              <template slot-scope="scope">
                <div>
                  <el-switch v-model="scope.row.isban" @change="banUser(scope.row, item)" />
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
import adminApi from "@/utils/adminApi";
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
      carheight: '',
      carIndex: 0,
      windowTime: null
    }
  },
  computed: {
    usedTime() {
      return (time) => {
        if(time === 0) return '无成绩'
        let res = ''
        let min = parseInt(time / 60 )
        if(min < 1) res = time
        else if(min < 60) res = `${min}:${time % 60}`
        else res = `${parseInt(min / 60)}:${min % 60}:${time % 3600}`
        return res
      }
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
    async getScoreList() {
      try {
        const {data: res} = await adminApi.getScoreList()
        let list = res.data
        list.forEach((item) => {
          item['pageNum'] = 1
          item['pageSize'] = 10
          item['pageTotal'] = item.rankList.length
          item.rankList.forEach(item2 => {
            item2.isban = (item2.isban === 0 ? false : true)
          })
        })

        this.scoreListCopy = JSON.parse(JSON.stringify(list))
        list.forEach((item) => {
          item.rankList = item.rankList.slice(0, 10)
        })
        this.scoreList = list
      } catch (error) {
        console.log('error: ', error);
      }
    },
    // 封禁该成绩
    async banUser(user, game) {
      let isban = user.isban ? 1 : 0
      await adminApi.banScore({userId: user.id, gameId: game.id, isban})
      if(user.isBan) {
        this.messageShow(true, `${user.name}的“${game.name}”成绩已被封禁`)
      } else {
        this.messageShow(true, `${user.name}的${game.name}成绩已经解封`)
      }
    },
    // 走马灯切换页面
    carouselChange(i) {
      this.carIndex = i
    },
    curSizeChange(size, i) {
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
        this.$message({ type: 'success', message: `${msg}` })
        this.getScoreList()
      } else {
        this.$message({ type: 'error', message: `${msg}` })
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
      align-items: center;
      justify-content: center;
      height: 10%;
      color: #000;
      font-size: 24px;
      font-weight: bold;
      background: #fff;
      border-bottom: 2px solid #ececec;
      box-sizing: border-box;
      .score-img {
        width: auto;
        height: 80%;
        border-radius: 5px;
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
        align-items: center;
        .avatar {
          width: 30px;
          height: 30px;
          margin-right: 10px;
          border-radius: 50%;
        }
      }
    }
    .pagination {
      box-sizing: border-box;
      padding-top: 5px;
      height: 8%;
      text-align: center;
      border-top: 1px solid #ececec;
    }
  }
}
</style>
