<template>
  <div class="orders">
    <!-- 卡片视图 -->
    <el-card>
      <!-- 头部搜索框 -->
      <el-input
        class="input"
        placeholder="请输入内容"
        v-model="querys.query"
        clearable
        @input="searchOrders"
      >
        <el-button slot="append" icon="el-icon-search" @click="searchOrders"></el-button>
      </el-input>

      <!-- 订单数据表格 -->
      <el-table :data="orderList" border style="width: 100%">
        <el-table-column type="index" label="#" width="80"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="480"></el-table-column>
        <el-table-column prop="order_price" label="订单价格（元）" width="120"></el-table-column>
        <el-table-column label="是否付款" width="120" align="center">
          <template v-slot="scope">
            <el-tag type="danger" v-if="scope.row.pay_status == 0">未付款</el-tag>
            <el-tag type="success" v-else-if="scope.row.pay_status == 1">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="120" align="center"></el-table-column>
        <el-table-column label="下单时间" width="240">
          <template v-slot="scope">
            <span>{{scope.row.update_time | dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="text" icon="el-icon-search" @click="editFormVisible = true">订单地址</el-button>
            <el-button type="text" icon="el-icon-location-outline" @click="showKuaidiBox">物流信息</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querys.pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="querys.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 订单地址对话框 -->
    <el-dialog title="修改订单地址" :visible.sync="editFormVisible" width="50%" @close="handleClose">
      <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editFormRef">
        <el-form-item label="省市区/县：" prop="address1">
          <el-cascader
            v-model="editForm.address1"
            :options="citydata"
            :props="{ expandTrigger: 'hover' }"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址：" prop="address2">
          <el-input v-model="editForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 物流进度对话框 -->
    <el-dialog title="物流进度" :visible.sync="kuaidiVisible" width="50%">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import { request } from "@/network/request.js";
import citydata from "@/components/citydata.js";
export default {
  data() {
    return {
      //订单列表请求参数
      querys: {
        query: "",
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 10,
      },
      // 订单列表数据
      orderList: [],
      // 总订单数
      total: 0,
      // 订单地址对话框显示隐藏
      editFormVisible: false,
      // 订单地址对话框 表单数据绑定对象
      editForm: {
        address1: [],
        address2: "",
      },
      citydata,
      // 订单地址对话框 表单数据验证对象
      editFormRules: {
        address1: [
          { required: true, message: "请选择省市区县", trigger: "blur" },
        ],
        address2: [
          { required: true, message: "请填写详细地址", trigger: "blur" },
        ],
      },
      // 物流进度对话框显示隐藏
      kuaidiVisible: false,
      // 物流进度数据
      progressInfo: [],
    };
  },
  mounted() {
    this.getOrderList();
  },
  methods: {
    // 获取订单列表数据
    async getOrderList() {
      const res = await request({
        url: "orders",
        params: this.querys,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取订单列表失败");
      this.total = res.data.total;
      this.orderList = res.data.goods;
    },
    // pageSize 改变时会触发
    handleSizeChange(val) {
      this.querys.pagesize = val;
      this.getOrderList();
    },
    // currentPage 改变时会触发
    handleCurrentChange(val) {
      this.querys.pagenum = val;
      this.getOrderList();
    },
    // 点击查询按钮
    searchOrders() {
      this.querys.pagenum = 1;
      this.getOrderList();
    },
    // 级联选择器
    handleChange() {},
    // 监视订单地址对话框的关闭
    handleClose() {
      this.$refs.editFormRef.resetFields();
    },
    // 显示物流进度对话框
    async showKuaidiBox() {
      const res = await request("/kuaidi/1106975712662");
      if (res.meta.status !== 200)
        return this.$message.error("获取物流数据失败");
      this.progressInfo = res.data;
      this.kuaidiVisible = true;
    },
  },
};
</script>

<style lang="less" scoped>
.input {
  width: 420px;
  margin-bottom: 20px;
}
.el-pagination {
  margin: 20px 0;
}
.el-cascader {
  width: 100%;
}
</style>