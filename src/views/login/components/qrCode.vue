<template>
  <Motion>
    <div class="flex justify-center">
      <QrCode class="QrCode" v-show="loading" />
      <Character :loading="loading" />
    </div>
  </Motion>
  <Motion :delay="100">
    <el-divider>
      <p class="m-0">{{ $t("login.tip") }}</p>
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
import Character from "./Character.vue";
const { dispatch, commit } = useStore();
import { useBoolean } from "@/utils/hooks/index";
const [loading, setLoading] = useBoolean();
setTimeout(() => {
  setLoading(true);
}, 2000);
</script>

<style lang="scss" scoped>
.QrCode {
  position: absolute;
  // animation: anima_tada 1s linear;
}
@keyframes anima_tada {
  0% {
    -webkit-transform: scale(1);
  }
  5%,
  10% {
    -webkit-transform: scale(0.8) rotate(-5deg);
  }
  15%,
  25%,
  35%,
  45% {
    -webkit-transform: scale(1.1) rotate(3deg);
  }
  20%,
  30%,
  40% {
    -webkit-transform: scale(1.1) rotate(-3deg);
  }
  50%,
  100% {
    -webkit-transform: scale(1);
  }
}
</style>
