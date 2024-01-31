<template>
  <div class="select-none" :class="['fixed-header', sidebar ? 'style-fixed' : '']">
    <div class="navbar">
      <div class="flex">
        <div
          class="container"
          :title="isActive ? '点击展开' : '点击折叠'"
          @click="toggleClick(isActive)"
        >
          <FontIcon class="icon-hover" :iconName="isActive ? 'Expand' : 'Fold'" />
        </div>
        <el-breadcrumb>
          <el-breadcrumb-item :key="value.title" v-for="value in route.matched.map((t) => t.meta)">
            {{ value.title }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="arrow-setup">
        <screenfull />
        <div class="user" v-show="!isWindows">
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
                <el-dropdown-item @click="Logout">
                  <FontIcon iconName="switch-button" />
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div class="setup" @click="opensetup(setswitch)">
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

<script setup>
import { useStore } from "vuex";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useState } from "@/utils/hooks/useMapper";
import SideBar from "../sideBar/index.vue";
import { showConfirmationBox } from "@/utils/message";
import screenfull from "./screenfull.vue";
import { isWindows } from "@/electron/utils/platform";
import Tags from "./Tags.vue";

const { dispatch, commit } = useStore();
const router = useRouter();
const route = useRoute();
const drawer = ref(false);

const { isActive, userProfile, tags, sidebar, setswitch } = useState({
  userProfile: (state) => state.user.currentUserProfile,
  tags: (state) => state.data.elTag,
  sidebar: (state) => !state.settings.sidebar,
  isActive: (state) => state.settings.isCollapse,
  setswitch: (state) => state.settings.setswitch,
});

const topersonal = () => {
  router.push({ name: "personal" });
};

const opensetup = (val) => {
  commit("UPDATE_USER_SETUP", {
    key: "setswitch",
    value: true,
  });
};
// 退出登录
const Logout = async () => {
  const message = { message: "确定退出登录?", iconType: "warning" };
  const result = await showConfirmationBox(message);
  if (result == "cancel") return;
  dispatch("LOG_OUT");
};
// 侧边栏 展开 折叠
const toggleClick = (val) => {
  if (sidebar.value) {
    drawer.value = true;
  }
  commit("UPDATE_USER_SETUP", {
    key: "isCollapse",
    value: sidebar.value ? false : !val,
  });
};

const getBreadcrumb = (value) => {
  const title = route.meta.title;
  const label = tags.value;
  let index = -1;
  if (label) {
    index = label.findIndex((t) => {
      return t?.title === title;
    });
  }
  const tag = label
    ? [...label, { title, path: value, name: route.name }]
    : [{ title, path: value, name: route.name }];
  if (index == -1) {
    commit("UPDATE_USER_INFO", { key: "elTag", value: tag });
  }
};

watch(
  () => route.path,
  (value) => {
    getBreadcrumb(value);
  },
  {
    immediate: true,
    deep: true,
  }
);
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