<template>
  <div class="reports">
    <el-card>
      <el-alert title="ECharts的简单示例" type="info"></el-alert>
      <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div id="chart1" style="width: 720px;height:500px;" class="charts"></div>
      <div id="chart2" style="width: 720px;height:500px;" class="charts"></div>
    </el-card>
  </div>
</template>

<script>
import { request } from "@/network/request.js";
import echarts from "echarts";
export default {
  data() {
    return {
      // 合并的数据
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    };
  },
  async mounted() {
    // 基于准备好的dom，初始化echarts实例
    let myChart1 = echarts.init(document.getElementById("chart1"));

    // 指定图表的配置项和数据
    const res = await request("reports/type/1");
    if (res.meta.status !== 200) return this.$message.error("获取数据失败");
    const result = _.merge(res.data, this.options);
    // 使用刚指定的配置项和数据显示图表。
    myChart1.setOption(result);

    let myChart2 = echarts.init(document.getElementById("chart2"));
    let option = {
      aria: {
        show: true,
      },
      title: {
        text: "某站点用户访问来源",
        x: "center",
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)",
      },
      legend: {
        orient: "vertical",
        left: "left",
        data: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"],
      },
      series: [
        {
          name: "访问来源",
          type: "pie",

          data: [
            { value: 335, name: "直接访问" },
            { value: 310, name: "邮件营销" },
            { value: 234, name: "联盟广告" },
            { value: 135, name: "视频广告" },
            { value: 1548, name: "搜索引擎" },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };

    myChart2.setOption(option);
  },
};
</script>

<style lang="less" scoped>
.el-alert {
  margin-bottom: 20px;
}
.charts {
  display: inline-block;
  margin: 0 40px;
}
</style>