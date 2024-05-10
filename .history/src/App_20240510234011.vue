<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<script>
import { mapState } from "vuex";
import { defineComponent } from "vue";
import { ElConfigProvider } from "element-plus";
import { appIpcEmit } from "@/utils/appEmit";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import en from "element-plus/dist/locale/en.mjs";

export default defineComponent({
  name: "app",
  components: {
    [ElConfigProvider.name]: ElConfigProvider,
  },
  computed: {
    ...mapState({
      lang: (state) => state.settings.lang,
    }),
    locale() {
      return this.lang === "zh" ? zhCn : en;
    },
  },
  mounted() {
    appIpcEmit();
    // dispatch("reloadRoute");
    this.loginAgain(this.$route);

          const fp = await FingerprintJS.load()
      const result = await fp.get()

      // 这就是生成的访客ID (浏览器指纹)
      const visitorId = result.visitorId
      setVisitorId(visitorId)
  },
  methods: {
    loginAgain({ name }) {
      if (!name) return;
      this.$nextTick(() => {
        if (name === "login") return;
        this.$store.dispatch("LOG_IN_AGAIN");
      });
    },
  },
});
</script>

<style lang="scss">
#app {
  height: 100%;
}
.content-wrap {
  padding: 24px;
  height: calc(100vh - 86px);
}
.v-contextmenu {
  .v-contextmenu-item--hover {
    background: #f6f7f8 !important;
  }
  .v-contextmenu-item {
    height: 23px;
    line-height: 23px;
    padding: 0px 5px;
    border-radius: 3px;
    color: rgba(0, 0, 0, 0.65);
    font-size: 12px;
    font-weight: 500;
  }
  .v-contextmenu-inner {
    width: 110px;
    padding: 5px 5px;
  }
}
</style>
