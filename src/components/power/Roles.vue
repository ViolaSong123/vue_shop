<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 权限列表 -->
    <el-table :data="roleList" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope" width='300px'>
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
          <el-button size="mini" type="warning" icon="el-icon-setting">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 对话框 -->
    <el-dialog title="修改角色信息" :visible.sync="dialogFormVisible">
      <el-form :model="editForm" :rules="editRules" ref="editForm" label-width="200px" >
        <el-form-item label="角色名称" :label-width="formLabelWidth" prop='roleName'>
          <el-input v-model="editForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth" prop='roleDesc'>
          <el-input v-model="editForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
        <el-button @click='resetForm'>重置</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      roleList: [],
      dialogFormVisible: false,
      formLabelWidth: '180px',
      editForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      editRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'change' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'change' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ]
      }

    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.get('roles')
      this.roleList = res.data
    },
    showEditDialog(info) {
      console.log(info)
      this.dialogFormVisible = true
      this.editForm.id = info.id
      this.editForm.roleDesc = info.roleDesc
      this.editForm.roleName = info.roleName
    },
    editRole () {
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.put('roles/:' + this.editForm.id, this.editForm)
          console.log(res)
          if (res.meta.status !== 200) {
            this.$message.error(res.meta.msg)
          } else {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.getRoleList()
          }
        } else {
          const h = this.$createElement
          this.$message({
            message: h('p', { style: 'color: red' }, '请按照要求填写！'),
            type: 'warning'
          })
        }
      })
    },
    resetForm () {
      this.$refs.editForm.resetFields()
    }
  }
}
</script>
