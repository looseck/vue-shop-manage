<template>
  <div class="container">
    <!-- 头部 -->
    <v-header></v-header>
    <!-- 侧边栏 -->
    <v-aside></v-aside>
    <!-- 主体内容区 -->
    <div class="main-box" :class="{'content-collapse':collapse}">
      <!-- 面包屑导航 -->
      <div class="breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item v-for="(item,index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 主体内容区 -->
      <div class="main">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import vHeader from "@/components/Header.vue";
import vAside from "@/components/AsideBar.vue";
import vm from "@/components/vm.js";

export default {
  components: {
    vAside,
    vHeader,
  },
  data() {
    return {
      collapse: false,
    };
  },
  computed: {},
  mounted() {
    // 监听当前实例上的自定义事件
    vm.$on("collapse-content", (msg) => {
      this.collapse = msg;
    });
  },
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  position: relative;
}
.main-box {
  position: absolute;
  display: block;
  box-sizing: border-box;
  left: 200px;
  right: 0;
  top: 60px;
  bottom: 0;
  padding: 10px 20px;
  background-color: #eee;
  transition: left 0.3s ease-in-out;
  overflow-y: scroll;
}
.main {
  box-sizing: border-box;
}
.content-collapse {
  left: 65px;
}
.breadcrumb {
  margin: 10px 0;
}
</style>