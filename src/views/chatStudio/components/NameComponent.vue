<template>
  <NameComponent :item="item" />
</template>

<script setup>
import { h } from "vue";

const props = defineProps({
  item: {
    type: Object,
  },
});

const NameComponent = (props) => {
  const { item } = props;
  const { isRevoked, type, from, nick, conversationType: chatType } = item;
  if (chatType === "C2C") return null;
  let template = null;
  // 撤回消息 群提示消息 不显示
  const show = isRevoked || type == "TIMGroupTipElem";
  const isSystem = from === "@TIM#SYSTEM"; // 系统消息
  const isFound = from === "@TLS#NOT_FOUND";
  const isGroup = chatType !== "C2C" && !isFound; // 非单聊消息
  if (isGroup) {
    template = h("span", { class: "isGroup" }, nick);
  } else if (isSystem) {
    template = h("span", { class: "isSystem" }, "系统");
  } else {
    template = h("span", { class: "isFound" }, "管理员");
  }
  return h(
    "div",
    {
      style: { display: show ? "none" : "" },
      class: "message_name",
    },
    [template]
  );
};
</script>

<style lang="scss" scoped>
.message_name {
  margin-bottom: 5px;
  color: var(--color-time-divider);
  font-size: 12px;
}
</style>
