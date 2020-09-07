<template>
  <div class="category">
    <el-card>
      <!-- 添加分类按钮 -->
      <el-button type="primary" class="addCate" @click="addCate">添加分类</el-button>
      <!-- 商品分类数据表格 -->
      <el-table
        :data="goodsCateList"
        row-key="cat_id"
        border
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column prop="cat_name" label="分类名称" width="220"></el-table-column>
        <el-table-column prop="cat_deleted" label="是否有效" width="220">
          <template v-slot="scope">
            <el-button
              type="success"
              icon="el-icon-check"
              v-if="!scope.row.cat_deleted"
              size="mini"
              circle
            ></el-button>
            <el-button type="danger" icon="el-icon-close" size="mini" circle v-else></el-button>
          </template>
        </el-table-column>
        <el-table-column label="排序" width="220">
          <template v-slot="scope">
            <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
            <el-tag v-else-if="scope.row.cat_level == 1" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="text" icon="el-icon-edit" @click="editCate(scope.row)">编辑</el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              style="color:red"
              @click="deleteCate(scope.row)"
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

      <!-- 编辑分类弹框 -->
      <el-dialog
        title="编辑"
        :visible.sync="editCateDialogVisible"
        width="30%"
        @close="editCateDialogClosed"
      >
        <el-form
          :model="editCateForm"
          :rules="editCateRules"
          ref="editCateRef"
          label-width="110px"
          label-position="left"
        >
          <el-form-item label="分类id">
            <el-input v-model="editCateForm.cat_id" disabled></el-input>
          </el-form-item>
          <el-form-item label="当前分类名称">
            <el-input v-model="editCateForm.cat_old_name" disabled></el-input>
          </el-form-item>
          <el-form-item label="修改分类名称" prop="cat_name">
            <el-input v-model="editCateForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitEditCate">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 添加分类弹框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addCateDialogVisible"
        width="30%"
        @close="addCateDialogClosed"
      >
        <el-form
          :model="addCateForm"
          :rules="addCateRules"
          ref="addCateRef"
          label-width="80px"
          label-position="left"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <el-cascader
              @change="addCateChanged"
              clearable
              v-model="selectedValue"
              :props="{ expandTrigger: 'hover',checkStrictly: true , label: 'cat_name', value: 'cat_id'}"
              :options="addCateList"
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitAddCate">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { request } from "@/network/request.js";

export default {
  data() {
    return {
      // 商品分类数据列表
      goodsCateList: [],
      // 商品分类数据 请求参数
      querys: {
        type: [3],
        pagenum: 1,
        pagesize: 6,
      },
      // 商品分类数据总条数
      total: 0,
      // 编辑分类弹出框的显示隐藏
      editCateDialogVisible: false,
      // 编辑弹出框的表单数据绑定
      editCateForm: {
        cat_id: "",
        cat_old_name: "",
        cat_name: "",
      },
      // 编辑弹出框的表单验证规则
      editCateRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      // 添加分类弹出框 的显示隐藏
      addCateDialogVisible: false,
      // 添加弹出框的表单数据绑定
      addCateForm: {
        // 将要添加的分类名称
        cat_name: "",
        // 分类父 id
        cat_pid: 0,
        // 分类层级，默认为 一级分类
        cat_level: 0,
      },
      // 添加弹出框的表单验证规则
      addCateRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      selectedValue: [],
      addCateList: [],
    };
  },
  mounted() {
    this.getGoodsCateList();
  },
  methods: {
    // 获取商品分类数据列表
    async getGoodsCateList() {
      const res = await request({
        url: "categories",
        params: this.querys,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取商品数据失败");
      this.total = res.data.total;
      this.goodsCateList = res.data.result;
      // console.log(this.goodsCateList);
    },
    // 当前页数变化
    handleCurrentChange(val) {
      this.querys.pagenum = val;
      this.getGoodsCateList();
    },
    // 点击显示编辑分类弹出框
    async editCate(row) {
      const res = await request("categories/" + row.cat_id);
      if (res.meta.status !== 200)
        return this.$message.error("获取分类信息失败");
      this.editCateForm.cat_id = res.data.cat_id;
      this.editCateForm.cat_old_name = res.data.cat_name;
      this.editCateDialogVisible = true;
    },
    // 修改分类名称
    submitEditCate() {
      this.$refs.editCateRef.validate(async (valid) => {
        if (valid) {
          const res = await request({
            method: "put",
            url: "categories/" + this.editCateForm.cat_id,
            data: {
              cat_name: this.editCateForm.cat_name,
            },
          });
          if (res.meta.status !== 200)
            return this.$message.error("修改分类名称失败");
          this.$message.success("修改分类名称成功");
          this.editCateDialogVisible = false;
          this.getGoodsCateList();
        } else {
          this.$message.error("请检查是否输入正确");
        }
      });
    },
    // 编辑分类弹出框关闭
    editCateDialogClosed() {
      this.$refs.editCateRef.resetFields();
    },
    // 删除分类
    deleteCate(row) {
      const id = row.cat_id;
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await request({
            method: "delete",
            url: "categories/" + id,
          });
          if (res.meta.status !== 200)
            return this.$message.error("删除分类失败");
          this.$message.success("删除分类成功");
          // flag 作用是当 最后一页数据删除完之后，使其自动跳到上一页
          const flag =
            Math.ceil((this.total - 1) / this.querys.pagesize) <
            this.querys.pagenum;
          if (flag) {
            this.querys.pagenum--;
          }
          this.getGoodsCateList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 点击弹出 添加分类框
    async addCate() {
      const res = await request({
        url: "categories",
        params: { type: [2] },
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取商品数据失败");
      // console.log(res);
      this.addCateList = res.data;
      this.addCateDialogVisible = true;
    },
    // 监听 添加弹出框的关闭，清空表单验证
    addCateDialogClosed() {
      this.$refs.addCateRef.resetFields();
      this.selectedValue = [];
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
    },
    // 当级联选择器里的选择项变化时触发
    addCateChanged() {
      const length = this.selectedValue.length;
      if (length == 0) {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      } else {
        this.addCateForm.cat_pid = this.selectedValue[length - 1];
        this.addCateForm.cat_level = this.selectedValue.length;
      }
    },
    // 提交 添加分类
    submitAddCate() {
      this.$refs.addCateRef.validate(async (valid) => {
        if (valid) {
          const res = await request({
            method: "post",
            url: "categories",
            data: this.addCateForm,
          });
          if (res.meta.status !== 201)
            return this.$message.error("创建分类失败");
          this.$message.success("创建分类成功");
          this.addCateDialogVisible = false;
          this.getGoodsCateList();
        } else {
          this.$message.error("请检查是否输入正确");
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.addCate {
  margin-bottom: 20px;
}
.el-pagination {
  margin-top: 20px;
}
</style>