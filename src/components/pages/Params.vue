<template>
  <div class="params">
    <el-card>
      <!-- 头部提示信息 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false" show-icon></el-alert>
      <!-- 选择分类 -->
      <el-row>
        <el-col :span="2">选择商品分类：</el-col>
        <el-col :span="6">
          <el-cascader
            clearable
            v-model="selectedValue"
            :options="cateList"
            :props="cateProps"
            @change="handleCateChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 参数/属性信息面板 -->
      <el-tabs v-model="activeName" @tab-click="handleAttrClick">
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数/属性按钮 -->
          <el-button
            type="primary"
            size="small"
            class="showAddAttr"
            @click="showAddAttrDialog"
            :disabled="isdisabled"
          >添加参数</el-button>
          <!-- 参数/属性信息 -->
          <el-table :data="attrManyData" border style="width: 100%">
            <el-table-column type="expand" width="60">
              <template v-slot="scope">
                <el-tag
                  closable
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                  @close="handleTagClosed(scope.row,index)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#" width="60"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称" width="780"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="text" icon="el-icon-edit" @click="showEditAttrDialog(scope.row)">修改</el-button>
                <el-button
                  type="text"
                  icon="el-icon-delete"
                  style="color:red"
                  @click="deleteAttr(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加参数/属性按钮 -->
          <el-button
            type="primary"
            size="small"
            class="showAddAttr"
            @click="showAddAttrDialog"
            :disabled="isdisabled"
          >添加属性</el-button>
          <!-- 参数/属性信息 -->
          <el-table :data="attrOnlyData" border style="width: 100%">
            <el-table-column type="expand" width="60">
              <template v-slot="scope">
                <el-tag
                  closable
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="item"
                  @close="handleTagClosed(scope.row,index)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#" width="60"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称" width="780"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="text" icon="el-icon-edit" @click="showEditAttrDialog(scope.row)">修改</el-button>
                <el-button
                  type="text"
                  icon="el-icon-delete"
                  style="color:red"
                  @click="deleteAttr(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数弹出框 -->
    <el-dialog
      :title="'添加'+attrTitle"
      :visible.sync="addAttrDialogVisible"
      width="30%"
      @close="addAttrDialogClosed"
    >
      <el-form
        :model="addAttrForm"
        :rules="addAttrFormRules"
        ref="addAttrFormRef"
        label-width="80px"
      >
        <el-form-item :label="attrTitle" prop="attr_name">
          <el-input v-model="addAttrForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addAttrDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddAttr">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数弹出框 -->
    <el-dialog
      :title="'修改'+attrTitle+'名称'"
      :visible.sync="editAttrDialogVisible"
      width="30%"
      @close="editAttrDialogClosed"
    >
      <el-form
        :model="editAttrForm"
        :rules="editAttrFormRules"
        ref="editAttrFormRef"
        label-width="80px"
      >
        <el-form-item :label="attrTitle" prop="attr_name">
          <el-input v-model="editAttrForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAttrDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditAttr">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { request } from "@/network/request.js";
export default {
  data() {
    return {
      // 分类信息选择器的双向绑定属性
      selectedValue: [],
      // 分类列表
      cateList: [],
      // 级联选择器 props 配置
      cateProps: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
      },
      // 分类id
      id: "",
      isdisabled: true,
      // tab切换栏名字
      activeName: "many",
      // 参数列表数据
      attrManyData: [],
      // 属性列表数据
      attrOnlyData: [],
      // 添加参数弹出框的显示隐藏
      addAttrDialogVisible: false,
      // 添加参数弹出框的表单绑定数据
      addAttrForm: {
        attr_name: "",
      },
      // 添加参数弹出框的表单验证规则
      addAttrFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
      // tag标签的显示隐藏
      inputVisible: false,
      // tag标签的表单数据绑定
      inputValue: "",
      // 修改参数弹出框的显示隐藏
      editAttrDialogVisible: false,
      // 修改弹出框的数据绑定对象
      editAttrForm: {
        attr_name: "",
        attr_id: "",
      },
      // 修改参数弹出框的表单验证规则
      editAttrFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.getCateList();
  },
  computed: {
    // 动态计算标题
    attrTitle() {
      if (this.activeName == "many") {
        return "动态参数";
      } else if (this.activeName == "only") {
        return "静态属性";
      }
    },
  },
  methods: {
    // 获取分类列表
    async getCateList() {
      const res = await request("categories");
      if (res.meta.status !== 200)
        return this.$message.error("获取分类数据列表失败");
      this.cateList = res.data;
    },
    // 获取参数信息
    async getAttrInfo() {
      const res = await request({
        url: "categories/" + this.id + "/attributes",
        params: { sel: this.activeName },
      });
      if (res.meta.status !== 200) return this.$message.error("获取数据失败");

      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals != "" ? item.attr_vals.split(",") : [];
        item.inputVisible = false;
        item.inputValue = "";
      });

      if (this.activeName === "many") {
        this.attrManyData = res.data;
      } else if (this.activeName === "only") {
        this.attrOnlyData = res.data;
      }
    },
    // 当级联选择器 选择项发生变化时
    async handleCateChange() {
      // 如果选中的不是三级分类
      if (this.selectedValue.length !== 3) {
        this.selectedValue = [];
      }
      // 如果没有选择分类
      if (this.selectedValue.length == 0) {
        this.attrManyData = [];
        this.attrOnlyData = [];
        this.isdisabled = true;
        return;
      } else {
        this.isdisabled = false;
        this.id = this.selectedValue[this.selectedValue.length - 1];
      }
      this.getAttrInfo();
    },
    // tab标签页切换时触发
    handleAttrClick(tab, event) {
      if (this.selectedValue.length == 0) {
        this.attrManyData = [];
        this.attrOnlyData = [];
        return;
      }
      this.getAttrInfo();
    },
    // 点击展示 添加参数框
    showAddAttrDialog() {
      this.addAttrDialogVisible = true;
    },
    // 监听 添加参数框的关闭
    addAttrDialogClosed() {
      this.$refs.addAttrFormRef.resetFields();
    },
    // 添加参数
    submitAddAttr() {
      this.$refs.addAttrFormRef.validate(async (valid) => {
        if (valid) {
          const res = await request({
            method: "post",
            url: "categories/" + this.id + "/attributes",
            data: {
              attr_name: this.addAttrForm.attr_name,
              attr_sel: this.activeName,
            },
          });
          if (res.meta.status !== 201)
            return this.$message.error("创建参数失败");
          this.getAttrInfo();
          this.addAttrDialogVisible = false;
        } else {
          this.$message.error("请输入正确的参数");
        }
      });
    },
    // 删除参数
    deleteAttr(row) {
      this.$confirm("此操作将永久删除该参数, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await request({
            method: "delete",
            url: "categories/" + this.id + "/attributes/" + row.attr_id,
          });
          if (res.meta.status !== 200) return this.$message.error("删除失败");
          this.getAttrInfo();
          this.$message.success("删除成功");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 点击 弹出修改参数框
    async showEditAttrDialog(row) {
      const res = await request({
        url: "categories/" + this.id + "/attributes/" + row.attr_id,
        attr_sel: this.activeName,
      });
      if (res.meta.status !== 200) return this.$message.error("获取数据失败");
      this.editAttrForm = res.data;
      this.editAttrDialogVisible = true;
    },
    // 监听 修改参数框的关闭
    editAttrDialogClosed() {
      this.$refs.editAttrFormRef.resetFields();
    },
    // 修改参数
    submitEditAttr() {
      this.$refs.editAttrFormRef.validate(async (valid) => {
        if (valid) {
          const res = await request({
            method: "put",
            url:
              "categories/" +
              this.id +
              "/attributes/" +
              this.editAttrForm.attr_id,
            data: {
              attr_name: this.editAttrForm.attr_name,
              attr_sel: this.activeName,
              attr_vals: this.editAttrForm.attr_vals,
            },
          });
          if (res.meta.status !== 200)
            return this.$message.error("修改参数失败");
          this.$message.success("修改成功");
          this.getAttrInfo();
          this.editAttrDialogVisible = false;
        } else {
          this.$message.error("请输入正确的参数");
        }
      });
    },
    // 标签关闭
    async handleTagClosed(row, index) {
      // 删除点击的标签
      row.attr_vals.splice(index, 1);
      const res = await request({
        method: "put",
        url: "categories/" + this.id + "/attributes/" + row.attr_id,
        data: {
          attr_name: row.attr_name,
          attr_sel: this.activeName,
          attr_vals: row.attr_vals.join(","),
        },
      });
      if (res.meta.status !== 200) return this.$message.error("删除失败");
    },
    // 点击添加标签按钮
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 添加新的标签
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputVisible = false;
        row.inputValue = "";
        return;
      }
      row.attr_vals.push(row.inputValue.trim());
      const res = await request({
        method: "put",
        url: "categories/" + this.id + "/attributes/" + row.attr_id,
        data: {
          attr_name: row.attr_name,
          attr_sel: this.activeName,
          attr_vals: row.attr_vals.join(","),
        },
      });
      if (res.meta.status !== 200) return this.$message.error("添加失败");
      row.inputVisible = false;
      row.inputValue = "";
    },
  },
};
</script>

<style lang="less" scoped>
.el-row {
  margin-top: 20px;
  display: flex;
  align-items: center;
}
.el-tabs {
  margin-top: 20px;
}
.showAddAttr {
  margin-bottom: 16px;
}
.el-tag {
  margin: 10px;
}
.button-new-tag {
  margin-left: 10px;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
}
</style>