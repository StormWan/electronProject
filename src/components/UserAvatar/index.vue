<template>
  <div
    :class="['user-avatar', 'default', className, shape]"
    :style="{ backgroundImage: url ? `url(${url})` : '' }"
  >
    {{ url ? null : displayInfo(nickName) }}
  </div>
</template>

<script setup>
import { toRefs } from "vue";

const props = defineProps({
  className: {
    type: String,
    default: "",
  },
  url: {
    type: String,
    default: "",
  },
  nickName: {
    type: String,
    default: "",
  },
  words: {
    type: String || Number,
    default: "2",
  },
  shape: {
    type: String,
    default: "circle",
    validator: (value) => {
      return ["square", "circle"].includes(value);
    },
  },
});

const { url, nickName, shape, words } = toRefs(props);

const displayInfo = (info) => {
  if (!info) {
    return "unknown";
  }
  return info.slice(0, words.value).toUpperCase();
};
</script>

<style lang="scss" scoped>
.user-avatar {
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  background-position: 0 0;
  background-repeat: no-repeat;
  text-align: center;
  font-size: 12px;
  background-color: #5cadff;
  color: #ffffff;
  font-weight: 400;
}

.default {
  width: 40px;
  height: 40px;
  background-size: 40px 40px;
  line-height: 40px;
}
.mention {
  width: 18px;
  height: 18px;
  background-size: 18px 18px;
  line-height: 18px;
}
.square {
  border-radius: 3px;
}
</style>
