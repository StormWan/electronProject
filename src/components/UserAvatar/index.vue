<template>
  <div
    v-if="type == 'group'"
    :class="['user-avatar', 'default', className, shape]"
    :style="backgInfo(url)"
  >
    {{ url ? null : displayInfo(nickName) }}
  </div>
  <img v-else-if="type == 'single'" class="avatar" :src="url || shapeObj[shape]" alt="头像" />
  <el-avatar
    v-else-if="type == 'self'"
    :size="size"
    :src="userProfile?.avatar || shapeObj['circle']"
    :shape="shape"
  />
</template>

<script setup>
import { toRefs } from "vue";
import { useState } from "@/utils/hooks/useMapper";
// <UserAvatar/>
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
  size: {
    type: Number,
    default: 40,
  },
  type: {
    type: String,
    default: "group",
    validator: (value) => {
      return ["single", "group", "self"].includes(value);
    },
  },
  shape: {
    type: String,
    default: "circle",
    validator: (value) => {
      return ["square", "circle"].includes(value);
    },
  },
});

const { url, nickName, shape, words, className, type, size } = toRefs(props);

const shapeObj = {
  circle: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
  square: "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
};

const { userProfile } = useState({
  userProfile: (state) => state.user.currentUserProfile,
});

const displayInfo = (info) => {
  if (!info) {
    return "unknown";
  }
  return info.slice(0, words.value).toUpperCase();
};

const backgInfo = (url) => {
  return { backgroundImage: url ? `url(${url})` : "" };
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
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 3px;
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
