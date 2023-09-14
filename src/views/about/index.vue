<template>
  <el-scrollbar>
    <el-card shadow="never">
      <template #header>
        <div>
          <span> {{ name }} </span>
        </div>
      </template>
      <span style="font-size: 15px"> {{ name }} 是一个基于Vue3、Element-Plus的后台管理模板 </span>
    </el-card>
    <!-- 项目信息 -->
    <el-card class="style-card" shadow="hover">
      <template #header>
        <div>
          <span>项目信息</span>
        </div>
      </template>
      <el-descriptions :column="2" border>
        <el-descriptions-item
          v-for="item in data"
          :key="item.label"
          :label="item.label"
          label-align="left"
          align="left"
        >
          <el-tag v-if="item?.tag">{{ item.tag }}</el-tag>
          <a v-else :href="item.url" target="_blank">
            <span class="style-color"> {{ item.title }} </span>
          </a>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
    <!-- 生产环境依赖 -->
    <el-card class="style-card" shadow="hover">
      <template #header>
        <div>
          <span>生产环境依赖</span>
        </div>
      </template>
      <el-descriptions border>
        <el-descriptions-item
          :label="item.label"
          label-align="left"
          align="left"
          v-for="(item, index) in schema"
          :key="index"
        >
          <a :href="'https://www.npmjs.com/package/' + item.label" target="_blank">
            <span class="style-color">
              {{ item.field }}
            </span>
          </a>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
    <!-- 开发环境依赖 -->
    <el-card class="style-card" shadow="hover">
      <template #header>
        <div>
          <span>开发环境依赖</span>
        </div>
      </template>
      <el-descriptions border>
        <el-descriptions-item
          :label="item.label"
          label-align="left"
          align="left"
          v-for="(item, index) in devSchema"
          :key="index"
        >
          <a :href="'https://www.npmjs.com/package/' + item.label" target="_blank">
            <span class="style-color">
              {{ item.field }}
            </span>
          </a>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </el-scrollbar>
</template>

<script setup>
import { getCurrentInstance } from "vue";
const { repository } = require("../../../package.json");
const { proxy } = getCurrentInstance();
const APP_INFO = JSON.parse(window.__APP_INFO__);
const { pkg, lastBuildTime } = APP_INFO;
const { dependencies, devDependencies, version, name } = pkg;

const schema = [];
const devSchema = [];

const data = [
  {
    label: "版本",
    tag: version,
  },
  {
    label: "最后编译时间",
    tag: lastBuildTime,
  },
  {
    label: "文档地址",
    url: "https://hyk260.github.io/PureAdmin",
    title: "文档地址",
  },
  {
    label: "QQ交流群",
    url: "https://jq.qq.com/?_wv=1027&k=Cd4Ihd2J",
    title: "点击链接加入群聊【PureAdmin交流群】",
  },
  {
    label: "Github",
    url: repository.url,
    title: "Github",
  },
  {
    label: "gitee",
    url: "https://gitee.com/H260788/PureAdmin",
    title: "gitee",
  },
];

Object.keys(dependencies).forEach((key) => {
  schema.push({ field: dependencies[key], label: key });
});

Object.keys(devDependencies).forEach((key) => {
  devSchema.push({ field: devDependencies[key], label: key });
});
</script>

<style scoped lang="scss">
.style-color {
  color: var(--el-color-primary);
}
.style-card {
  margin: 20px !important;
}
</style>
