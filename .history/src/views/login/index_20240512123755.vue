<template>
  <div class="login-container">
    <svg-icon iconClass="loginBackground" class="wave" />
    <el-row>
      <el-col :lg="14" :md="11" :sm="24" :xl="14" :xs="24">
        <div style="color: transparent">占位符</div>
      </el-col>
      <el-col :lg="9" :md="12" :sm="24" :xl="9" :xs="24">
        <el-form ref="formRef" class="login-form" :model="form" :rules="rules" label-position="top">
          <!-- <div class="title">智能在线客服系统</div> -->
          <svg-icon iconClass="titleLogo" class="title" />
          <template v-if="step == 0">
            <div class="last-title">请登录</div>
          </template>
          <template v-if="step == 1">
            <div class="last-title">找回密码</div>
            <div class="last-tips">请填写登录邮箱，我们将发送一封验证邮件</div>
          </template>

          <el-form-item v-if="step == 0" prop="loginAcct" label="请用你的邮箱地址登录账户">
            <el-input
              v-model.trim="form.loginAcct"
              v-focus
              placeholder="请输入用户名"
              tabindex="1"
              type="text"
            />
          </el-form-item>
          <el-form-item v-if="step == 0" prop="password" label="密码">
            <el-input
              v-model.trim="form.password"
              placeholder=""
              autocomplete="new-password"
              show-password
              type="password"
              @keyup.enter="handleLogin"
            />
          </el-form-item>
          <el-form-item v-if="step == 1" prop="toAddress" label="邮箱地址">
            <el-input
              v-model.trim="form.toAddress"
              v-focus
              placeholder="请输入你的登录邮箱地址"
              tabindex="1"
              type="text"
            />
          </el-form-item>
          <!-- 验证码验证逻辑需自行开发，如不需要验证码功能建议注释 -->
          <el-form-item v-if="step !== 2" prop="code" label="验证码">
            <el-input
              v-model.trim="form.code"
              :placeholder="'验证码' + previewText"
              tabindex="3"
              type="text"
              style="width: calc(100% - 110px)"
            />
            <div class="code">
              <el-image v-if="codeUrl" :src="codeUrl" @click="changeCode" />
              <div v-else>加载中</div>
            </div>
          </el-form-item>

          <el-form-item v-if="step == 0">
            <el-button
              class="login-btn"
              :loading="loading"
              type="primary"
              style="width: 100%"
              @click="handleLogin(formRef)"
            >
              登录
            </el-button>
          </el-form-item>

          <el-form-item v-if="step == 1">
            <el-button
              class="login-btn"
              :loading="loading"
              type="primary"
              style="width: 100%"
              @click="handleSendEmail"
            >
              发送邮件
            </el-button>
          </el-form-item>
          <div v-if="step == 2">
            <div class="last-title">找回密码</div>
            <div class="last-title">验证邮件已发送</div>
            <div class="last-tips">请点击验证邮箱内的链接完成操作</div>
            <div class="last-tips">
              如果没有收到验证邮件，可
              <el-button link type="primary" @click="handleSendEmail"> 重新发送 </el-button>
            </div>
            <el-icon class="success-icon"><SuccessFilled /></el-icon>
          </div>
          <el-form-item>
            <el-button
              v-if="step === 2"
              class="login-btn"
              :loading="loading"
              type="primary"
              style="width: 100%"
              @click="handleChangeStep(0)"
            >
              返回登录页面
            </el-button>
            <el-row style="width: 100%" flex justify="space-between">
              <el-col span="12">
                <router-link to="/register"> 注册 </router-link>
              </el-col>
              <el-col v-if="step === 0" span="12">
                <span style="color: gray; cursor: pointer" @click="handleChangeStep(1)">
                  找回密码
                </span>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :lg="1" :md="1" :sm="24" :xl="1" :xs="24">
        <div style="color: transparent">占位符</div>
      </el-col>
    </el-row>
    <vab-footer />
  </div>
</template>

<script setup>
// import { useUserStore } from "@/store/modules/user";
import { getVisitorId } from "@/utils/common.js";
import { login, sendEmail } from "@/api/node-admin-api/user";
import { useState } from "@/utils/hooks/useMapper";
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
import { ref, onMounted, watchEffect } from "vue";
import storage from "@/utils/localforage/index";
import { useStore } from "vuex";

const route = useRoute();
const router = useRouter();
const { dispatch, commit } = useStore();

const form = ref({ loginAcct: "", password: "", code: "", deviceId: "" });
const formRef = ref();
const step = ref(0); // 0-正常登录， 1-找回密码 2-发送邮件
const codeUrl = ref(`http://api.kefu.xurj.top/captcha/image?deviceId=${getVisitorId()}`);
const visitorId = ref(getVisitorId());
const rules = {
  loginAcct: [
    {
      required: true,
      trigger: "blur",
      message: "请输入用户名",
    },
  ],
  password: [
    {
      required: true,
      trigger: "blur",
      message: "请输入密码",
    },
    {
      pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/,
      message: "密码必须采用数字、字母混合，不得少于8位、不得超过20位",
      trigger: ["blur", "change"],
    },
  ],
  code: [{ required: true, trigger: "blur", message: "验证码不能空" }],
  toAddress: [
    { required: true, trigger: "blur", message: "邮箱地址不能为空" },
    {
      pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
      message: "请输入正确的邮箱地址",
      trigger: ["blur", "change"],
    },
  ],
};
const loading = ref(false);
const redirect = ref(undefined);
const timer = ref(0);
const previewText = ref("");

onMounted(() => {
  getCodeByPhone();
  if (route.query.step) {
    step.value = route.query.step;
  }
});

const changeCode = () => {
  const temp = new Date().getTime();
  getCodeByPhone(temp);
};

const getCodeByPhone = (temp) => {
  if (!visitorId.value) return;
  const deviceId = temp ? visitorId.value + temp : visitorId.value;
  visitorId.value = deviceId;
  codeUrl.value = `http://api.kefu.xurj.top/captcha/image?deviceId=${deviceId}`;
};

const handleRoute = () => {
  return redirect.value === "/404" || redirect.value === "/403" ? "/" : redirect.value;
};
const handlePassword = () => {
  state.passwordType === "password" ? (state.passwordType = "") : (state.passwordType = "password");
  nextTick(() => {
    state["passwordRef"].focus();
  });
};
const handleLogin = async () => {
  Promise.all([
    formRef.value.validateField("loginAcct"),
    // formRef.value.validateField("password"),
    formRef.value.validateField("code"),
  ])
    .then(async () => {
      try {
        loading.value = true;
        const params = { ...form.value, deviceId: visitorId.value };
        dispatch("LOG_IN", params);

        // await login(params).catch(() => {});
        // await router.push(handleRoute());
      } finally {
        loading.value = false;
      }
    })
    .catch((e) => {
      console.log(e);
      loading.value = false;
    });
};

const handleSendEmail = () => {
  Promise.all([formRef.value.validateField("email"), formRef.value.validateField("code")])
    .then(async () => {
      try {
        loading.value = true;
        const params = {
          code: form.value.code,
          deviceId: visitorId.value,
          toAddress: form.value.toAddress,
        };
        sendEmail(params)
          .then((response) => {
            if (response.code === 20000) {
              step.value = 2;
            }
          })
          .catch(() => {});
      } finally {
        loading.value = false;
      }
    })
    .catch((e) => {
      console.log(e);
      loading.value = false;
    });
};

const handleChangeStep = (index) => {
  step.value = index;
};

// 国家法律法规要求显示备案号 实际项目请自行为自己的备案信息及域名
const beianShow = ref(false);

// onBeforeMount(() => {
//   form.value.loginAcct = 'admin'
//   form.value.password = '123456'
//   // 为了演示效果，会在官网演示页自动登录到首页，正式开发可删除
//   if (
//     location.hostname === 'vue-admin-beautiful.com' ||
//     location.hostname === 'chu1204505056.gitee.io'
//   ) {
//     beianShow.value = true
//     previewText.value = '（演示地址验证码可不填）'
//     timer.value = setTimeout(() => {
//       handleLogin()
//     }, 5000)
//   }
// })

watchEffect(() => {
  redirect.value = (route.query && route.query.redirect) || "/";
});

onBeforeRouteLeave((to, from, next) => {
  clearInterval(timer.value);
  next();
});
</script>

<style lang="scss" scoped>
.login-container {
  height: 100vh;

  .wave {
    background: var(--color-body-bg);
    position: fixed;
    height: 100%;
    width: 46%;
    left: 3%;
    bottom: 0;
    z-index: -1;
  }

  .login-form {
    position: relative;
    max-width: 100%;
    padding: 4.5vh;
    margin: calc((100vh - 855px) / 2) 5vw 5vw;
    overflow: hidden;

    .title {
      width: 303px;
      height: 48px;
      color: var(--el-color-primary);
      margin-top: 110px;
      margin-bottom: 106px;
    }

    .title-tips {
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
      font-size: 14px;
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
          min-height: 32px;
          line-height: 32px;
        }

        &__error {
          position: absolute;
          top: 100%;
          left: 18px;
          font-size: 12px;
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
        border-radius: 2.5px;
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
