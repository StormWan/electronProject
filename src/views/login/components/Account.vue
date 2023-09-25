<template>
  <!-- 表单 -->
  <el-form ref="ruleFormRef" :model="user" :rules="rules">
    <!-- 账号 -->
    <el-form-item prop="username">
      <el-autocomplete
        clearable
        :debounce="200"
        size="large"
        :prefix-icon="User"
        v-model="user.username"
        placeholder="用户账号"
        @select="handleSelect"
        class="inline-input w-50"
        :fetch-suggestions="querySearch"
      />
    </el-form-item>
    <!-- 密码 -->
    <el-form-item prop="password">
      <el-input
        v-model="user.password"
        type="password"
        placeholder="用户密码"
        :prefix-icon="Lock"
        size="large"
        show-password
      >
      </el-input>
    </el-form-item>
    <!-- 验证码 -->
    <el-form-item prop="verifyCode">
      <el-input v-model="user.verifyCode" size="large" placeholder="验证码" clearable>
        <template #prefix>
          <el-icon class="el-input__icon"><Key /></el-icon>
        </template>
        <template #append>
          <ReImageVerify v-model:code="imgCode" />
        </template>
      </el-input>
    </el-form-item>
    <!-- keep -->
    <div class="login-options">
      <el-checkbox v-model="user.keep">记住密码</el-checkbox>
      <div class="forget">忘记密码?</div>
    </div>
    <!-- 登录 -->
    <el-button type="primary" class="login-btn" @click="LoginBtn(ruleFormRef)" :loading="false">
      <template #loading>
        <div class="custom-loading">
          <svg class="circular" viewBox="-10, -10, 50, 50">
            <path
              class="path"
              d="
                  M 30 15
                  L 28 17
                  M 25.61 25.61
                  A 15 15, 0, 0, 1, 15 30
                  A 15 15, 0, 1, 1, 27.99 7.5
                  L 15 15"
              style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"
            />
          </svg>
          <!-- <FontIcon iconName="Eleme" class="circular" /> -->
        </div>
      </template>
      登录
    </el-button>
  </el-form>
  <!-- other hidden -->
  <div class="mt-20 flex justify-between">
    <el-button
      v-for="item in operates"
      :key="item.title"
      size="default"
      @click="onHandle(item.currentPage)"
    >
      {{ item.title }}
    </el-button>
  </div>
</template>

<script setup>
import { Lock, User, Key } from "@element-plus/icons-vue";
import { reactive, ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { login, getuser } from "@/api/node-admin-api/user";
import { operates, thirdParty } from "../utils/enums";
import { useStore } from "vuex";
import { user, rules } from "../utils/validation";
import Motion from "@/utils/motion";
import ReImageVerify from "@/views/components/ReImageVerify/index.vue";
import { useState } from "@/utils/hooks/useMapper";
const { production } = require("@/config/vue.custom.config");

const restaurants = ref([]);
const ruleFormRef = ref();
const imgCode = ref("");

const { state, dispatch, commit } = useStore();

const { currentPage } = useState({
  currentPage: (state) => state.user.currentPage,
});

const handleSelect = (item) => {
  console.log(item);
};
const createFilter = (queryString) => {
  return (restaurant) => {
    return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
  };
};
const querySearch = (queryString, cb) => {
  const results = queryString
    ? restaurants.value.filter(createFilter(queryString))
    : restaurants.value;
  cb(results);
};

const LoginBtn = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) Signin();
  });
};

const Signin = () => {
  dispatch("LOG_IN", user);
};

const onHandle = (index) => {
  commit("SET_CURRENTPAGE", index);
};

const onkeypress = ({ code }) => {
  if (code === "Enter") {
    LoginBtn(ruleFormRef.value);
  }
};

onMounted(async () => {
  const { loadAll } = await getuser();
  restaurants.value = loadAll;
  window.document.addEventListener("keypress", onkeypress);
});

onBeforeUnmount(() => {
  window.document.removeEventListener("keypress", onkeypress);
});

watch(imgCode, (value) => {
  dispatch("SET_VERIFYCODE", value);
  // 测试环境自动填充图形验证码
  if (!production) {
    user.verifyCode = value;
  }
});
</script>

<style lang="scss" scoped>
.login-btn {
  width: 100%;
  margin-top: 20px;
}
.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 22px;
  font-size: 14px;
  div {
    cursor: pointer;
    color: var(--el-color-primary);
  }
}
.el-button .custom-loading .circular {
  margin-right: 6px;
  width: 18px;
  height: 18px;
  animation: loading-rotate 2s linear infinite;
}
.el-button .custom-loading .circular .path {
  animation: loading-dash 1.5s ease-in-out infinite;
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  stroke-width: 2;
  stroke: var(--el-button-text-color);
  stroke-linecap: round;
}
:deep(.el-autocomplete) {
  width: 100%;
}
:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
  box-shadow: none;
  background-color: transparent;
}
</style>
