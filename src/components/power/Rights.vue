<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 权限列表 -->
    <div class="tableContainer">
      <el-table
        :data="rightsList"
        border
        :row-class-name="tableRowClassName"
        heigth='250'
        max-height="750"
        fixed='top'>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="权限名称" prop="authName"></el-table-column>
      <el-table-column label="路径" prop="path"></el-table-column>
      <el-table-column label="权限等级" prop="level">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="提示文字" placement="top-start">
            <el-tag v-if="scope.row.level == 0" type="success">一级权限</el-tag>
            <el-tag v-else-if="scope.row.level == 1" type="info">二级权限</el-tag>
            <el-tag v-else type="warning">三级权限</el-tag>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rightsList: [],
      styleArr: ['level1', 'level2', 'level3']
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      this.rightsList = res.data
    },
    tableRowClassName (row) {
      const level = row.row.level
      return this.styleArr[+level]
    }
  }
}
</script>
<style scoped>
.el-table .level3 {
    background: rgb(0, 255, 115);
}
.el-table .level1 {
    background: rgba(214, 145, 16, 0.808) !important;
}
.el-table .level2 {
    background: #f0f9eb;
}
.tableContainer{
  width: 100%;
  height: 100%;
}
</style>
