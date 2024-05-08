<template>
  <div
    class="list"
    v-for="item in data"
    :key="item.icon"
    @click="onClick(item)"
    :class="{
      selectd: active === item.icon,
    }"
  >
    <div class="icon">
      <FontIcon :iconName="item.icon" />
    </div>
    <div class="title">{{ item.title }}</div>
  </div>
</template>

<script>
import emitter from "@/utils/mitt-bus";
export default {
  name: "ListGrid",
  data() {
    return {
      data: [
        {
          title: "我的好友",
          icon: "ForkSpoon",
        },
        {
          title: "我的群聊",
          icon: "IceCreamRound",
        },
        // {
        //   title: "公开群聊",
        //   icon: "CollectionTag",
        // },
      ],
      active: "ForkSpoon",
    };
  },
  methods: {
    onClick({ icon }) {
      this.active = icon;
      emitter.emit("onActive", icon);
    },
  },
};
</script>

<style lang="scss" scoped>
.list {
  display: flex;
  align-items: center;
  border-radius: 5px;
  cursor: pointer;
}
.icon {
  height: 35px;
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.title {
  padding-left: 5px;
}
.selectd {
  background-color: #f5f5f5;
  color: rgb(114, 184, 249);
  .el-icon {
    color: rgb(114, 184, 249);
  }
}
</style>
