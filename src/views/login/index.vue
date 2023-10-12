<template>
  <div class="login flex">
    <div class="login-inner select-none">
      <!-- 背景 -->
      <svg-icon iconClass="loginBg" class="wave" />
      <!-- 主题开关 -->
      <ThemeSwitch />
      <!-- 标题 -->
      <Motion>
        <header class="login-form">
          <div class="tip">
            <h2>{{ $config.Title }}</h2>
          </div>
        </header>
      </Motion>
      <!-- 账号登陆 -->
      <Account v-if="currentPage === 0" />
      <!-- 二维码登录 -->
      <QrCode v-if="currentPage === 2" />
      <!-- 注册 -->
      <Register v-if="currentPage === 3" />
    </div>
  </div>
</template>

<script setup>
import { useState } from "@/utils/hooks/useMapper";
import Motion from "@/utils/motion";
import ThemeSwitch from "../components/ThemeSwitch";
import Account from "./components/Account.vue";
import QrCode from "./components/qrCode.vue";
import Register from "./components/Register.vue";

const { currentPage } = useState({
  currentPage: (state) => state.user.currentPage,
});
</script>
<style lang="scss" scoped>
.login {
  height: 100vh;
}
.login-form {
  .tip {
    text-align: center;
    margin-bottom: 50px;
    h2 {
      // text-transform: uppercase;
      margin: 15px 0;
      color: #999;
      font: bold 200% Consolas, Monaco, monospace;
    }
    span {
      font-size: 18px;
      color: #9e9e9e;
    }
  }
}
.wave {
  background: var(--color-body-bg);
  position: fixed;
  height: 100%;
  width: 100%;
  left: 0;
  bottom: 0;
  z-index: -1;
}
.login-inner {
  width: 400px;
  margin: auto;
  transition: width 0.3s ease;
}
@media only screen and (max-width: 568px) {
  .login-inner {
    width: 300px;
  }
}
@media only screen and (min-width: 569px) {
  .login-inner {
    width: 400px;
  }
}

@keyframes typing {
  from {
    width: 0;
  }
}

@keyframes cursor-blink {
  50% {
    border-color: transparent;
  }
}
</style>
