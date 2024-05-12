<template>
  <div class="reset-password-container">
    <el-row>
      <el-col :lg="14" :md="11" :sm="24" :xl="14" :xs="24">
        <div style="color: transparent">占位符</div>
      </el-col>
      <el-col :lg="9" :md="12" :sm="24" :xl="9" :xs="24">
        <el-form ref="formRef" class="login-form" :model="form" :rules="rules" label-position="top">
          <div class="title">智能在线客服系统</div>
          <div class="last-title">重置密码</div>
          <div class="last-tips">登录邮箱验证成功，现在请设置新的密码</div>
          <el-form-item prop="email">
            <el-input
              v-model.trim="form.email"
              v-focus
              placeholder="请输入需要重置的邮箱"
              tabindex="1"
              type="text"
            />
          </el-form-item>
          <el-form-item prop="code">
            <el-input
              v-model.trim="form.code"
              v-focus
              placeholder="请输入邮箱验证码"
              tabindex="1"
              type="text"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model.trim="form.password"
              placeholder="请输入新密码"
              autocomplete="new-password"
              show-password
              type="password"
            />
          </el-form-item>
          <el-form-item prop="rePassword">
            <el-input
              v-model.trim="form.rePassword"
              placeholder="请输入新密码"
              autocomplete="new-password"
              show-password
              type="password"
            />
          </el-form-item>

          <el-button link type="primary" @click="handleSendEmail"> 重新发送邮箱验证码 </el-button>

          <el-form-item>
            <el-button
              class="login-btn"
              :loading="loading"
              type="primary"
              style="width: 100%"
              @click="handleResetPasword"
            >
              重置密码
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <vab-footer />
  </div>
</template>

<script setup>
import { useSettingsStore } from "@/store/modules/settings";
// import { useUserStore } from '@/store/modules/user'
import { translate } from "@/i18n";
import { resetPassword } from "@/api/user";

import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";

const route = useRoute();
const router = useRouter();
// const userStore = useUserStore()
const settingsStore = useSettingsStore();
// const login = (form) => userStore.login(form)
const formRef = ref(null);
const passwordRef = ref(null);
const form = ref({
  email: "",
  password: "",
  code: "",
});
const rules = {
  email: [
    {
      required: true,
      trigger: "blur",
      message: translate("请输入邮箱"),
    },
  ],
  password: [
    {
      required: true,
      trigger: "blur",
      message: translate("请输入密码"),
    },
    {
      pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/,
      message: "密码必须采用数字、字母混合，不得少于8位、不得超过20位",
      trigger: ["blur", "change"],
    },
  ],
  rePassword: [
    {
      required: true,
      trigger: "blur",
      message: translate("请输入密码"),
    },
    {
      pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/,
      message: "密码必须采用数字、字母混合，不得少于8位、不得超过20位",
      trigger: ["blur", "change"],
    },
  ],
  code: [{ required: true, trigger: "blur", message: "验证码不能空" }],
};
const loading = ref(false);
const passwordType = ref("password");
const redirect = ref(undefined);
const previewText = ref("");

onMounted(() => {
  //  获取 url 的参数
  state.form.email = route.query.email;
  state.form.code = route.query.code;
});

const handleResetPasword = () => {
  Promise.all([
    state["formRef"].validateField("email"),
    state["formRef"].validateField("code"),
    state["formRef"].validateField("password"),
  ])
    .then(async () => {
      if (state.form.rePassword !== state.form.password) {
        gp.$baseMessage(
          "两次输入密码不一致，请重新输入！",
          "error",
          "vab-hey-message-error",
          false
        );
        return;
      }
      try {
        state.loading = true;
        resetPassword(state.form)
          .then((response) => {
            if (response.code === 20000) {
              gp.$baseMessage("重置密码成功！", "success", "vab-hey-message-success", false);

              router.push("/login");
            }
          })
          .catch((e) => {
            if (e.code === 20001 && e.message === "连接失效，请重新找回密码") {
              handleSendEmail();
            }
          });
      } finally {
        state.loading = false;
      }
    })
    .catch((e) => {
      console.log(e);
      state.loading = false;
    });
};

// 跳转到发送邮件
const handleSendEmail = () => {
  router.push({
    name: "Login",
    query: { step: 1 },
  });
};

// 国家法律法规要求显示备案号 实际项目请自行为自己的备案信息及域名
const beianShow = ref(false);

// onBeforeMount(() => {
//   state.form.loginAcct = 'admin'
//   state.form.password = '123456'
//   // 为了演示效果，会在官网演示页自动登录到首页，正式开发可删除
//   if (
//     location.hostname === 'vue-admin-beautiful.com' ||
//     location.hostname === 'chu1204505056.gitee.io'
//   ) {
//     beianShow.value = true
//     state.previewText = '（演示地址验证码可不填）'
//     state.timer = setTimeout(() => {
//       handleLogin()
//     }, 5000)
//   }
// })

watchEffect(() => {
  state.redirect = (route.query && route.query.redirect) || "/";
});

onBeforeRouteLeave((to, from, next) => {
  clearInterval(state.timer);
  next();
});

return {
  translateTitle: translate,
  ...toRefs(state),
  title: settingsStore.getTitle,
  handleResetPasword,
  handleSendEmail,
};
</script>

<style lang="scss" scoped>
.reset-password-container {
  height: 100vh;
  background: url("~@/assets/login_images/login_bg.png") center center fixed no-repeat;
  background-size: cover;

  .login-form {
    position: relative;
    max-width: 100%;
    padding: 4.5vh;
    margin: calc((100vh - 855px) / 2) 5vw 5vw;
    overflow: hidden;

    .title {
      padding-bottom: 40px;
      margin: 0 auto 40px;
      font-size: 30px;
      font-weight: bold;
      color: var(--el-color-primary);
    }

    .title-tips {
      margin-top: 29px;
      font-size: 26px;
      font-weight: 400;
      color: var(--el-color-primary);
    }

    .login-btn {
      display: inherit;
      width: 220px;
      height: 50px;
      margin-top: 5px;
      background: var(--el-color-primary);
      border: 0;

      &:hover {
        opacity: 0.9;
      }
    }

    .tips {
      margin-bottom: 10px;
      font-size: $base-font-size-default;
      color: var(--el-color-white);

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .title-container {
      position: relative;

      .title {
        padding-bottom: 40px;
        margin: 0 auto 40px;
        font-size: 30px;
        font-weight: bold;
        color: var(--el-color-primary);
      }
    }

    i {
      position: absolute;
      top: 8px;
      left: 15px;
      font-size: 16px;
    }

    .show-password {
      float: right;
      width: 32px;
      height: 32px;
      font-size: 16px;
    }

    .last-title {
      padding-bottom: 30px;
      font-size: 20px;
      font-weight: bold;
      text-align: center;
    }

    .last-tips {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding-bottom: 10px;
      font-size: 16px;
    }

    .success-icon {
      position: static;
      display: flex;
      margin: 20px auto;
      font-size: 75px;
      color: green;
    }

    :deep() {
      .el-form-item {
        padding-right: 0;
        margin: 20px 0;
        color: #454545;
        background: transparent;
        border: 1px solid transparent;
        border-radius: 2px;

        &__content {
          min-height: $base-input-height;
          line-height: $base-input-height;
        }

        &__error {
          position: absolute;
          top: 100%;
          left: 18px;
          font-size: $base-font-size-small;
          line-height: 18px;
          color: var(--el-color-error);
        }
      }

      .el-input {
        box-sizing: border-box;

        input {
          height: 48px;
          padding-left: 30px;
          line-height: 48px;
          border: 0;
        }

        &__suffix-inner {
          position: absolute;
          right: 65px;
          cursor: pointer;
        }
        .el-input__password {
          margin-top: 15px;
        }
      }

      .code {
        position: absolute;
        top: 4px;
        right: 4px;
        cursor: pointer;
        border-radius: $base-border-radius;
      }
    }
  }

  :deep() {
    .vab-footer {
      position: fixed;
      bottom: 20px;
      width: 100%;
      color: #fff !important;
      text-align: center;
      background: transparent;
      border: 0;
    }
  }
}
</style>
