<template>
  <div :class="[classNmae]">
    <el-empty :description="$t('el.table.emptyText')" :image-size="150" />
  </div>
</template>

<script setup>
const props = defineProps({
  classNmae: {
    type: String,
    default: "",
  },
});
</script>

<style lang="scss" scoped>
.no-msg {
  color: rgba(0, 0, 0, 0.45);
  margin-top: 50%;
}

.empty {
  height: 100%;
  :deep(.el-empty) {
    height: 100%;
  }
}
</style>
