<template>
  <div>
    <!-- 按钮 -->

    <el-button type="success" plain @click="$router.push('/goods-add')">添加商品</el-button>
    <el-table :data="goodList" style="width: 100%;">
      <el-table-column type="index" :index="indexMethod"></el-table-column>
      <el-table-column label="商品名称" prop="goods_name"></el-table-column>
      <el-table-column label="商品价格" prop="goods_price"></el-table-column>
      <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          {{scope.row.add_time | dateFilter}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" plain size="small"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain size="small"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="current"
      :page-sizes="[10,20,30,40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: '',
      current: 1,
      pageSize: 10,
      total: 0,
      goodList: []
    }
  },
  methods: {
    // 获取商品列表
    async getGoodList() {
      let res = await this.axios.get('goods', {
        params: {
          query: this.query,
          pagenum: this.current,
          pagesize: this.pageSize
        }
      })
      let { meta: { status }, data: { total, goods } } = res.data
      if (status === 200) {
        this.total = total
        this.goodList = goods
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.current = 1
      this.getGoodList()
    },
    handleCurrentChange(val) {
      this.current = val
      this.getGoodList()
    },
    indexMethod(index) {
      return (this.current - 1) * this.pageSize + index + 1
    }
  },
  created() {
    this.getGoodList()
  }
}
</script>

<style>
</style>
