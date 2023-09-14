<template>
  <div
    class="robot-box"
    v-if="cardData"
    :class="{
      'is-robot': isRobot(cardData),
    }"
    :style="{
      left: left,
      top: top,
    }"
    v-show="drawer"
    ref="popoverRef"
  >
    <div class="title">
      <img :src="cardData.avatar || squareUrl" alt="头像" />
      <span>{{ cardData.nick }}</span>
      <Label :data="cardData?.from" />
    </div>
    <div class="content">
      <div class="characters">
        <span> 待开发 </span>
      </div>
    </div>
    <div class="footer">
      <el-button @click="define" type="primary"> {{ $t("chat.sendMessage") }} </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, toRefs, computed, watchEffect, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
import Label from "@/views/ChatStudio/components/Label.vue";
import { useState } from "@/utils/hooks/useMapper";
import { onClickOutside, onLongPress, useElementBounding } from "@vueuse/core";
import { squareUrl, circleUrl } from "../../ChatStudio/utils/menu";
import { setSelfStatus, getUserStatus } from "@/api/im-sdk-api/index";
import { getUserProfile } from "@/api/im-sdk-api/profile";

const popoverRef = ref();
const left = ref("");
const top = ref("");
const userProfile = ref(null);
const state = reactive({
  back: require("@/assets/images/gptBack.png"),
});
const { back } = toRefs(state);

const { dispatch, commit } = useStore();
const { popover, seat, cardData } = useState({
  seat: (state) => state.groupinfo.seat,
  cardData: (state) => state.groupinfo.cardData,
  popover: (state) => state.groupinfo.popover,
});

const closeModal = () => {
  userProfile.value = null;
  commit("setPopoverStatus", {
    status: false,
  });
};

const isRobot = (item) => {
  return item.from == "R00001";
};

const define = () => {
  dispatch("CHEC_OUT_CONVERSATION", { convId: `C2C${cardData.value.from}` });
  closeModal();
};

onClickOutside(popoverRef, (event) => {
  if (!popover.value) return;
  closeModal();
});

const setPosition = (popover) => {
  if (!popover) return;
  try {
    const { x, y } = popover;
    const l = x + 30;
    const t = y - 80;
    left.value = l + "px";
    top.value = t + "px";
  } catch (error) {
    console.log(error);
  }
};
const setUserProfile = () => {
  const userID = cardData.value?.from;
  getUserProfile(userID)
    .then(({ data }) => {
      userProfile.value = data?.[0];
    })
    .catch((err) => {
      console.log(err);
    });
  console.log(userProfile);
};
const openCard = () => {
  setPosition(seat.value);
  // setUserProfile();
};

const drawer = computed({
  get() {
    openCard();
    return popover.value;
  },
  set(val) {
    closeModal();
  },
});
</script>

<style lang="scss" scoped>
.is-robot {
  background-image: url(../../../assets/images/gptBack.png) !important;
}
.my-popover__avatar {
  cursor: pointer;
}
.robot-box {
  background: #fff;
  box-shadow: 0px 0px 12px rgb(0 0 0 / 12%);
  z-index: 99;
  border-radius: 4px;
  position: fixed;
  width: 320px;
  height: 220px;
  padding: 24px;
  background-size: 320px;
  .title {
    height: 54px;
    img {
      border-radius: 5px;
      height: 54px;
    }
    span {
      margin-left: 16px;
      font-family: MicrosoftYaHei;
      font-size: 18px;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 400;
    }
  }
  .content {
    padding: 24px 0;
    .characters {
      height: 38px;
    }
  }
  .footer {
    :deep(.el-button) {
      width: 100%;
    }
  }
}
</style>
