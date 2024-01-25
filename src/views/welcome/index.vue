<template>
  <el-scrollbar>
    <el-card class="top-content">
      <div class="left-mark">
        <UserAvatar type="self" :size="45" @click="openDepot" />
        <span class="style-text">{{ greetings }}</span>
      </div>
    </el-card>
    <template v-for="(item, index) in header" :key="index">
      <el-row :gutter="16" class="style-row">
        <el-col>
          <el-card>
            <template #header>
              <span class="style-text"> {{ item.title }} </span>
            </template>
            <el-skeleton animated :rows="7" :loading="loading">
              <template #default>
                <div :id="`main${index}`" style="height: 200px"></div>
              </template>
            </el-skeleton>
          </el-card>
        </el-col>
      </el-row>
    </template>
  </el-scrollbar>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
const option = {
  tooltip: {
    trigger: "item",
  },
  legend: {
    top: "5%",
    left: "center",
  },
  series: [
    {
      name: "Access From",
      type: "pie",
      radius: ["40%", "70%"],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: "#fff",
        borderWidth: 2,
      },
      label: {
        show: false,
        position: "center",
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: "bold",
        },
      },
      labelLine: {
        show: false,
      },
      data: [
        { value: 1048, name: "Search Engine" },
        { value: 735, name: "Direct" },
        { value: 580, name: "Email" },
        { value: 484, name: "Union Ads" },
        { value: 300, name: "Video Ads" },
      ],
    },
  ],
};
const header = [
  { title: "GitHub饼图信息", option },
  { title: "Gitee饼图信息", option },
];
let loading = ref(true);
const date = new Date();

let greetings = computed(() => {
  if (date.getHours() >= 0 && date.getHours() < 12) {
    return "朝阳初升，薪水翻倍之时🌞！";
  } else if (date.getHours() >= 12 && date.getHours() < 18) {
    return "午后微风，青春永驻之际😃！";
  } else {
    return "夜幕降临，疲惫忧伤尽消🌛！";
  }
});

const openDepot = () => {
  window.open("https://github.com/Hyk260");
};

onMounted(() => {
  // header.map((t, i) => {
  //   var chartDom = document.getElementById(`main${i}`);
  //   var myChart = echarts.init(chartDom);
  //   option && myChart.setOption(t.option);
  // });
});
</script>
<style lang="scss" scoped>
.style-row {
  margin: 20px !important;
}
.style-text {
  color: var(--color-text);
}
.top-content {
  display: flex;
  align-items: center;
  height: 60px;
  border: none;
  .left-mark {
    display: flex;
    align-items: center;

    img {
      display: block;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin-right: 10px;
      cursor: pointer;
    }

    span {
      margin-left: 10px;
      font-size: 14px;
    }
  }
}
</style>
