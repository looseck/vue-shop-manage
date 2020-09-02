<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 文字标题 -->
      <div class="box_title">
        <h3>后台管理系统</h3>
      </div>
      <!-- 表单区域 -->
      <el-form
        ref="loginFormRef"
        label-width="0px"
        class="box_body"
        :model="loginForm"
        :rules="rules"
        status-icon
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            placeholder="username"
            clearable
            prefix-icon="el-icon-user"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            placeholder="password"
            show-password
            prefix-icon="el-icon-lock"
            v-model="loginForm.password"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item>
          <el-button type="primary" style="width:100%;" @click="login('loginFormRef')">登录</el-button>
        </el-form-item>
        <!-- tips -->
        <div class="tips">test</div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { request } from "@/network/request.js";
export default {
  name: "Login",
  data() {
    return {
      // 表单登录数据对象
      loginForm: {
        username: "admin",
        password: "123456",
      },
      // 表单验证规则对象
      rules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 12,
            message: "长度在 3 到 12 个字符",
            trigger: "blur",
          },
        ],
        // 验证密码是否合法
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  methods: {
    login(formName) {
      // 对整个表单进行校验的方法  validate
      this.$refs[formName].validate(async (valid, obj) => {
        if (valid) {
          const res = await request({
            method: "post",
            url: "login",
            data: this.loginForm,
          });
          console.log(res);
          if (res.meta.status === 200) {
            this.$message.success(res.meta.msg);
            // 将登录成功之后的 token 保存到浏览器的 sessionStorage 中
            window.sessionStorage.setItem("token", res.data.token);
            // 登录成功，跳转到其他页面
            this.$router.push("/home");
          } else {
            this.$message.error(res.meta.msg);
          }
        } else {
          this.$message.error("请输入正确的账号和或密码");
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: #bbe6d6;
  height: 100%;
  overflow: hidden;
  .login_box {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 300px;
    background-color: rgba(255, 255, 255, 0.24);
    border-radius: 3px;
    .box_title {
      height: 50px;
      width: 100%;
      line-height: 50px;
      text-align: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.64);
      color: #383838;
    }
    .box_body {
      margin-top: 32px;
      padding: 0 24px;
    }
  }
}
</style>