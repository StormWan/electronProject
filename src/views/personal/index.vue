<template>
  <div class="content-wrap">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="box-card">
          <div v-for="o in 10" :key="o" class="text item">
            {{ "List item " + o }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card>
          <div v-for="o in 10" :key="o" class="text item">
            {{ "List item " + o }}
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- <div class="h-full">
      <Stage
        v-bind="{
          initialPieAnimation: true,
          updateURLHash: true,
          initialPieLayout: {
            left: '30%',
            top: 'center',
            width: '50%',
            height: '50%',
          },
        }"
      />
    </div> -->
  </div>
</template>

<script setup>
// import { use } from "echarts/core";
// import { CustomChart } from "echarts/charts";
// import { TitleComponent, GraphicComponent } from "echarts/components";
// use([CustomChart]);
// use([TitleComponent]);
// use([GraphicComponent]);
</script>

<style lang="scss" scoped></style>
