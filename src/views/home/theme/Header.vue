<template>
  <div class="select-none" :class="['fixed-header', sidebar ? 'style-fixed' : '']">
    <div class="navbar">
      <div
        :class="classes.container"
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

      <div class="arrow-setup">
        <!-- 全屏 -->
        <screenfull />
        <!-- 个人中心 退出登录 -->
        <div class="user">
          <el-dropdown>
            <span class="el-dropdown-link">
              <Portrait :size="28" />
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
        <!-- 设置 -->
        <div class="setup" @click="opensetup(setswitch)">
          <FontIcon class="icon-hover" iconName="setting" />
        </div>
      </div>
    </div>
    <Tags />
    <el-drawer v-model="drawer" :direction="'ltr'" size="200px" :with-header="false">
      <SideBar :vislbile="true" />
    </el-drawer>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { ElMessageBox } from "element-plus";
import { computed, ref, watch, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useState } from "@/utils/hooks/useMapper";
import SideBar from "@/views/home/SideBar/index.vue";
import { showConfirmationBox } from "@/utils/message";
import screenfull from "./screenfull.vue";
import Tags from "./Tags.vue";

const { state, dispatch, commit } = useStore();
const router = useRouter();
const route = useRoute();
const value = ref("");
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
    commit("UPDATE_USER_SETUP", {
      key: "isCollapse",
      value: false,
    });
  } else {
    commit("UPDATE_USER_SETUP", {
      key: "isCollapse",
      value: !val,
    });
  }
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
  const tag = label ? [...label, { title, path: value }] : [{ title, path: value }];
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
<style module="classes" scoped>
.container {
  padding: 0 15px;
  line-height: 48px;
  height: 100%;
  display: flex;
  align-items: center;
}

.icon {
  cursor: pointer;
}
</style>
<style lang="scss" scoped>
.style-fixed {
  width: 100% !important;
}
.fixed-header {
  z-index: 10;
  // position: fixed;
  position: relative;
  // top: 0;
  // right: 0;
  transition: width 0.1s;
  // background: #fff;
  // box-shadow: 0 0 1px #888;
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
