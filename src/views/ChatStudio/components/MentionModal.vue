<template>
  <div class="mention-modal" :style="{ top: top, left: left }" v-show="isVisibile">
    <ul class="mention-list" ref="listRef">
      <el-scrollbar>
        <li
          v-for="item in searchedList"
          :key="item.joinTime"
          :class="{ active: isActive(item) }"
          @click="insertMentionHandler(item.userID, item.nick)"
        >
          <img v-if="item.avatar" :src="item.avatar" class="avatar" alt="头像" />
          <UserAvatar
            v-else
            words="3"
            className="mention"
            shape="square"
            :nickName="item.userID === magAtAll ? '@' : item.nick"
          />
          <span class="nick">{{ item.nick || item.userID }}</span>
        </li>
      </el-scrollbar>
    </ul>
  </div>
</template>

<script>
import { mapState } from "vuex";
import emitter from "@/utils/mitt-bus";
import TIM from "@/utils/IM/chat/index";
import { onClickOutside } from "@vueuse/core";
import { cloneDeep } from "lodash-es";
import { useEventListener } from "@vueuse/core";
import { compareUserID } from "@/views/ChatStudio/utils/utils";

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
      isShowModal: (state) => state.conversation.isShowModal,
      currentUserProfile: (state) => state.user.currentUserProfile,
      currentMemberList: (state) => state.groupinfo.currentMemberList,
    }),
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
    isVisibile() {
      return this.filtering !== "empty";
    },
  },
  data() {
    return {
      top: "",
      left: "",
      list: [],
      searchVal: "", // 中文搜索
      filtering: "", // 搜索模式
      searchValue: 0, // 模糊搜索内容长度
      tabIndex: 0,
      magAtAll: TIM.TYPES.MSG_AT_ALL,
      allMembers: {
        joinTime: 0,
        userID: TIM.TYPES.MSG_AT_ALL,
        nick: "全体成员",
      },
    };
  },
  methods: {
    initList(off = this.isOwner, data = []) {
      this.list = this.filterList(data);
      // 仅群主支持@全员
      if (off) this.list.unshift(this.allMembers);
    },
    filterList(data) {
      if (data.length) {
        return data.sort(compareUserID);
      }
      return this.currentMemberList
        .filter((t) => t.userID !== this.currentUserProfile.userID)
        .sort(compareUserID);
    },
    updateMention() {
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
    initMention() {
      this.updateMention();
      onClickOutside(this.$refs.listRef, (event) => {
        this.SetMentionStatus();
      });
      useEventListener(document, "keydown", (e) => {
        this.onKeydown(e);
      });
      emitter.on("setMentionModal", (data) => {
        const { content = [], type, searchlength = 0 } = cloneDeep(data);
        console.log(content, type, searchlength);
        this.filtering = type; // all success empty
        if (type == "all") {
          this.initList();
        } else if (type == "empty") {
          this.SetMentionStatus();
        } else if (type == "success") {
          this.initList(false, content);
          this.searchValue = searchlength;
        }
      });
    },
    SetMentionStatus(status = false) {
      this.$store.commit("SET_MENTION_MODAL", status);
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
      this.$emit("insertMention", { id, name, deleteDigit: this.searchValue });
      this.SetMentionStatus(); // 隐藏 modal
      this.searchValue = 0;
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
  },
  beforeUnmount() {
    emitter.off("setMentionModal");
    this.SetMentionStatus(); // 隐藏 modal
  },
};
</script>

<style lang="scss" scoped>
.mention-modal {
  position: fixed;
  width: 168px;
  // border: 1px solid #ccc;
  background-color: var(--color-body-bg);
  padding: 5px;
  border-radius: 5px;
  box-shadow: var(--el-box-shadow-lighter);
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
  .avatar {
    width: 18px;
    height: 18px;
    border-radius: 4px;
  }
  .nick {
    margin-left: 5px;
  }
  li {
    cursor: pointer;
    padding: 3px 3px;
    text-align: left;
    height: 24px;
    border-radius: 4px;
    display: flex;
  }
}

.mention-modal ul li:hover {
  text-decoration: underline;
}
.active {
  background: var(--color-mention-active);
}
</style>
