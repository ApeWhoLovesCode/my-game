<template>
  <div class="page-tree">
    <div class="title-wrap">
      <div class="title-name">菜单名称</div>
      <div class="title-item">菜单编码</div>
      <div class="title-item">排序</div>
      <div class="title-item">彭书记</div>
    </div>
    <el-tree
      class="tree"
      :data="treeData"
      show-checkbox
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
      @check-change="checkItem"
    >
      <div class="tree-node" slot-scope="{ node, data }">
        <div class="tree-name"><i class="el-icon-s-cooperation"></i>{{ node.label.name }}</div>
        <div class="tree-item">{{ node.label.coding}}</div>
        <div class="tree-item">{{ node.label.sort }}</div>
        <div class="tree-item">{{ node.label.pkr }}</div>
      </div>
    </el-tree>
    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="date"
        label="日期"
        sortable
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        sortable
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

export default {
  data() {
    return {
      treeData: [{
        id: 1,
        label: {name: '报表',coding: 9000, sort: 8000, pkr: '彭科瑞'},
        children: [{
          id: 4,
          label: {name: '生产日报',coding: 900022, sort: 800022, pkr: '彭科瑞222'},
        }]
      }, {
        id: 2,
        label: {name: '仓库管理',coding: 9000, sort: 8000, pkr: '仓库管理彭科瑞'},
        children: [{
          id: 5,
          label: {name: '出库',coding: 9000, sort: 8000, pkr: '出库彭科瑞'},
        }, {
          id: 6,
          label: {name: '入库',coding: 9000, sort: 8000, pkr: '入库彭科瑞'},
        }]
      }],
      tableData: [{
          id: 1,
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          id: 2,
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          id: 3,
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
          children: [{
              id: 31,
              date: '2016-05-01',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1519 弄'
            }, {
              id: 32,
              date: '2016-05-01',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1519 弄'
          }]
        }, {
          id: 4,
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
      }],
    };
  },
  computed: {
  },
  methods: {
    checkItem(item) {
      console.log(item);
    }
  }
};
</script>

<style scoped lang="scss">
.page-tree {
  .title-wrap {
    width: 100%;
    height: 30px;
    display: flex;
    background: #ebeced;
    .title-name {
      /* 24 + 14 + 8 + 200 */
      width: 246px;
      border-right: 1px solid #c7c7c7;
    }
    .title-item {
      flex: 1;
      height: 100%;
      display: flex;
      align-items: center;
      border-right: 1px solid #c7c7c7;
      padding-left: 10px;
    }
    .title-item:last-child {
      border-right: 0;
    }
  }
  .tree {
    margin-bottom: 30px;
  }
  .tree-node {
    width: 100%;
    /* elementui 里面每一行的高度都是26px */
    height: 26px;
    line-height: 26px;
    display: flex;
    justify-content: space-between;
    .tree-name {
      width: 200px;
      border-right: 1px solid #c7c7c7;
    }
    .tree-item {
      flex: 1;
      border-right: 1px solid #c7c7c7;
      padding-left: 10px;
    }
    .tree-item:last-child {
      border-right: 0;
    }
  }
  /* 第二级的样式 */
  .el-tree-node__children {
    .tree-name {
      /* 200 - 18 第二级有 18 padding-left */
      width: 182px;
    }
  }
}
</style>
