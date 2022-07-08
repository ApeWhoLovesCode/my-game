<template>
  <div class="ttx-imgs-wrap">
    <template v-if="editable">
      <div v-if="value" class="item">
        <div class="img-wrap">
          <img :src="value">
          <div class="operate-wrap">
            <span class="operate-update" @click="updateImg()">更新</span>
            <span class="operate-delete" @click="deleteImg()">删除</span>
          </div>
          <label v-if="value" class="success-upload">
            <i />
          </label>
        </div>
      </div>
      <div v-if="!value" class="item">
        <div class="upload-icon-wrap" @click="addImg()">
          <i class="el-icon-plus" />
        </div>
      </div>
    </template>
    <template v-else>
      <div v-if="value"  class="item">
        <div class="img-wrap">
          <img :src="value">
        </div>
      </div>
    </template>
    <input id="uploadImg" type="file" accept="image/*" style="display:none;" @change="imgChange($event)">
  </div>
</template>

<script>
import api from "@/utils/api";
import axios from 'axios'
import {mapState} from 'vuex'

export default {
  props: {
    value: { // v-model 绑定的值
      type: [Array, String],
      required: true
    },
    editable: { // 是否可编辑,默认可编辑
      type: Boolean,
      required: false,
      default: true
    },
  },
  data() {
    const Id = Date.now() + Math.round(Math.random() * 10000) + '' + Math.round(Math.random() * 1000)
    return {
      Id: Id,
      handleChange: '',
    }
  },
  computed: {
    ...mapState(["gameUser"])
  },
  methods: {
    /** 上传图片 */
    async uploadImg(file) {
      try {
        const formData = new FormData()
        formData.append('img', file)
        const id = this.gameUser?.id ?? ''
        formData.append('id', id)
        formData.append('pass', '')
        const {data:res} = await axios({ 
          method: 'post', 
          url: '/uploadapi/upload',
          data: formData, 
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        if(res.code !== 200) {
          this.$message(res.data)
          return
        }
        this.$emit('input', res.data)
        if(id) {
          const { data:res2 } = await api.editUser({id, avatar: res.data});
          this.$store.commit("setUserInfo", res2.data);
        }
        return res.data
      } catch (error) {
        console.log('error: ', error);
      }
    },
    // 添加图片
    addImg() {
      this.handleChange = 'handleAddImg'
      document.getElementById('uploadImg').click()
    },
    // 添加图片，选取到图片后的回调函数
    async handleAddImg(file) {
      await this.uploadImg(file)
    },
    // 更新图片
    updateImg() {
      this.handleChange = 'handleUpdateImg'
      document.getElementById('uploadImg').click()
    },
    //  更新图片，选取到图片后的回调函数
    async handleUpdateImg(file) {
      await this.uploadImg(file)
    },
    // 删除图片
    deleteImg() {
      this.$emit('input', '')
    },
    // 选取图片
    imgChange($event) {
      const file = $event.target.files[0]
      this[this.handleChange](file)
      document.getElementById('uploadImg').value = ''
    },
  }
}
</script>

<style lang="scss" scoped>
.ttx-imgs-wrap{
  display: flex;
  flex-wrap: wrap;
  line-height: 0;

  .item{
    position: relative;
    padding: 0 10px 10px 0;

  }

  .img-wrap{
    position: relative;
    border-radius: 6px;
    overflow: hidden;
    img{
      width: 140px;
      height: 140px;
      cursor: pointer;
      border-radius: 6px;
      object-fit: contain;
    }
    .operate-wrap{
      display: flex;
      justify-content: space-around;
      align-items: center;
      position: absolute;
      width: 100%;
      overflow: hidden;
      left: 0;
      bottom: 0;
      height: 0;
      font-size: 0px;
      border-bottom-left-radius: 6px;
      border-bottom-right-radius: 6px;

      transition: height .3s ease;
      .operate-update{
        cursor: pointer;
        color: #66b1ff;
      }
      .operate-delete{
        cursor: pointer;
        color: rgb(253, 42, 42);
      }
    }
    &:hover .operate-wrap{
      font-size: 14px;
      height: 40px;
      background: rgba(0, 0, 0, 0.6);
    }
  }
  .upload-icon-wrap{
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    height: 140px;
    width: 140px;
    font-size: 28px;
    font-weight: 400;
    color: #8c939d;
    border: 1px dashed #c0ccda;
    background-color: #fbfdff;
    border-radius: 6px;
    cursor: pointer;
    &:hover{
      border: 1px dashed #66b1ff;
    }
  }

  .success-upload{
    position: absolute;
    right: -15px;
    top: -6px;
    width: 40px;
    height: 24px;
    background: #13ce66;
    text-align: center;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
    -webkit-box-shadow: 0 0 1pc 1px rgba(0,0,0,.2);
    box-shadow: 0 0 1pc 1px rgba(0,0,0,.2);
    i{
      color: #fff;
      font-family: element-icons!important;
      font-size: 12px;
      margin-top: 11px;
      -webkit-transform: rotate(-45deg);
      transform: rotate(-45deg);
      font-style: normal;
      font-weight: 400;
      font-variant: normal;
      text-transform: none;
      line-height: 1;
      vertical-align: baseline;
      display: inline-block;
      &::before{
        content: "√";
      }
    }
  }
  .noselect{ // 使文字不可以选择
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
}
</style>
