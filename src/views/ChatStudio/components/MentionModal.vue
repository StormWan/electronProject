<template>
  <div class="mention-modal" :style="{ top: top, left: left }">
    <ul class="mention-list" ref="listRef">
      <el-scrollbar>
        <li
          v-for="item in searchedList"
          :key="item.joinTime"
          :class="{ active: isActive(item) }"
          @click="insertMentionHandler(item.userID, item.nick)"
        >
          {{ item.nick }}
        </li>
      </el-scrollbar>
    </ul>
  </div>
</template>

<script>
import { mapState } from "vuex";
import TIM from "@tencentcloud/chat";
import { useEventListener } from "@vueuse/core";

const compareUserID = (a, b) => {
  const aHasRBT = a.userID.includes("@RBT#");
  const bHasRBT = b.userID.includes("@RBT#");
  return aHasRBT && !bHasRBT ? -1 : bHasRBT && !aHasRBT ? 1 : 0;
};
export default {
  name: "MentionModal",
  props: {
    // 群主
    isOwner: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState({
      currentUserProfile: (state) => state.user.currentUserProfile,
      currentMemberList: (state) => state.groupinfo.currentMemberList,
    }),
    filterList() {
      return this.currentMemberList
        .filter((t) => t.userID !== this.currentUserProfile.userID)
        .sort(compareUserID);
    },
    // 根据 <input> value 筛选 list
    searchedList() {
      const searchVal = this.searchVal.trim().toLowerCase();
      return this.list.filter((item) => {
        const name = item.nick.toLowerCase();
        if (name.indexOf(searchVal) >= 0) {
          this.tabIndex = 0;
          return true;
        }
        return false;
      });
    },
  },
  data() {
    return {
      top: "",
      left: "",
      list: [],
      tabIndex: 0,
      searchVal: "",
    };
  },
  methods: {
    initList() {
      this.list = [
        {
          joinTime: 0,
          userID: TIM.TYPES.MSG_AT_ALL,
          nick: "全体成员",
        },
        ...this.filterList,
      ];
    },
    initMention() {
      // 仅群主支持@全员
      if (!this.isOwner) this.list.shift();
      // 获取光标位置，定位 modal
      const domSelection = document.getSelection();
      const domRange = domSelection.getRangeAt(0);
      if (domRange == null) return;
      const selectionRect = domRange.getBoundingClientRect();
      // 获取编辑区域 DOM 节点的位置，以辅助定位
      // const containerRect = editor.getEditableContainer().getBoundingClientRect();
      const height = this.$refs.listRef?.clientHeight;
      // 定位 modal
      this.top = `${selectionRect.top - height - 15}px`;
      this.left = `${selectionRect.left + 5}px`;
    },
    hideMentionModal() {
      this.$store.commit("SET_MENTION_MODAL", false);
    },
    inputKeyupHandler(event) {
      if (event.key === "Enter") {
        const firstOne = this.searchedList[this.tabIndex];
        if (!firstOne) return;
        const { userID, nick } = firstOne;
        this.insertMentionHandler(userID, nick);
      }
    },
    insertMentionHandler(id, name) {
      this.$emit("insertMention", id, name);
      this.hideMentionModal(); // 隐藏 modal
    },
    onKeydown(event) {
      switch (event.keyCode) {
        case 38: // 上
          if (this.tabIndex > 0) {
            this.tabIndex--;
            this.scrollToSelectedItem();
          }
          break;
        case 40: //下
          if (this.tabIndex < this.searchedList?.length - 1) {
            this.tabIndex++;
            this.scrollToSelectedItem();
          }
          break;
      }
    },
    isActive(item) {
      if (!item) return;
      if (this.tabIndex > -1) {
        return item?.userID == this.searchedList[this.tabIndex]?.userID;
      } else {
        return false;
      }
    },
    scrollToSelectedItem() {
      const element = document.querySelector(".active");
      if (!element) return;
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    },
  },
  created() {
    this.initList();
  },
  mounted() {
    this.initMention();
    useEventListener(document, "keydown", (e) => {
      this.onKeydown(e);
    });
  },
  beforeUnmount() {
    this.hideMentionModal(); // 隐藏 modal
  },
};
</script>

<style lang="scss" scoped>
.mention-modal {
  position: fixed;
  width: 110px;
  border: 1px solid #ccc;
  background-color: #fff;
  padding: 5px;
}
.mention-input {
  border: 1px solid #60626652;
  border-radius: 3px;
  width: 100px;
  outline: none;
}
.mention-list {
  height: 95px;
  overflow: hidden;
}
.mention-list li {
  cursor: pointer;
  padding: 3px 0;
  text-align: left;
  height: 24px;
}
.mention-modal ul li:hover {
  text-decoration: underline;
}
.active {
  background: #f0f2f5;
}
</style>
