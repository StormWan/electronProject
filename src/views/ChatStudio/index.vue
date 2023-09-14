<template>
  <div class="h-full w-full flex">
    <!-- 侧边栏 -->
    <Sidebar />
    <!-- chat -->
    <Message v-show="showChat(outside)" />
    <!-- iframe -->
    <frameView v-if="frame.includes(outside)" :type="outside" />
    <component v-else-if="Component[outside]" :is="Component[outside]" />
  </div>
</template>

<script setup>
import { useState } from "@/utils/hooks/useMapper";

import Sidebar from "./Sidebar.vue";
import application from "./application.vue";
import mailList from "./mailList.vue";
import Message from "./message.vue";
import test from "./test.vue";
import frameView from "./frameView.vue";
const showChat = (value) => {
  return outsideList.value[0].only.includes(value);
};
const frame = [
  "document",
  "chatgpt",
  // "github",
  // "gitee"
];
const Component = {
  apply: application, // 应用
  address_book: mailList, //通讯录
  test: test, // 测试
};
const { outside, outsideList } = useState({
  outsideList: (state) => state.sidebar.outsideList,
  outside: (state) => state.conversation.outside,
});
</script>

<style lang="scss" scoped></style>
