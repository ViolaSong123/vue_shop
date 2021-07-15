<template>
    <div>
        <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
        <el-row>
            <el-col>
                <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
            </el-col>
        </el-row>
    </el-card>
     <div class='categoryContainer'>
         <!-- 分类表格
        :data(设置数据源) :columns(设置表格中列配置信息) :selection-type(是否有复选框)
        :expand-type(是否展开数据) show-index(是否设置索引列) index-text(设置索引列头)
        border(是否添加纵向边框) :show-row-hover(是否鼠标悬停高亮)
        -->
        <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index index-text="#"
        border
        :show-row-hover="false"
        >
            <!-- 是否有效区域， 设置对应的模板列： slot="isok"(与columns中设置的template一致) -->
            <template slot="isok" slot-scope="scope">
            <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:lightgreen"></i>
            <i class="el-icon-error" v-else style="color:red"></i>
            </template>

            <!-- 排序 -->
            <template slot="order" slot-scope="scope">
            <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
            <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
            <el-tag size="mini" type="warning" v-else>三级</el-tag>
            </template>

            <!-- 操作 -->
            <template slot="opt">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            </template>
        </tree-table>
      </div>
      <!-- 分页 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[3, 5, 10, 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
      </el-pagination>

      <!-- 添加分类对话框 -->
      <el-dialog title="添加分类" :visible.sync="showAddCateDialogFlag" width="50%"  @close="cancalAddCate">
        <!-- 添加分类表单 -->
        <el-form :model="addCateForm" :rules="cateRules" ref="addCateFormRef" label-width="100px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类" prop="cat_pid">
            <el-cascader
              expandTrigger='hover'
              v-model="selectedKeys"
              :options="parentCateList"
              :props="cascaderProps"
              @change="parentCateChange"
              clearable
              change-on-select>
            </el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancalAddCate">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>
<script>
export default ({
  created() {
    this.getCateList()
  },
  data() {
    return {
      cateList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        // type:'template'(将该列设置为模板列)，template:'isok'(设置该列模板的名称为isok)
        { label: '是否有效', prop: '', type: 'template', template: 'isok' },
        { label: '排序', prop: '', type: 'template', template: 'order' },
        { label: '操作', prop: '', type: 'template', template: 'opt' }
      ],
      showAddCateDialogFlag: false,
      addCateForm: {
        cat_name: '',
        // 添加分类的父级id，0则表示父级为0.添加一级分类
        cat_pid: 0,
        // 添加分类的等级，0则表示添加一级分类
        cat_level: 0
      },
      cateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在2-10个字符', trigger: 'blur' }
        ]
      },
      // 配置级联菜单中数据如何展示
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 父级分类
      parentCateList: [],
      selectedKeys: []
    }
  },
  methods: {
    async getCateList () {
      this.showLoading()
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      // console.log(res)
      this.hideLoading()
      if (res.meta.status !== 200) return this.$message('获取数据异常')
      this.cateList = res.data.result
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
    // 当pagesize发生改变时触发
      this.queryInfo.pagesize = newSize
      console.log(this.queryInfo)
      this.getCateList()
    },
    handleCurrentChange(newPage) {
    // 当pagenum发生改变时触发
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    showAddCateDialog() {
      this.showAddCateDialogFlag = true
      this.getParentCateList()
    },
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        console.log(res)
        if (res.meta.status !== 201) { return this.$message.error('添加分类失败') }
        this.$message.success('添加分类成功')
        this.getCateList()
        this.showAddCateDialogFlag = false
      })
    },
    cancalAddCate () {
      this.showAddCateDialogFlag = false
      this.addCateForm = {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      }
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表数据失败')
      }
      this.parentCateList = res.data
    },
    parentCateChange() {
      console.log(this.selectedKeys)
      const len = this.selectedKeys.length
      if (len === 0) {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      } else {
        this.addCateForm.cat_pid = this.selectedKeys[len - 1]
        this.addCateForm.cat_level = len
      }
    }
  }
})
</script>
<style scoped>
.categoryContainer{
    width:100%;
    overflow: scroll;
    margin-top:20px;
}
</style>
