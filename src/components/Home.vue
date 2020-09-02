<template>
  <el-button type="info" @click="logout">退出登录</el-button>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    logout() {
      // 点击退出登录后，清除掉 token信息
      // window.sessionStorage.removeItem("token");
      window.sessionStorage.clear();
      // 强制跳转到 登录页面
      this.$router.push("/login");
    },
  },
};
</script>

<style>
</style>