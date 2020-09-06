<template>
  <div class="roles">
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-button type="primary" class="addRole" @click="addRoleVisible = true">添加角色</el-button>
      <!-- 角色列表 -->
      <el-table :data="rolesList" border style="width: 100%">
        <!-- 展开列 -->
        <el-table-column type="expand" width="60">
          <!-- 作用域插槽 -->
          <template v-slot="scope">
            <!-- 第一次循环，渲染第一级权限 -->
            <el-row
              class="bdbottom vcenter"
              :class="{bdtop:index1 == 0}"
              v-for="(item,index1) in scope.row.children"
              :key="item.id"
            >
              <!-- 一级权限 -->
              <el-col :span="6">
                <el-tag
                  class="tag"
                  closable
                  @close="deleteRight(scope.row,item.id)"
                >{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="18">
                <!-- 第二次循环，渲染二级权限 -->
                <el-row
                  class="bdtop vcenter"
                  :class="{bdnone: index2 == 0}"
                  v-for="(subItem,index2) in item.children"
                  :key="subItem.id"
                >
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      class="tag"
                      closable
                      type="success"
                      @close="deleteRight(scope.row,subItem.id)"
                    >{{subItem.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染三级权限 -->
                  <el-col :span="18">
                    <!-- 第三次循环，渲染三级权限 -->
                    <!-- 三级权限 -->
                    <el-tag
                      @close="deleteRight(scope.row,thereItem.id)"
                      closable
                      type="warning"
                      v-for="thereItem in subItem.children"
                      :key="thereItem.id"
                      class="tag"
                    >{{thereItem.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column label="#" type="index" width="60"></el-table-column>
        <el-table-column label="角色名称" prop="roleName" width="420"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc" width="420"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="text" icon="el-icon-edit" @click="editRole(scope.row.id)">编辑</el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              style="color: red"
              @click="deleteRole(scope.row.id)"
            >删除</el-button>
            <el-button
              type="text"
              icon="el-icon-setting"
              style="color: gray"
              @click="assignRight(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色弹出框 -->
    <el-dialog title="添加角色" :visible.sync="addRoleVisible" width="30%" @close="cancelAdd">
      <el-form :model="addRoleForm" label-width="80px" :rules="addRoleRules" ref="addRoleRef">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色弹出框 -->
    <el-dialog title="编辑角色" :visible.sync="EditRoleVisible" width="30%" @close="cancelEdit">
      <el-form :model="EditRoleForm" label-width="80px" :rules="addRoleRules" ref="editRoleRef">
        <el-form-item label="角色ID">
          <el-input v-model="EditRoleForm.roleId" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="EditRoleForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="EditRoleForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEdit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限弹出框 -->
    <el-dialog title="分配权限" :visible.sync="rightVisible" width="30%" @close="setRightDIalogClosed">
      <el-tree
        :data="rightList"
        :props="props"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="keysArr"
        ref="treeRightRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRight">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { request } from "@/network/request.js";
export default {
  data() {
    return {
      // 角色列表数据
      rolesList: [],
      // 控制添加角色弹出框的显示隐藏
      addRoleVisible: false,
      // 添加角色数据表单
      addRoleForm: {
        roleName: "",
        roleDesc: "",
      },
      // 添加角色的表单验证规则
      addRoleRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
      },
      EditRoleVisible: false,
      EditRoleForm: {
        roleId: "",
        roleName: "",
        roleDesc: "",
      },
      // 分配权限弹出框显示隐藏
      rightVisible: false,
      // 权限列表数据
      rightList: [],
      props: { children: "children", label: "authName" },
      // 默认展开的数组id数据
      keysArr: [],
      // 角色ID
      roleId: "",
    };
  },
  mounted() {
    this.getRolesList();
  },
  methods: {
    // 取到角色列表数据
    async getRolesList() {
      const res = await request("roles");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      // console.log(res);
      this.rolesList = res.data;
    },
    // 添加角色
    addRole() {
      this.$refs.addRoleRef.validate(async (valid) => {
        if (valid) {
          const res = await request({
            method: "post",
            url: "roles",
            data: this.addRoleForm,
          });
          // console.log(res);
          if (res.meta.status !== 201)
            return this.$message.error("添加角色失败，请重试！");
          this.$message.success(res.meta.msg);
          this.addRoleVisible = false;
          // 重新刷新列表
          this.getRolesList();
        } else {
          this.$message.error("请检查是否输入正确");
          return false;
        }
      });
    },
    // 取消添加角色，清除表单验证
    cancelAdd() {
      this.addRoleVisible = false;
      this.$refs.addRoleRef.resetFields();
    },
    // 点击编辑角色按钮，根据 id 获取角色数据
    async editRole(id) {
      this.EditRoleVisible = true;
      const res = await request("roles/" + id);
      if (res.meta.status !== 200)
        return this.$message.error("获取角色信息失败！");
      this.EditRoleForm = res.data;
    },
    // 提交编辑角色
    submitEdit() {
      this.$refs.editRoleRef.validate(async (valid) => {
        if (valid) {
          const res = await request({
            method: "put",
            url: "roles/" + this.EditRoleForm.roleId,
            data: this.EditRoleForm,
          });
          if (res.meta.status !== 200)
            return this.$message.error("编辑角色失败！");
          this.$message.success("修改成功！");
          this.EditRoleVisible = false;
          // 重新刷新列表
          this.getRolesList();
        } else {
          this.$message.error("请检查输入是否正确！");
          return false;
        }
      });
    },
    // 取消编辑角色，清除表单验证
    cancelEdit() {
      this.EditRoleVisible = false;
      this.$refs.editRoleRef.resetFields();
    },
    // 删除角色
    deleteRole(id) {
      this.$confirm("请确认是否删除该角色？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await request({
            method: "delete",
            url: "roles/" + id,
          });
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
          this.$message.success(res.meta.msg);
          // 重新刷新列表
          this.getRolesList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 删除角色指定权限
    deleteRight(role, rightId) {
      this.$confirm("请确认是否删除该权限？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await request({
            method: "delete",
            url: `roles/${role.id}/rights/${rightId}`,
          });
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
          this.$message.success(res.meta.msg);
          // 重新赋值，刷新权限
          role.children = res.data;
          // this.getRolesList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 点击 弹出分配权限框 并获取权限列表数据
    async assignRight(row) {
      this.roleId = row.id;
      const res = await request("rights/tree");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.rightList = res.data;
      this.rightVisible = true;
      // 递归获取三级节点的 id
      this.getLeafsKeys(row, this.keysArr);
    },
    // 递归 获取到三级节点的 id 数据
    getLeafsKeys(node, arr) {
      // 如果 node 中没有children 属性，说明已经是 三级节点
      if (!node.children) {
        return arr.push(node.id);
      }
      // 如果有 chidren 属性，继续循环
      node.children.forEach((item) => {
        this.getLeafsKeys(item, arr);
      });
    },
    // 分配权限对话框关闭
    setRightDIalogClosed() {
      this.rightVisible = false;
      // 关闭时清空 默认勾选数组
      this.keysArr = [];
    },
    async allotRight() {
      let arr = [];
      // 获取所有 半选中的节点
      arr = this.$refs.treeRightRef.getHalfCheckedKeys();
      // 半选中节点与全选中节点的合并
      arr.push(...this.$refs.treeRightRef.getCheckedKeys());
      const idStr = arr.join(",");
      const res = await request({
        method: "post",
        url: "roles/" + this.roleId + "/rights",
        data: {
          rids: idStr,
        },
      });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
      this.rightVisible = false;
      this.getRolesList();
    },
  },
};
</script>

<style lang="less" scoped>
.el-card {
  margin: 10px 0;
  .addRole {
    margin-bottom: 10px;
  }
}
.tag {
  margin: 10px 12px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.bdnone {
  border: none;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>