<template>
  <el-scrollbar>
    <el-card class="top-content">
      <div class="left-mark">
        <Portrait :size="45" @click="openDepot" />
        <span class="style-text">{{ greetings }}</span>
      </div>
    </el-card>
    <el-row :gutter="16" class="style-row">
      <el-col>
        <el-card>
          <template #header>
            <span class="style-text"> GitHub饼图信息 </span>
          </template>
          <el-skeleton animated :rows="7" :loading="loading">
            <template #default>
              <div></div>
            </template>
          </el-skeleton>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="16" class="style-row">
      <el-col>
        <el-card>
          <template #header>
            <span class="style-text"> GitHub饼图信息 </span>
          </template>
          <el-skeleton animated :rows="7" :loading="loading">
            <template #default>
              <div>测试</div>
            </template>
          </el-skeleton>
        </el-card>
      </el-col>
    </el-row>
  </el-scrollbar>
</template>

<script setup>
import { computed, ref } from "vue";

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
