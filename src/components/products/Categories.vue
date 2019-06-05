<template>
  <div>
    <el-button type="success" plain @click="showAddDialog">添加分类</el-button>
    <el-table
      :data="categoryList"
      style="width:100%;"
      v-loading="loading"
      element-loading-text="亲，等会，玩命加载中"
      element-loading-spinner="el-icon-loading"
      >

      <!-- tree-key: 指定每一个节点的key，只有指定了才能，嵌套解析 -->
      <!-- level-key: 指定层级 -->
      <!--  parent-key: 如果不指定，没办法缩起来 -->
      <!-- indent-size:指定缩进 -->
      <!-- child-key: 通过哪个属性去查找子节点 children -->
      <el-table-tree-column
        label="分类名称"
        prop="cat_name"
        tree-key="cat_id"
        level-key="cat_level"
        parent-key="cat_pid"
        child-key="children"
        :indent-size="20">
      </el-table-tree-column>
      <el-table-column label="是否删除" prop="cat_deleted">
        <template slot-scope="scope">
          {{scope.row.cat_deleted?'是':'否'}}
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="cat_level"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" plain size="small"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain size="small" @click="delCategory(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页功能 -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="current"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <el-dialog
      title="添加商品分类"
      :visible.sync="addDialogVisible"
      width="40%">
      <!-- 表单 -->
      <el-form ref="addForm" :model="addForm" label-width="80px" :rules="rules" status-icon>
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <!-- 注意：清除表单校验的内容，一定需要指定一个prop -->
         <el-form-item label="父级名称" prop="cat_pid">
          <el-cascader
            clearable
            :options="options"
            change-on-select
            :props="props"
            v-model="addForm.cat_pid"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 导入elelemnt-tree-grid包
var ElTreeGrid = require('element-tree-grid')

export default {
  data() {
    return {
      categoryList: [],
      current: 1,
      pageSize: 10,
      total: 0,
      loading: true,
      addDialogVisible: false,
      addForm: {
        cat_name: '',
        cat_pid: []
      },
      rules: {
        cat_name: [
          { required: true, message: '请输入分类的名称', trigger: 'change' }
        ]
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }
    }
  },
  methods: {
    // 获取分类列表
    async getCategoryList() {
      let res = await this.axios.get('categories', {
        params: {
          type: 3,
          pagenum: this.current,
          pagesize: this.pageSize
        }
      })
      let { meta: { status }, data: { result, total } } = res.data
      if (status === 200) {
        this.categoryList = result
        this.total = total
        // 把loading加载状态清除即可
        setTimeout(() => {
          this.loading = false
        }, 500)
      }
    },
    // 修改了每页的条数
    handleSizeChange(val) {
      this.loading = true
      this.pageSize = val
      this.current = 1
      this.getCategoryList()
    },
    // 修改了当前页的页码
    handleCurrentChange(val) {
      this.loading = true
      this.current = val
      this.getCategoryList()
    },
    async showAddDialog() {
      this.addDialogVisible = true
      // 发送ajax请求，获取分类的属性（1级和2级）
      let res = await this.axios.get('categories?type=2')
      let { meta: { status }, data } = res.data
      if (status === 200) {
        this.options = data
        console.log(this.options)
      }
    },
    // 添加商品分类
    addCategory() {
      this.$refs.addForm.validate(async valid => {
        if (!valid) {
          return false
        }
        // 发送ajax请求
        let { cat_name: catName, cat_pid: catPid } = this.addForm
        let res = await this.axios.post('categories', {
          // 如果是一级分类，pid为0
          cat_pid: catPid[catPid.length - 1] || 0,
          cat_name: catName,
          cat_level: catPid.length
        })

        let { meta: { status, msg } } = res.data
        if (status === 201) {
          this.addDialogVisible = false
          this.$refs.addForm.resetFields()
          this.getCategoryList()
          this.$message.success('添加商品分类成功了')
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 删除商品分类
    async delCategory(row) {
      await this.$confirm('你确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      // 发送ajax请求
      let res = await this.axios.delete(`categories/${row.cat_id}`)
      let { meta: { status, msg } } = res.data
      if (status === 200) {
        this.getCategoryList()
        this.$message.success('删除分类成功了')
      } else {
        this.$message.error(msg)
      }
    }
  },
  created() {
    // 获取列表的数据
    this.getCategoryList()
  },
  components: {
    // 把ElTreeGrid注册为局部的组件
    [ElTreeGrid.name]: ElTreeGrid
  }
}
</script>

<style>
</style>
