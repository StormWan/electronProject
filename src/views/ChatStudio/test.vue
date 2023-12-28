<template>
  <div>
    <el-button type="primary" @click="setTheme('light')">白色</el-button>
    <el-button type="primary" @click="setTheme('dark')">黑色</el-button>
    <p>设置主题色 {{ theme }}</p>
    <br />
    <el-button type="primary" @click="setState(true)">true</el-button>
    <el-button type="primary" @click="setState(false)">false</el-button>
    <p>useBoolean {{ state }}</p>
    <br />
    <el-button v-for="{ title, onclick } in buttons" :key="title" type="primary" @click="onclick">
      {{ title }}
    </el-button>
    <el-button type="primary" @click="test">测试</el-button>
    <el-button type="primary" @click="test1">获取群组列表</el-button>
    <el-button type="primary" @click="test2"> 查询帐号 </el-button>
    <el-button type="primary" @click="test3"> 拉取运营数据 </el-button>

    <div v-for="item in groupList" :key="item.groupID">
      <p @click="handleGroupClick(item.groupID)">
        {{ item.name }}
      </p>
    </div>
  </div>
</template>

<script>
import { defineComponent, toRefs, reactive, onMounted, onBeforeUnmount } from "vue";
import { mapGetters, mapState, mapMutations, mapActions } from "vuex";
import { useDataThemeChange } from "@/utils/hooks/useDataThemeChange";
import { useBoolean } from "@/utils/hooks/index";
import pure from "pure-tools";

export default defineComponent({
  name: "Test",
  components: {},
  computed: {
    ...mapState({
      groupList: (state) => state.groupinfo.groupList,
      timProxy: (state) => state.user.timProxy,
    }),
  },
  props: {},
  data() {
    return {
      buttons: [
        {
          title: "文件上传",
          onclick: () => this.fileupload(),
        },
        {
          title: "设置",
          onclick: () => this.openSetup(),
        },
        {
          title: "地址本",
          onclick: () => this.openAddress(),
        },
        {
          title: "设置Cookes",
          onclick: () => this.setCookies(),
        },
        {
          title: "获取Cookes",
          onclick: () => this.getCookies(),
        },
        {
          title: "单发单聊消息",
          onclick: () => this.sendMsg(),
        },
        {
          title: "环境变量",
          onclick: () => {
            this.timProxy.saveSelfToLocalStorage();
            console.log(this.timProxy);
            console.log(process.env);
          },
        },
        {
          title: "openapi",
          onclick: async () => {
            await this.callApi();
          },
        },
      ],
      message: "Hello, world!",
    };
  },
  methods: {
    ...mapMutations(["TAGGLE_OUE_SIDE", "setAddbookStatus", "UPDATE_USER_SETUP"]),
    ...mapActions(["getGroupList", "CHEC_OUT_CONVERSATION"]),
    openAddress() {
      this.setAddbookStatus(true);
    },
    openSetup() {
      this.UPDATE_USER_SETUP({ key: "setswitch", value: true });
    },
    test() {},
    test1() {
      // this.getGroupList();
      // this.$api.stream();
    },
    async test3() {
      // const data = await this.$api.restApi({
      //   funName: "getappInfo",
      // });
      // console.log(data);
    },
    setCookies() {
      console.log(pure);
    },
    getCookies() {},
    sendMsg() {},
    async test2() {},
    handleGroupClick(groupID) {
      this.TAGGLE_OUE_SIDE("message");
      this.CHEC_OUT_CONVERSATION({ convId: `GROUP${groupID}` });
    },
    fileupload() {},
    async callApi() {},
  },
  setup(props, { attrs, emit, expose, slots }) {
    const data = reactive({ text: "" });
    const { theme, setTheme } = useDataThemeChange();
    const [state, setState] = useBoolean();

    onMounted(() => {});
    onBeforeUnmount(() => {});
    return {
      state,
      setState,
      theme,
      setTheme,
      ...toRefs(data),
    };
  },
});
</script>

<style lang="scss" scoped></style>
