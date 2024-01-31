<template>
  <NameComponent :item="item" />
</template>

<script setup>
import { toRefs, h } from "vue";
// eslint-disable-next-line no-undef
const props = defineProps({
  item: {
    type: Object,
  },
});
const { item } = toRefs(props);
const NameComponent = (props) => {
  const { item } = props;
  const { isRevoked, type, from, nick, conversationType } = item;
  // 撤回消息 群提示消息 不显示
  const show = isRevoked || type == "TIMGroupTipElem";
  // 系统消息
  const isSystem = from == "@TIM#SYSTEM";
  const isFound = from == "@TLS#NOT_FOUND";
  // 非单聊消息
  const isGroup = conversationType !== "C2C" && !isFound;
  const isSingle = conversationType == "C2C";
  if (isSingle) return null;
  return h(
    "div",
    {
      style: { display: show ? "none" : "" },
      class: "message_name",
    },
    [
      isSystem ? h("span", { class: "isSystem" }, "系统") : null,
      isGroup ? h("span", { class: "isGroup" }, nick) : null,
      isFound ? h("span", { class: "isFound" }, "管理员") : null,
    ]
  );
};
</script>

<style lang="scss" scoped></style>
