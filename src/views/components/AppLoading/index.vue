<template>
  <div class="loading fixed-center flex-col">
    <Loader />
    <h2 class="title">PureAdmin管理系统</h2>
  </div>
</template>

<script setup>
import Loader from "@/views/components/Loader/index.vue";
</script>

<style lang="scss" scoped>
.loading {
  color: #999;
  .title {
    font-weight: 500;
    font-size: 28px;
    margin: 15px 0;
  }
}
</style>
