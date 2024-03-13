<template>
  <div class="select-none" :class="['fixed-header', sidebar ? 'style-fixed' : '']">
    <div class="navbar">
      <div class="flex">
        <div
          class="container"
          :title="isCollapse ? '点击展开' : '点击折叠'"
          @click="toggleClick(isCollapse)"
        >
          <FontIcon class="icon-hover" :iconName="isCollapse ? 'Expand' : 'Fold'" />
        </div>
        <el-breadcrumb>
          <el-breadcrumb-item v-for="item in breadcrumbItems" :key="item.title">
            {{ item.locale ? $t(`route.${item.locale}`) : item.title }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="arrow-setup">
        <Fullscreen />
        <div class="user">
          <el-dropdown>
            <span class="el-dropdown-link">
              <UserAvatar type="self" :size="28" />
              <p>{{ userProfile.nick }}</p>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="topersonal">
                  <FontIcon iconName="user" />
                  个人中心
                </el-dropdown-item>
                <el-dropdown-item @click="logout">
                  <FontIcon iconName="switch-button" />
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div class="setup" @click="openSetup()">
          <FontIcon class="icon-hover" iconName="setting" />
        </div>
      </div>
    </div>
    <Tags />
    <el-drawer
      v-model="drawer"
      :append-to-body="true"
      :direction="'ltr'"
      size="200px"
      :with-header="false"
    >
      <SideBar :vislbile="true" />
    </el-drawer>
  </div>
</template>

<script>
import { mapState } from "vuex";
import SideBar from "../sideBar/index.vue";
import { showConfirmationBox } from "@/utils/message";
import { isWindows } from "@/electron/utils/index";
import Fullscreen from "./Fullscreen.vue";
import Tags from "./Tags.vue";
import uniqBy from "lodash-es/uniqBy";

export default {
  name: "Header",
  components: {
    Fullscreen,
    SideBar,
    Tags,
  },
  computed: {
    ...mapState({
      userProfile: (state) => state.user.userProfile,
      tags: (state) => state.data.elTag,
      sidebar: (state) => state.settings.sidebar,
      isCollapse: (state) => state.settings.isCollapse,
      setswitch: (state) => state.settings.setswitch,
    }),
    breadcrumbItems() {
      return this.$route.matched.map((t) => t.meta);
    },
  },
  data() {
    return {
      drawer: false,
    };
  },
  watch: {
    $route: {
      handler(val) {
        this.getBreadcrumb(val.path);
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {},
  methods: {
    getBreadcrumb(path) {
      const { name, meta } = this.$route;
      const { title, locale } = meta;
      const label = this.tags;
      let index = -1;
      if (label) {
        index = label.findIndex((t) => {
          return t?.path === path;
        });
      }
      const append = { title, name, locale, path };
      const tag = label ? [...label, append] : [append];
      const uniqueData = uniqBy(tag, "name");
      if (index === -1) {
        this.$store.commit("UPDATE_USER_INFO", { key: "elTag", value: uniqueData });
      }
    },
    toggleClick(val) {
      if (!this.sidebar) this.drawer = true;
      this.$store.commit("UPDATE_USER_SETUP", {
        key: "isCollapse",
        value: !this.sidebar ? false : !val,
      });
    },
    async logout() {
      const result = await showConfirmationBox({ message: "确定退出登录?", iconType: "warning" });
      if (result === "cancel") return;
      this.$store.dispatch("LOG_OUT");
    },
    openSetup() {
      this.$store.commit("UPDATE_USER_SETUP", {
        key: "setswitch",
        value: true,
      });
    },
    topersonal() {
      this.$router.push({ name: "personal" });
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  padding: 0 15px;
  line-height: 48px;
  height: 100%;
  display: flex;
  align-items: center;
}
.style-fixed {
  width: 100% !important;
}
.fixed-header {
  z-index: 10;
  position: relative;
  transition: width 0.1s;
  background: var(--color-body-bg);
}
.cursor-w {
  cursor: w-resize;
}

.navbar {
  display: flex;
  height: 48px;

  .arrow-setup {
    flex: 1;
    color: #00000073;
    display: flex;
    justify-content: right;
    align-items: center;

    .setup {
      width: 40px;
      text-align: center;
      border-left: 1px solid #ccc;
    }
    .user :deep(.el-dropdown-link) {
      display: flex;
      align-items: center;
      padding: 0 10px;
      cursor: pointer;
      .el-avatar {
        margin-right: 10px;
      }
    }
  }
}

.el-breadcrumb {
  font-size: 14px;
  line-height: 48px;
  height: 100%;
  overflow: hidden;
  min-width: 130px;
  .breadcrumb__item {
    display: flex;
    align-items: center;
  }
}
</style>
