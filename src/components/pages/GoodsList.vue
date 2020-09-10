<template>
  <div class="list">
    <!-- 卡片视图 -->
    <el-card>
      <!-- 头部查询框与添加商品按钮 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="querys.query" clearable @input="searchGoods">
            <el-button slot="append" icon="el-icon-search" @click="searchGoods"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表数据 -->
      <el-table :data="goodsList" border stripe height="630" style="width: 100%">
        <el-table-column type="index" label="#" width="60"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="680"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格（元）" width="180"></el-table-column>
        <el-table-column prop="goods_number" label="商品数量" width="180"></el-table-column>
        <el-table-column label="创建时间" width="180">
          <template v-slot="scope">{{scope.row.add_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="text" icon="el-icon-edit">修改</el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              style="color:red"
              @click="deleteGoods(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="querys.pagenum"
        :page-size="querys.pagesize"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { request } from "@/network/request.js";
export default {
  data() {
    return {
      querys: {
        // 查询参数
        query: "",
        // 当前页
        pagenum: 1,
        // 每页显示条数
        pagesize: 100,
      },
      // 商品总数
      total: 0,
      // 商品列表数据
      goodsList: [],
    };
  },
  mounted() {
    this.getGoodsList();
    this.getCateList();
  },
  methods: {
    // 获取商品列表数据
    async getGoodsList() {
      const res = await request({
        url: "goods",
        params: this.querys,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取商品列表失败");
      this.total = res.data.total;
      this.goodsList = res.data.goods;
    },
    // 获取分类数据列表
    async getCateList() {
      const res = await request("categories");
      if (res.meta.status !== 200)
        return this.$message.error("获取分类列表失败");
      this.cateList = res.data;
    },
    // 当级联选择器 发生变化时
    handleSelectedChange() {
      this.addGoodsForm.goods_cat = this.selectedValue.join(",");
    },
    // 当前页变化时触发
    handleCurrentChange(val) {
      this.querys.pagenum = val;
      this.getGoodsList();
    },
    // 根据关键字查询商品
    searchGoods() {
      this.getGoodsList();
    },
    // 点击显示 添加商品对话框
    goAddPage() {
      this.$router.push("/add");
    },
    // 删除商品
    deleteGoods(row) {
      console.log(row);
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await request({
            method: "delete",
            url: "goods/" + row.goods_id,
          });
          if (res.meta.status !== 200) return this.$message.error("删除失败");
          this.getGoodsList();
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 20px;
}
.el-pagination {
  margin-top: 20px;
}
</style>