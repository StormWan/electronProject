<template>
  <div class="flex">
    <div class="aside">
      <ListGrid />
    </div>
    <div class="main">
      <el-scrollbar class="h-full">
        <CardGrid v-if="active === 'ForkSpoon'" type="C2C" :item="friend" />
        <CardGrid v-else-if="active === 'IceCreamRound'" type="GROUP" :item="groupList" />
        <!-- <CardGrid v-else-if="active === 'CollectionTag'" type="GROUP" :item="groupListInfo" /> -->
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import CardGrid from "./CardGrid";
import ListGrid from "./ListGrid";
import emitter from "@/utils/mitt-bus";
import { restApi } from "@/api/node-admin-api/index";
import { getUserProfile } from "@/api/im-sdk-api/index";
import { mapState } from "vuex";

export default {
  name: "AddressBook",
  data() {
    return {
      active: "ForkSpoon",
      friend: [],
      groupListInfo: [],
    };
  },
  components: {
    ListGrid,
    CardGrid,
  },
  computed: {
    ...mapState({
      groupList: (state) => state.groupinfo.groupList,
    }),
  },
  async mounted() {
    this.init();
    emitter.on("onActive", (icon) => {
      this.active = icon;
    });
    // this.getGroupList();
    this.$store.dispatch("getGroupList");
  },
  methods: {
    async init() {
      let list = ["huangyk", "admin", "linjx", "@RBT#001", "jinwx", "zhangal"];
      // 获取好友列表
      const { code, data } = await getUserProfile(list);
      this.friend = data;
    },
    async getGroupList() {
      const { GroupIdList } = await restApi({
        funName: "getAppidGroupList",
      });
      const result = GroupIdList.map((t) => t.GroupId);
      const { GroupInfo } = await restApi({
        params: result,
        funName: "getGroupInfo",
      });
      console.log(GroupInfo);
      this.groupListInfo = GroupInfo;
    },
    onFriend({ id, type = "C2C" }) {
      // "GROUP" : "C2C";
      this.$store.commit("TAGGLE_OUE_SIDE", "message");
      this.$store.dispatch("CHEC_OUT_CONVERSATION", { convId: `${type}${id}` });
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
.aside {
  width: 180px;
  min-width: 180px;
  height: 100%;
  padding: 3px 8px 8px;
  border-right: 1px solid #00000017;
}
</style>
