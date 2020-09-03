<template>
  <div class="users">
    <div>
      <!-- 搜索与添加区域 -->
      <div class="search">
        <el-input placeholder="请输入" v-model="query" clearable size="medium" @input="getUserList"></el-input>
        <el-button icon="el-icon-search" type="primary" size="medium" @click="getUserList"></el-button>
        <el-button type="primary" size="medium" @click="addVisible=true">添加用户</el-button>
      </div>
    </div>

    <!-- 用户列表 -->
    <el-table :data="usersData" style="width: 100%" border>
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="username" label="姓名" width="200"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="200"></el-table-column>
      <el-table-column prop="role_name" label="角色" width="200"></el-table-column>
      <el-table-column prop="create_time" label="注册时间" width="200"></el-table-column>
      <!-- 作用域插槽 更改用户状态-->
      <el-table-column label="状态" width="200" align="center">
        <template v-slot="state">
          <el-switch
            v-model="state.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="handleSwitchChange(state.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template v-slot="scope">
          <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope)">删除</el-button>
          <el-button type="text" icon="el-icon-setting" class="gray">分配</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页操作 -->
    <div class="pagination-box">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>

    <!-- 添加用户弹出框 -->
    <el-dialog title="添加用户" :visible.sync="addVisible" width="40%" @close="cancelAdd">
      <el-form :model="addForm" :rules="rules" label-width="80px" ref="addForm">
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="addForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input v-model="addForm.password" autocomplete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model.number="addForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" :visible.sync="dialogFormVisible" width="40%" @close="cancelEdit">
      <el-form :model="editForm" label-width="60px" :rules="rules" ref="editFormRef">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model.number="editForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEdit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
  </div>
</template>

<script>
import { request } from "@/network/request.js";

export default {
  name: "Users",
  data() {
    // 自定义 手机号表单验证
    let validateMobile = (rule, value, callback) => {
      if (!value) return callback();
      if (!Number.isInteger(value)) {
        callback(new Error("请输入正确的手机号码"));
      } else {
        if (value.toString().length < 6 || value.toString().length > 11) {
          callback(new Error("请输入正确的长度"));
        } else {
          callback();
        }
      }
    };
    return {
      // 搜索绑定
      query: "",
      // 默认当前页 为 第一页
      pagenum: 1,
      // 默认 每页显示 两条用户数据
      pagesize: 2,
      total: 1,
      // 用户列表数据
      usersData: [],
      // 添加用户弹出框显示隐藏
      addVisible: false,
      // 添加用户弹出框的表单数据
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      //用户的 id
      Id: "",
      // 编辑弹出框显示隐藏
      dialogFormVisible: false,
      // 编辑弹出框的表单数据
      editForm: {
        email: "",
        mobile: "",
        username: "",
      },
      // 表单验证规则
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 12,
            message: "长度在 3 到 12 个字符",
            trigger: "blur",
          },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: "blur",
          },
        ],
        mobile: [{ validator: validateMobile, trigger: "blur" }],
      },
    };
  },
  mounted() {
    // 获取 用户列表数据
    this.getUserList();
  },
  methods: {
    // 获取 用户列表数据
    async getUserList() {
      const res = await request({
        url: "users",
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize,
        },
      });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      // 获取总的用户列表 条数
      this.total = res.data.total;
      this.usersData = res.data.users;
      // console.log(res.data.users);
    },
    // 当前页变化
    handleCurrentChange(val) {
      // console.log(val);
      this.pagenum = val;
      this.getUserList();
    },
    // 每页显示数据条数变化
    handleSizeChange(val) {
      // console.log(val);
      this.pagesize = val;
      this.getUserList();
    },
    // 更改用户状态
    // 通过 作用域插槽获取到每行的内容
    async handleSwitchChange(row) {
      this.Id = row.id;
      const type = row.mg_state;
      const res = await request({
        method: "put",
        url: "users/" + this.Id + "/state/" + type,
      });
      if (res.meta.status !== 200) {
        row.mg_state = !row.mg_state;
        return this.$message.error("修改失败");
      }
      this.$message.success(res.meta.msg);
      // console.log(res);
    },
    // 展示编辑用户信息的弹出框
    handleEdit(scope) {
      // console.log(scope);
      this.dialogFormVisible = true;
      this.Id = scope.row.id;
      this.editForm.username = scope.row.username;
      this.editForm.email = scope.row.email;
      this.editForm.mobile = Number(scope.row.mobile);
    },
    // 修改用户信息
    async submitEdit() {
      this.$refs["editFormRef"].validate(async (valid) => {
        if (valid) {
          const res = await request({
            method: "put",
            url: "users/" + this.Id,
            data: this.editForm,
          });
          if (res.meta.status !== 200) return this.$message.error("修改失败");
          this.$message.success(res.meta.msg);
          this.dialogFormVisible = false;
          this.getUserList();
        } else {
          this.$message.error("请检查是否输入正确");
          return false;
        }
      });
    },
    // 删除操作
    handleDelete(scope) {
      this.$confirm("确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const Id = scope.row.id;
          const res = await request({
            method: "delete",
            url: "users/" + Id,
          });
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
          this.$message.success(res.meta.msg);
          // flag 作用是当 最后一页数据删除完之后，使其自动跳到上一页
          const flag =
            Math.ceil((this.total - 1) / this.pagesize) < this.pagenum;
          if (flag) {
            this.pagenum--;
          }
          this.getUserList();
        })
        .catch(() => {
          this.$message.info("取消删除了");
        });
    },
    // 添加用户
    addUser() {
      this.$refs["addForm"].validate(async (valid) => {
        if (valid) {
          const res = await request({
            method: "post",
            url: "users",
            data: this.addForm,
          });
          if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
          this.$message.success(res.meta.msg);
          this.addVisible = false;
          this.getUserList();
        } else {
          this.$message.error("请检查是否输入正确");
          return false;
        }
      });
    },
    // 监听添加用户弹框的关闭事件，来重置表单
    cancelAdd() {
      this.addVisible = false;
      this.$refs["addForm"].resetFields();
    },
    // 监听修改用户弹框的关闭事件，来重置表单
    cancelEdit() {
      this.addVisible = false;
      this.$refs["editFormRef"].resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
.users {
  margin: 10px 0;
  border-radius: 3px;
  padding: 20px;
  background-color: #fff;
}
.pagination-box {
  margin-top: 20px;
}
.search {
  display: flex;
  width: 600px;
  margin-bottom: 20px;
  .el-button {
    margin: 0 10px;
  }
}
.red {
  color: #ff0000;
}
.gray {
  color: gray;
}
</style>