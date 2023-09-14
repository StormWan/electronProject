<template>
  <Motion class="-mt-2 -mb-2"> <QrCode /> </Motion>
  <Motion :delay="100">
    <el-divider>
      <p class="text-gray-500 text-xs">{{ $t("login.tip") }}</p>
    </el-divider>
  </Motion>
  <Motion :delay="150">
    <el-button class="w-full mt-4" @click="commit('SET_CURRENTPAGE', 0)">
      {{ $t("login.back") }}
    </el-button>
  </Motion>
</template>

<script setup>
import { ref, reactive, toRefs, computed, watch, nextTick } from "vue";
import Motion from "@/utils/motion";
import { useStore } from "vuex";
const { state, dispatch, commit } = useStore();
</script>

<style lang="scss" scoped></style>
