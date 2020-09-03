<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div class="collapse-btn">
      <i class="el-icon-s-unfold" v-if="collapse" @click="collapseChage"></i>
      <i class="el-icon-s-fold" v-else @click="collapseChage"></i>
    </div>
    <!-- 文字logo -->
    <div class="logo">后台管理系统</div>
    <!-- 头像 下拉框 -->
    <el-dropdown @command="handleCommand" class="dropdown">
      <img src="../assets/img/xianrenzhang.svg" class="avatar" />
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="home">系统首页</el-dropdown-item>
        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import vm from "@/components/vm.js";

export default {
  name: "Header",
  data() {
    return {
      collapse: false,
    };
  },
  methods: {
    // 登出事件
    logout() {
      // 点击退出登录后，清除掉 token信息
      // window.sessionStorage.removeItem("token");
      window.sessionStorage.clear();
      // 强制跳转到 登录页面
      this.$router.push("/login");
    },
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if (command === "logout") {
        this[command]();
      }
    },
    // 折叠 侧边框
    collapseChage() {
      this.collapse = !this.collapse;
      vm.$emit("collapse", this.collapse);
    },
  },
};
</script>

<style lang="less" scoped>
.header {
  padding: 0 20px;
  box-sizing: border-box;
  background-color: #434547;
  height: 60px;
  color: #ffd04b;
  line-height: 60px;
  width: 100%;
  .collapse-btn {
    display: inline-block;
    i {
      cursor: pointer;
      font-size: 20px;
    }
  }
  .logo {
    display: inline-block;
    margin-left: 24px;
    font-size: 24px;
    font-weight: 600;
  }
  .dropdown {
    float: right;
    height: 100%;
    .avatar {
      display: inline-block;
      margin-top: 7px;
      cursor: pointer;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 20px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      box-shadow: 0 0 1px 2px rgba(0, 0, 0, 0.1);
    }
  }
}
</style>