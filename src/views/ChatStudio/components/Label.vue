<template>
  <span :class="['label', labelClass()]">
    <span class="all" v-show="isallStaff(item)">全员</span>
    <svg-icon iconClass="robot" v-show="/^R\d{5}$/.test(userID)" />
  </span>
</template>

<script setup>
import { deepClone } from "@/utils/clone";
import { ref, toRefs, onMounted } from "vue";
import { isallStaff } from "../utils/utils";

// eslint-disable-next-line no-undef
const props = defineProps({
  userID: {
    type: String,
    default: "",
  },
  item: {
    type: Object,
    default: () => {},
  },
});

const { userID, item } = toRefs(props);
const labelClass = (data) => {
  return "";
};
</script>

<style lang="scss" scoped>
@import "@/styles/mixin.scss";
.label {
  text-align: center;
  border-radius: 2px;
  font-size: 10px;
  font-weight: 400;
  svg {
    stroke: unset;
  }
  .all {
    // @include ellipsisBasic(1);
    white-space: nowrap;
    background: #e6f7ff;
    border: 1px solid rgb(145, 213, 255);
    color: #1890ff;
    border-radius: 2px;
    font-size: 10px;
    padding: 0 4px;
    display: inline-block;
    line-height: initial;
    height: 16px;
  }
}
</style>
