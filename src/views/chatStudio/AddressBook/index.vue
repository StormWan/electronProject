<template>
  <div class="flex">
    <div class="aside">
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
    </div>
    <div class="main">
      <div v-if="active === 'ForkSpoon'">
        <div class="items-box" v-for="item in friend" :key="item.userID">
          <div class="left-item">
            <UserAvatar words="3" shape="circle" :nickName="item.nick" :url="item.avatar" />
          </div>
          <div class="right-item">
            <p>{{ item.nick }}</p>
            <el-icon @click="onFriend(item.userID)"><Position /></el-icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserProfile } from "@/api/im-sdk-api/index";
export default {
  name: "AddressBook",
  data() {
    return {
      data: [
        {
          title: "我的好友",
          icon: "ForkSpoon",
        },
        // {
        //   title: "我的群聊",
        //   icon: "IceCreamRound",
        // },
      ],
      active: "ForkSpoon",
      friend: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      let list = ["huangyk", "admin", "linjx", "@RBT#001", "jinwx", "zhangal"];
      // 获取好友列表
      const { code, data } = await getUserProfile(list);
      this.friend = data;
    },
    onFriend(id) {
      this.$store.commit("TAGGLE_OUE_SIDE", "message");
      this.$store.dispatch("CHEC_OUT_CONVERSATION", { convId: `C2C${id}` });
      setTimeout(() => {
        const dom = document.getElementById(`message_C2C${id}`);
        if (!dom) return;
        dom.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    },
    onClick({ icon }) {
      this.active = icon;
    },
  },
};
</script>

<style lang="scss" scoped>
.aside {
  width: 180px;
  min-width: 180px;
  height: 100%;
  padding: 3px 8px 8px;
  border-right: 1px solid #00000017;
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
}
.selectd {
  background-color: #f5f5f5;
  color: rgb(114, 184, 249);
  .el-icon {
    color: rgb(114, 184, 249);
  }
}

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
.main {
  & > div {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
