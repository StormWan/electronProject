<template>
  <div class="items-box" v-for="item in item" :key="item.GroupId || item.groupID || item.userID">
    <div class="left-item">
      <UserAvatar
        words="3"
        shape="circle"
        :nickName="item.Name || item.name || item.nick"
        :url="item.avatar || ''"
      />
    </div>
    <div class="right-item">
      <p>{{ item.Name || item.name || item.nick }}</p>
      <el-icon @click="onFriend({ id: item.GroupId || item.groupID || item.userID })">
        <Position />
      </el-icon>
    </div>
  </div>
</template>

<script>
export default {
  name: "CardGrid",
  props: {
    item: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String,
      default: "group", // friend  group
    },
  },
  computed: {},
  data() {
    return {};
  },
  methods: {
    onFriend({ id, type = "C2C" }) {
      // "GROUP" : "C2C";
      this.$store.commit("TAGGLE_OUE_SIDE", "message");
      this.$store.dispatch("CHEC_OUT_CONVERSATION", { convId: `${this.type}${id}` });
      setTimeout(() => {
        const dom = document.getElementById(`message_C2C${id}`);
        if (!dom) return;
        dom.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    },
  },
};
</script>

<style lang="scss" scoped>
.items-box {
  display: flex;
  width: 218px;
  min-height: 50px;
  border: 1px solid #eeeaea;
  border-radius: 10px;
  padding: 10px;
  box-sizing: border-box;
  .left-item {
    img {
      width: 40px;
      height: 40px;
    }
  }
  .right-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 150px;
    padding-left: 10px;
    .el-icon {
      cursor: pointer;
    }
  }
}
</style>
