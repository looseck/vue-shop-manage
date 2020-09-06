<template>
  <div class="rights">
    <!-- 卡片视图 -->
    <el-card>
      <!-- 切换按钮 -->
      <el-switch v-model="value" active-text="列表显示" inactive-text="树状显示" @change="getRightsTree"></el-switch>
      <!-- 权限列表 -->
      <!-- 列表显示 -->
      <template v-if="value">
        <el-table
          :data="rightsList"
          border
          style="width: 100%"
          :header-cell-style="{'color':'#383838'}"
        >
          <el-table-column type="index" label="#" width="80"></el-table-column>
          <el-table-column prop="authName" label="权限名称" width="280"></el-table-column>
          <el-table-column prop="path" label="路径" width="280"></el-table-column>
          <el-table-column prop="level" label="权限等级">
            <template v-slot="scope">
              <el-tag v-if="scope.row.level == 0">等级一</el-tag>
              <el-tag v-else-if="scope.row.level == 1" type="warning">等级二</el-tag>
              <el-tag v-else type="danger">等级三</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 树状显示 -->
      <template v-else>
        <el-tree :data="rightsTree" :props="defaultProps" default-expand-all></el-tree>
      </template>
    </el-card>
  </div>
</template>

<script>
import { request } from "@/network/request.js";
export default {
  name: "Rights",
  data() {
    return {
      // 权限列表
      rightsList: [],
      // 权限树状
      rightsTree: [],
      // 控制切换
      value: true,
      // 指定树状显示的节点
      defaultProps: {
        children: "children",
        label: "authName",
      },
    };
  },
  mounted() {
    this.getRightsList();
  },
  methods: {
    // 获取 权限列表
    async getRightsList() {
      const res = await request("rights/list");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      // this.$message.success(res.meta.msg);
      this.rightsList = res.data;
    },
    // 获取 权限列表 树状
    async getRightsTree() {
      const res = await request("rights/tree");
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      // this.$message.success(res.meta.msg);
      this.rightsTree = res.data;
    },
  },
};
</script>

<style lang="less" scoped>
.el-card {
  margin: 10px 0;
  .el-switch {
    margin-bottom: 10px;
  }
}
</style>