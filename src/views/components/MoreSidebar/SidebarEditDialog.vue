<template>
  <el-dialog
    ref="editRef"
    :modal="true"
    v-model="showdialog"
    :append-to-body="true"
    title="导航栏编辑"
    width="450px"
  >
    <div class="draggable">
      <div class="container" v-for="item in list" :key="item.title">
        <p class="text left-text">{{ item.title }}</p>
        <div class="edit-area" :class="item.class" v-if="item.class == 'left-edit-area'">
          <draggable
            class="dragArea list-group w-full"
            :list="outsideList"
            tag="transition-group"
            filter=".fixed"
            :move="onMove"
            @start="onStart"
            @end="onEnd"
            ghostClass="ghost"
            dragClass="chosen"
            animation="300"
          >
            <template v-for="element in outsideList" :key="element.icon">
              <div class="list-group-item" :class="element?.class">
                <el-icon class="reduce"><RemoveFilled /></el-icon>
                <el-icon class="add"><CirclePlusFilled /></el-icon>
                <svg-icon
                  v-if="element.icon !== 'test'"
                  :iconClass="element.icon"
                  class="style-svg"
                />
                <el-icon class="style-svg" v-else><SwitchFilled /></el-icon>
                {{ element.title }}
                <el-icon class="rank"><Rank /></el-icon>
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel"> 取消 </el-button>
        <el-button type="primary" @click="handleConfirm"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import {
  ref,
  defineComponent,
  reactive,
  toRefs,
  defineProps,
  computed,
  watch,
  nextTick,
} from "vue";
import emitter from "@/utils/mitt-bus";
import { mapGetters, mapState, mapMutations, mapActions } from "vuex";
import { VueDraggableNext } from "vue-draggable-next";
export default defineComponent({
  components: {
    draggable: VueDraggableNext,
  },
  data() {
    return {
      list: [
        {
          class: "left-edit-area",
          title: "显示在导航栏上",
          button: "reduce",
        },
        {
          class: "right-edit-area",
          title: "更多",
          button: "add",
        },
      ],
      showdialog: false,
      enabled: true,
      dragging: false,
    };
  },
  computed: {
    ...mapState({
      outsideList: (state) => state.sidebar.outsideList,
    }),
  },
  mounted() {
    emitter.on("SidebarEditDialog", (val) => {
      this.showdialog = val;
    });
  },
  methods: {
    onStart() {},
    onEnd() {},
    onMove(e) {
      if (e.relatedContext.element.if_fixed == 1) return false;
      return true;
    },
    handleConfirm() {
      this.showdialog = false;
    },
    handleCancel() {
      this.showdialog = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.left-edit-area {
  .add {
    display: none;
  }
  .reduce {
    color: #f44336;
  }
}
.right-edit-area {
  .reduce {
    display: none;
  }
  .add {
    color: #1890ff;
  }
}
.style-svg {
  margin-right: 10px;
}
.draggable {
  display: flex;
  justify-content: space-between;
  .container {
    border-radius: 4px;
    width: 195px;
  }
  .edit-area {
    background-color: #f5f5f5;
    .chosen {
      background-color: white;
      color: black;
    }
    .ghost {
      opacity: 0 !important;
    }
  }
  .fixed {
    opacity: 0.5;
    cursor: not-allowed !important;
    .svg-icon {
      cursor: not-allowed;
    }
  }
  .list-group-item {
    padding: 0 20px;
    display: flex;
    height: 45px;
    align-items: center;
    cursor: pointer;
    .el-icon {
      font-size: 17px;
      margin-right: 5px;
    }
    .rank {
      margin-left: auto;
    }
  }
}
</style>
