<template>
  <div class="tags-view">
    <div>
      <div class="arrow-left">
        <FontIcon iconName="arrow-left" class="cursor-w" />
      </div>
      <div class="scroll-container">
        <el-tag
          v-for="item in tags"
          :key="item.title"
          :closable="item.name !== 'welcome'"
          :type="curTitle === item.title ? '' : 'info'"
          @click="onClick(item.path)"
          @close="handleClose(item)"
          v-contextmenu:contextmenu
          @contextmenu.prevent="contextMenuEvent($event, item)"
        >
          {{ item.locale ? $t(`route.${item.locale}`) : item.title }}
        </el-tag>
      </div>
      <div class="arrow-right">
        <FontIcon iconName="arrow-right" class="cursor-w" />
      </div>
    </div>
    <!-- 右键菜单 -->
    <!-- <contextmenu ref="contextmenu">
      <contextmenu-item
        v-for="item in RIGHT_CLICK_TAGS_LIST"
        :key="item.id"
        @click="clickMenuItem(item)"
      >
        {{ item.text }}
      </contextmenu-item>
    </contextmenu> -->
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useState } from "@/utils/hooks/useMapper";
import { useRouter } from "vue-router";
import { Contextmenu, ContextmenuItem } from "v-contextmenu";
import { useStore } from "vuex";
const { commit } = useStore();

const router = useRouter();
const curTitle = computed(() => {
  return router.currentRoute.value.meta?.title;
});

const { tags } = useState({
  tags: (state) => state.data.elTag,
});

const RIGHT_CLICK_TAGS_LIST = [
  // {
  //   id: "left",
  //   text: "关闭左侧",
  // },
  // {
  //   id: "right",
  //   text: "关闭右侧",
  // },
  // {
  //   id: "other",
  //   text: "关闭其他",
  // },
  // {
  //   id: "all",
  //   text: "关闭全部",
  // },
];
const contextMenuEvent = (event, tag) => {
  console.log(tag);
};
const clickMenuItem = (item) => {
  // closing(item.id);
};

const onClick = (path) => {
  router.push(path);
};

function findMenuItemByPath(menu, path) {
  const currentIndex = menu.findIndex((item) => item.path === path);
  const leftIndex = currentIndex - 1;
  const rightIndex = currentIndex + 1;
  if (leftIndex >= 0) {
    return menu[leftIndex];
  } else if (rightIndex < menu.length) {
    return menu[rightIndex];
  }
  return null;
}

const handleClose = (value) => {
  const { title, path } = value;
  const tagsArr = tags.value;
  const data = findMenuItemByPath(tagsArr, path);
  const filteredData = tagsArr.filter((item) => {
    return item.path !== path;
  });
  const welcome = [{ title: "首页", path: "/welcome" }];
  const isEmpty = filteredData.length !== 0;
  const label = isEmpty ? filteredData : welcome;
  // 关闭当前标签
  commit("UPDATE_USER_INFO", {
    key: "elTag",
    value: label,
  });
  data && onClick(data.path);
  !isEmpty && onClick(welcome[0].path);
};

function closing(tag) {
  const find = tags.value.findIndex((t) => {
    return t?.title === curTitle.value;
  });
  switch (tag) {
    case "left":
      tags.value.splice(0, find);
      break;
    case "right":
      tags.value.splice(find + 1, tags.value.length);
      break;
    case "other":
      tags.value.splice(0, tags.value.length);
      tags.value.push({
        title: curTitle.value,
        path: router.currentRoute.value.path,
      });
      break;
    case "all":
      tags.value.splice(0, tags.value.length);
      break;
  }
  commit("UPDATE_USER_INFO", {
    key: "elTag",
    value: tags.value,
  });
}
</script>

<style lang="scss" scoped>
:deep(.Left-rotation .el-icon) {
  transform: rotate(-90deg);
}
:deep(.Right-rotation .el-icon) {
  transform: rotate(90deg);
}
.tags-view {
  width: 100%;
  height: 38px;
  border-top: 1px solid #88888852;
  border-bottom: 1px solid #88888852;
  display: flex;
  justify-content: space-between;
  & > div {
    width: 100%;
    display: flex;
  }
  .arrow-left {
    box-shadow: 5px 0 5px -6px #ccc;
    cursor: e-resize;
  }

  .arrow-right {
    box-shadow: -5px 0 5px -6px #ccc;
    cursor: e-resize;
  }

  .scroll-container {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0 5px;
    overflow: hidden;
    span {
      cursor: pointer;
      margin-right: 3px;
    }
  }

  .arrow-left,
  .arrow-right {
    min-width: 38px;
    min-height: 38px;
    color: #00000073;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
