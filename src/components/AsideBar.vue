<template>
  <div class="asidebar">
    <!-- 侧边栏菜单 -->
    <el-menu
      :default-active="whichRoutes"
      class="el-menu-aside"
      :collapse="collapse"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      unique-opened
      router
    >
      <el-menu-item index="welcome">
        <i class="el-icon-s-home"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <!-- for 循环生成 一级菜单 -->
      <template v-for="item in items">
        <!-- 一级菜单 -->
        <el-submenu :index="item.id +''" :key="item.id">
          <template slot="title">
            <i :class="icons[item.id]"></i>
            <span>{{ item.authName }}</span>
          </template>
          <!-- for 循环生成 二级菜单 -->
          <template v-for="subItem in item.children">
            <!-- 二级菜单 -->
            <el-menu-item :index="subItem.path" :key="subItem.id">
              <i class="el-icon-menu"></i>
              <span>{{ subItem.authName }}</span>
            </el-menu-item>
          </template>
        </el-submenu>
      </template>
      <el-menu-item index="test">
        <i class="el-icon-loading"></i>
        <span slot="title">Test</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import vm from "@/components/vm.js";
import { request } from "@/network/request.js";

export default {
  name: "AsideBar",
  data() {
    return {
      // 侧边栏折叠
      collapse: false,
      // 左侧菜单数据
      items: [],
      // 图标数据
      icons: {
        125: "el-icon-s-custom",
        103: "el-icon-view",
        101: "el-icon-goods",
        102: "el-icon-document",
        145: "el-icon-pie-chart",
      },
    };
  },
  computed: {
    whichRoutes() {
      // 刷新后 打开刷新前打开的 sub-menu
      return this.$route.path.replace("/", "");
    },
  },
  async mounted() {
    // 通过 Event Vm 进行组件间通信，来折叠侧边栏
    vm.$on("collapse", (msg) => {
      this.collapse = msg;
      vm.$emit("collapse-content", msg);
    });
    // 获取 左侧菜单数据
    const res = await request("menus");
    if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
    this.items = res.data;
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.asidebar {
  left: 0;
  position: absolute;
  top: 60px;
  bottom: 0;
}
.el-menu-aside:not(.el-menu--collapse) {
  width: 200px;
}
.asidebar > ul {
  height: 100%;
}
</style>