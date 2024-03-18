<template>
  <div>
    <template v-for="item in tree" :key="item.path">
      <el-menu-item v-if="level(item)" :index="item.path">
        <!-- 一级菜单 -->
        <template v-if="isChat(item)">
          <el-badge is-dot :value="unreadMsg" :hidden="unreadMsg === 0">
            <FontIcon :iconName="item.meta.icon" />
            <!-- <span class="column-bar"><span></span></span> -->
          </el-badge>
        </template>
        <FontIcon v-else :iconName="item.meta.icon" />
        <template #title>
          {{ item.meta.locale ? $t(`route.${item.meta.locale}`) : item.meta.title }}
        </template>
      </el-menu-item>
      <el-sub-menu v-else :index="item.path">
        <!-- 二级菜单 -->
        <template #title>
          <FontIcon :iconName="item.meta.icon" />
          <span>{{ item.meta.locale ? $t(`route.${item.meta.locale}`) : item.meta.title }}</span>
        </template>
        <SideItem :tree="item.children" />
      </el-sub-menu>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "SideItem",
  props: {
    tree: {
      type: Object,
      required: true,
    },
    hidden: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapState({
      unreadMsg: (state) => state.conversation.totalUnreadMsg,
    }),
  },
  methods: {
    itemClass(item) {
      return {
        "active-item": this.$route.name === item.name,
      };
    },
    level(item) {
      return !item.children || item.children.length === 0;
    },
    isChat(item) {
      return item.name === "chatstudio";
    },
  },
};
</script>

<style lang="scss" scoped>
.el-menu--collapse {
  height: 50px;
  .el-menu-item {
    // margin: 0 10px 0 10px;
    border-radius: 5px;
  }
}

.column-bar {
  display: inline-block;
  width: 6px;
  height: 6px;
  vertical-align: middle;
  border-radius: 50%;
  background: var(--el-color-error);
  span {
    background: var(--el-color-error);
    transition: var(--el-transition);
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    animation: dot 1.2s ease-in-out infinite;
  }
}
@keyframes dot {
  0% {
    opacity: 0.6;
    transform: scale(0.8);
  }

  to {
    opacity: 0;
    transform: scale(2.4);
  }
}
</style>
