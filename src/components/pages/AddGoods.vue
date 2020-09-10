<template>
  <div class="addGoods">
    <el-card>
      <!-- 头部提示信息 -->
      <el-alert title="添加商品信息" type="info" show-icon center :closable="false"></el-alert>
      <!-- 进度条 -->
      <el-steps :active="activeIndex" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="添加成功"></el-step>
      </el-steps>
      <!-- tab栏 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-position="top">
        <el-tabs
          v-model="activeName"
          tab-position="left"
          @tab-click="tabClick"
          :before-leave="tabSwitch"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="selectedValue"
                :options="cateList"
                :props="{ expandTrigger: 'hover', label:'cat_name' , value:'cat_id'}"
                @change="handleSelectedChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="(item,index) in manyTableData"
              :key="item.attr_id"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="manyTableDataUpdate[index].attr_vals">
                <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 上传组件 -->
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <el-alert title="Vue-Quill-Editor：基于Quill、适用于Vue2的富文本编辑器。" type="info"></el-alert>
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce" />
            <el-button type="primary" size="small" @click="addGoods">提交</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 预览图片对话框 -->
    <el-dialog
      title="预览图片"
      :visible.sync="previewPicDialogVisible"
      width="50%"
      @close="previewPicDialogClosed"
    >
      <el-image :src="previewPicUrl" fit="cover"></el-image>
    </el-dialog>
  </div>
</template>

<script>
import { request } from "@/network/request.js";

export default {
  data() {
    return {
      // 商品分类数据列表
      cateList: [],
      // tab栏显示第几栏
      activeName: "0",
      selectedValue: [],
      // 添加表单的数据绑定对象
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: "",
        pics: [],
        goods_introduce: "",
        attrs: [],
      },
      // 添加表单的验证规则对象
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
      // 商品参数列表数据
      manyTableData: [],
      manyTableDataUpdate: [],
      // 商品属性列表数据
      onlyTableData: [],
      // 图片上传请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      // 预览图片对话框显示隐藏
      previewPicDialogVisible: false,
      // 预览图片的url
      previewPicUrl: "",
    };
  },
  computed: {
    // tab 栏与步骤条进行绑定
    activeIndex() {
      return Number(this.activeName);
    },
    // 获取商品的三级分类id
    cateId() {
      if (this.selectedValue.length === 3) {
        return this.selectedValue[2];
      }
      return null;
    },
  },
  mounted() {
    this.getCateList();
  },
  methods: {
    // 获取 商品分类数据列表
    async getCateList() {
      const res = await request("categories");
      if (res.meta.status !== 200)
        return this.$message.error("获取分类数据失败");
      this.cateList = res.data;
    },
    // 当级联选择器选择项发生变化时
    handleSelectedChange() {
      if (this.selectedValue.length !== 3) {
        return (this.selectedValue = []);
      }
      this.addForm.goods_cat = this.selectedValue.join(",");
    },
    // 切换tab 栏前的钩子函数
    tabSwitch(newName, oldName) {
      if (this.selectedValue.length === 0 && oldName === "0") {
        this.$message.error("请选择商品分类");
        return false;
      }
    },
    // 切换tab 栏
    async tabClick() {
      //  访问的是商品参数栏，获取商品动态参数
      if (this.activeName === "1") {
        const res = await request({
          url: `categories/${this.cateId}/attributes`,
          params: { sel: "many" },
        });
        if (res.meta.status !== 200)
          return this.$message.error("获取商品参数失败");
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals === "" ? [] : item.attr_vals.split(",");
        });
        this.manyTableData = res.data;
        if (this.manyTableDataUpdate.length === 0) {
          this.manyTableDataUpdate = _.cloneDeep(this.manyTableData);
        }
      }
      //  访问的是商品属性栏，获取商品静态属性
      else if (this.activeName === "2") {
        const res = await request({
          url: `categories/${this.cateId}/attributes`,
          params: { sel: "only" },
        });
        if (res.meta.status !== 200)
          return this.$message.error("获取商品属性失败");
        this.onlyTableData = res.data;
      }
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePreview(file) {
      this.previewPicUrl = file.response.data.url;
      this.previewPicDialogVisible = true;
    },
    // 预览图片对话框关闭
    previewPicDialogClosed() {},
    // 文件列表移除文件时的钩子
    handleRemove(file, fileList) {
      this.addForm.pics = this.addForm.pics.filter((item) => {
        return item.pic != file.response.data.tmp_path;
      });
    },
    // 文件上传成功时的钩子
    handleSuccess(response) {
      // 把图片临时地址保存到 addForm 中
      const pic = {
        pic: response.data.tmp_path,
      };
      this.addForm.pics.push(pic);
    },
    // 添加商品
    addGoods() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (valid) {
          // 处理动态参数
          this.manyTableDataUpdate.forEach((item) => {
            const temp = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(","),
            };
            this.addForm.attrs.push(temp);
          });
          // 处理静态属性
          this.onlyTableData.forEach((item) => {
            const temp = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals,
            };
            this.addForm.attrs.push(temp);
          });
          const res = await request({
            method: "post",
            url: "goods",
            data: this.addForm,
          });
          if (res.meta.status !== 201)
            return this.$message.error("添加商品失败");
          this.$message.success("添加商品成功");
          this.$router.push("/goods");
        } else {
          return this.$message.error("请填写必要的表单项");
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-alert {
  margin-bottom: 20px;
}
.el-tabs {
  margin: 20px 0;
}
.el-checkbox {
  margin: 0 5px;
}
.el-button {
  margin-top: 20px;
}
</style>