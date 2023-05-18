<template>
  <el-aside width="68px">
    <div class="touxiang">
      <Portrait :size="40" shape="square" @click="openUploadAvatarDialog" />
    </div>
    <ul>
      <li class="aside-item" v-for="item in outsideList" :key="item.icon">
        <div
          v-show="visibile(item)"
          @click="toggle(item)"
          class="aside-list"
          :class="{ current: outside == item.icon }"
        >
          <el-badge :value="unreadMsg" :hidden="item.icon !== 'news' || unreadMsg == 0">
            <svg-icon v-if="item.icon !== 'test'" :iconClass="item.icon" class="style-svg" />
            <el-icon v-else><SwitchFilled /></el-icon>
          </el-badge>
          <div class="icon-title">{{ item.title }}</div>
        </div>
      </li>
    </ul>
    <!-- 上传头像弹框 -->
    <UploadAvatarDialog />
    <!-- 侧边栏拖拽排序弹框 -->
    <SidebarEditDialog />
  </el-aside>
</template>

<script setup>
import {
  h,
  ref,
  onActivated,
  onDeactivated,
  onMounted,
  onBeforeUnmount,
  watch,
  nextTick,
  reactive,
  toRefs,
} from "vue";
import { useStore } from "vuex";
import { useState, useGetters } from "@/utils/hooks/useMapper";
import UploadAvatarDialog from "@/views/ChatStudio/components/UploadAvatarDialog.vue";
import SidebarEditDialog from "@/views/components/MoreSidebar/SidebarEditDialog.vue";
import emitter from "@/utils/mitt-bus";
const { production } = require("@/config/vue.custom.config");

const { state, dispatch, commit } = useStore();
const dialogVisible = ref(false);
const sidebarEdit = ref(false);
const active = ref("news");
const activeIndex = ref(0);

const { outside, unreadMsg, outsideList } = useState({
  outsideList: (state) => state.sidebar.outsideList,
  unreadMsg: (state) => state.conversation.totalUnreadMsg,
  outside: (state) => state.conversation.outside,
});
function visibile(item) {
  if (item.icon == "test" && item.show) {
    return false;
  } else {
    return true;
  }
}
function openUploadAvatarDialog() {
  emitter.emit("uploadAvatarDialog", true);
}
function toggle(item) {
  if (item.icon == "icondiandiandian") {
    emitter.emit("SidebarEditDialog", true);
  } else {
    commit("TAGGLE_OUE_SIDE", item.icon);
  }
}
</script>

<style lang="scss" scoped>
.el-aside {
  z-index: 9;
  box-shadow: 1px 0px 5px 0px rgb(0 0 0 / 10%);
}
.aside-item {
  display: flex;
  justify-content: center;
  align-items: center;
  .aside-list {
    width: 54px;
    height: 54px;
    text-align: center;
    padding-top: 0.625rem;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
      background-color: #f2f2f2;
    }
  }
  .style-svg {
    color: #303133;
    font-size: 1.25rem;
  }

  .current {
    background: #d9ecff !important;
  }
  .icon-title {
    color: var(--color-text);
    font-size: 12px;
    margin-top: 3px;
  }
}

.touxiang {
  height: 42px;
  margin: 16px 0 10px 0;
  text-align: center;
}
</style>
