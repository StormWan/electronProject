<template>
  <span
    :class="['label', getLabel(data).className]"
    v-show="getLabel(data).show"
  >
    {{ getLabel(data).label }}
  </span>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

const props = defineProps({
  data: {
    type: String,
    default: "",
  },
});
const { data } = toRefs(props);

const reg = /^R\d{5}$/;

const getLabel = (data) => {
  let show = false;
  let label = "";
  let className = "";
  // 大写R卡头 后五位是数字
  if (reg.test(data)) {
    show = true;
    label = "机器人";
    className = "robot";
  }
  return { show, label, className };
};
</script>

<style lang="scss" scoped>
.label {
  padding: 0px 2.5px;
  margin: 1px 0 0 4px;
  text-align: center;
  border-radius: 2px;
  font-size: 10px;
  font-weight: 400;
}
// .all {}

.robot {
  color: rgb(84, 180, 239);
  border: 0.64px solid #c6e2ff;
}
</style>
