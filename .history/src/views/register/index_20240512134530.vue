<template>
  <div class="register-container">
    <svg-icon iconClass="loginBackground" class="wave" />
    <el-row>
      <el-col :lg="14" :md="11" :sm="24" :xl="14" :xs="24">
        <div style="color: transparent">占位符</div>
      </el-col>
      <el-col :lg="9" :md="12" :sm="24" :xl="9" :xs="24">
        <el-form
          ref="registerFormRef"
          class="register-form"
          :model="form"
          :rules="rule"
          label-position="top"
        >
          <template v-if="step == 0">
            <div class="last-title">
              请注册
              <!-- 主题开关 -->
              <ThemeSwitch />
            </div>
          </template>
          <el-steps style="max-width: 600px" :active="step" finish-status="success">
            <el-step title="团队信息" />
            <el-step title="账号信息" />
            <el-step title="完成注册" />
          </el-steps>
          <el-form-item v-show="step === 0" prop="company">
            <el-input
              v-model.trim="form.company"
              v-focus
              auto-complete="off"
              placeholder="请输入企业名字"
              type="text"
            />
          </el-form-item>
          <el-form-item v-show="step === 0" prop="industry">
            <el-select v-model="form.industry" placeholder="请选择行业" style="height: 48px">
              <el-option
                v-for="item in industryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-show="step === 1 && !isChangePone" prop="email">
            <el-input v-model.trim="form.email" placeholder="请输入登录邮箱" type="text" />
          </el-form-item>
          <el-form-item v-show="step === 1 && !isChangePone" prop="password">
            <el-input
              v-model.trim="form.password"
              autocomplete="new-password"
              show-password
              placeholder="请输入密码"
              type="password"
            />
          </el-form-item>

          <div v-if="isChangePone" class="tips-title">更换手机号码</div>
          <el-form-item v-show="step === 1" prop="phone">
            <el-input
              v-model.trim="form.phone"
              maxlength="11"
              placeholder="请输入手机号"
              show-word-limit
              type="text"
            />
          </el-form-item>
          <el-form-item v-show="step === 1" prop="verificationCode">
            <el-input
              v-model.trim="form.verificationCode"
              placeholder="请输入验证码"
              tabindex="3"
              type="text"
              style="width: calc(100% - 110px)"
            />
            <div class="code">
              <el-image v-if="codeUrl" :src="codeUrl" @click="changeCode" />
              <div v-else>加载中</div>
            </div>
          </el-form-item>
          <el-form-item
            v-show="step === 1 && !isChangePone"
            prop="remark"
            label="企业超管后台添加的字段"
          >
            <el-input
              v-model.trim="form.remark"
              maxlength="11"
              placeholder="请输入企业超管后台添加的字段"
              show-word-limit
              type="text"
            />
          </el-form-item>
          <div v-show="step === 2" class="line-code">已发送短信验证码到: {{ form.phone }}</div>
          <el-form-item v-show="step === 2" prop="code">
            <el-input
              v-model.trim="form.code"
              placeholder="请输入手机验证码"
              type="text"
              prop="code"
            />
          </el-form-item>
          <el-button v-show="step === 2" type="primary" link @click="sendPhoneCodeKey(true)">
            重新发送验证码
          </el-button>
          <el-row v-show="step === 2">
            <el-checkbox v-model="termCheck" label="" size="large" />
            <span>
              已阅读并同意
              <el-button link type="primary" @click="showTerm(0)">
                《智能在线客服系统服务条款》
              </el-button>
              和
              <el-button link type="primary" @click="showTerm(1)">《隐私政策》</el-button>
            </span>
          </el-row>
          <el-icon v-show="step === 3"><SuccessFilled /></el-icon>

          <el-form-item>
            <el-button
              v-loading="loading"
              class="register-btn"
              type="primary"
              style="width: 100%"
              @click.prevent="handleRegister"
            >
              {{ isChangePone ? "获取验证码" : step !== 3 ? "下一步" : "前往登陆" }}
            </el-button>
          </el-form-item>
          <el-form-item v-show="step === 2">
            <span>手机号填错了？</span>
            <el-button v-show="step === 2" type="primary" link @click="changePhone">
              修改手机号验证
            </el-button>
          </el-form-item>
          <el-form-item>
            <span @click="toLogin" style="color: #409eff">登陆</span>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :lg="1" :md="1" :sm="24" :xl="1" :xs="24">
        <div style="color: transparent">占位符</div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import { register, getCode, sendPhoneCode } from "@/api/node-admin-api/user";
import { getVisitorId } from "@/utils/common.js";
import { successMessage, warnMessage } from "@/utils/message";

const registerFormRef = ref(null);

const state = reactive({
  const isGetPhone = ref(false)
  const timer= ref(null),
  const phoneCode= ref("获取验证码"),
  const showRegister: ref(false),
  const form: ref({}),
  const step: ref(0),
  const previewText:ref( ""),
  const visitorId: getVisitorId(),
  const codeUrl: "",
  const isChangePone: false,
  const termCheck: false,
  const loading: false,
  industryOptions: [
    { label: "医美/医疗", value: 0 },
    { label: "教育/培训", value: 1 },
    { label: "家居/家装", value: 2 },
    { label: "电子商务", value: 3 },
    { label: "O2O平台", value: 4 },
    { label: "旅游", value: 5 },
    { label: "游戏", value: 6 },
    { label: "房地产", value: 7 },
    { label: "金融/保险类", value: 8 },
    { label: "网络服务", value: 9 },
    { label: "企业服务", value: 10 },
    { label: "服务业", value: 11 },
    { label: "网建/外包", value: 12 },
    { label: "政府机构/社会组织", value: 13 },
    { label: "其他", value: 14 },
  ],

  rule: {
    company: [
      {
        required: true,
        trigger: "blur",
        message: "请输入用户名",
      },
    ],
    industry: [
      {
        required: true,
        trigger: "blur",
        message: "请选择行业",
      },
    ],
    email: [
      {
        required: true,
        trigger: "blur",
        message: "请输入邮箱",
      },
      {
        pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
        message: "请输入正确的邮箱地址",
        trigger: ["blur", "change"],
      },
    ],
    phone: [
      {
        required: true,
        trigger: "blur",
        message: "请输入手机号",
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
    verificationCode: [
      {
        required: true,
        trigger: "blur",
        message: "请输入验证码",
      },
    ],
    code: [
      {
        required: true,
        trigger: "blur",
        message: "请输入验证码",
      },
    ],
  },
});

const changeCode = () => {
  const temp = new Date().getTime();
  getCodeByPhone(temp);
};

const getCodeByPhone = (temp) => {
  if (!state.visitorId) return;
  const deviceId = temp ? state.visitorId + temp : state.visitorId;
  state.visitorId = deviceId;
  state.codeUrl = `http://api.kefu.xurj.top/captcha/image?deviceId=${deviceId}`;
};

const sendPhoneCodeKey = (isReSand) => {
  const params = {
    code: state.form.verificationCode,
    deviceId: state.visitorId,
    phone: state.form.phone,
  };
  state.loading = true;
  sendPhoneCode(params)
    .then((response) => {
      if (response.code === 20000 && !isReSand) {
        state.step = state.step + 1;
      }
      state.loading = false;
    })
    .catch((e) => {
      console.log(e);
      state.loading = false;
    });
};

const getPhoneCode = async () => {
  state["registerFormRef"].validateField("phone").then((item) => {
    state.isGetPhone = true;
    let n = 60;
    state.timer = setInterval(() => {
      if (n > 0) {
        n--;
        state.phoneCode = `${"获取验证码" + n}s`;
      } else {
        clearInterval(state.timer);
        state.phoneCode = "获取验证码";
        state.timer = null;
        state.isGetPhone = false;
      }
    }, 1000);
  });
};

const handleRegister = () => {
  switch (state.step) {
    case 0:
      Promise.all([
        state["registerFormRef"].validateField("company"),
        state["registerFormRef"].validateField("industry"),
      ])
        .then(() => {
          getCodeByPhone();
          state.step = state.step + 1;
        })
        .catch((e) => {
          console.log(e);
        });
      break;
    case 1:
      if (state.isChangePone) {
        state.isChangePone = false;
      }
      Promise.all([
        state["registerFormRef"].validateField("email"),
        state["registerFormRef"].validateField("phone"),
        state["registerFormRef"].validateField("password"),
        state["registerFormRef"].validateField("verificationCode"),
      ])
        .then(() => {
          sendPhoneCodeKey();
        })
        .catch((e) => {
          console.log(e);
        });

      break;
    case 2:
      if (!state.termCheck) {
        warnMessage("请阅读并同意《智能在线客服系统服务条款》和《隐私政策》");
        break;
      }

      Promise.all([state["registerFormRef"].validateField("code")])
        .then(() => {
          state.loading = true;
          register(state.form)
            .then((response) => {
              const { code, message, data } = response;
              if (code == 20000) {
                state.step = state.step + 1;
              }
              state.loading = false;
            })
            .catch((e) => {
              console.log(e);
              if (e.message == "企业名称已存在") {
                state.step = 0;
                state.form = {};
              }
              state.loading = false;
            });
        })
        .catch((e) => {
          consolelog(e);
          state.loading = false;
        });

      break;

    default:
      this.$router.push({ name: "index" });

      break;
  }
};

const toLogin = () => {
  this.$router.push({ name: "login" });
};

const changePhone = () => {
  state.step = 1;
  state.isChangePone = true;
};

const showTerm = (temp) => {
  if (temp) {
    successMessage("查看隐私政策");
  } else {
    successMessage("智能在线客服系统服务条款");
  }
};

onBeforeRouteLeave((to, from, next) => {
  clearInterval(state.timer);
  next();
});

watch(
  () => state.step,
  (newVal) => {
    if (newVal === 3) {
      router.push("/login");
    }
  }
);
</script>
