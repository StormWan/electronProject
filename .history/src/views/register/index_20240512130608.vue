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
              <el-button link type="primary" @click="showTerm(0)"> 《隐私政策》 </el-button>
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
            <router-link to="/login"> 登陆 </router-link>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :lg="1" :md="1" :sm="24" :xl="1" :xs="24">
        <div style="color: transparent">占位符</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { isPassword, isPhone } from "@/utils/validate";
import { register, getCode, sendPhoneCode } from "@/api/user";
import { useUserStore } from "@/store/modules/user";
import { reactive, ref, computed } from "vue";
import { getVisitorId } from "@/utils";
import { gp } from "@gp";

export default defineComponent({
  name: "Register",
  directives: {
    focus: {
      inserted(el) {
        el.querySelector("input").focus();
      },
    },
  },
  setup() {
    const $baseConfirm = inject("$baseConfirm");

    const router = useRouter();

    const userStore = useUserStore();
    const { setUserToken, setNickname, getUserSig, getTenantId, getUserId, getUserLevel } =
      userStore;

    const state = reactive({
      registerFormRef: null,
      isGetPhone: false,
      timer: null,
      phoneCode: translate("获取验证码"),
      showRegister: false,
      form: {},
      step: 0,
      previewText: "",
      visitorId: getVisitorId(),
      codeUrl: "",
      isChangePone: false,
      termCheck: false,
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
      loading: false,
      passwordType: "password",
      rule: {
        company: [
          {
            required: true,
            trigger: "blur",
            message: translate("请输入用户名"),
          },
        ],
        industry: [
          {
            required: true,
            trigger: "blur",
            message: translate("请选择行业"),
          },
        ],
        email: [
          {
            required: true,
            trigger: "blur",
            message: translate("请输入邮箱"),
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
            message: translate("请输入手机号"),
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
        verificationCode: [
          {
            required: true,
            trigger: "blur",
            message: translate("请输入验证码"),
          },
        ],
        code: [
          {
            required: true,
            trigger: "blur",
            message: translate("请输入验证码"),
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
      if (!isPhone(state.form.phone)) {
        state["registerFormRef"].validateField("phone");
        return;
      }
      state.isGetPhone = true;
      let n = 60;
      state.timer = setInterval(() => {
        if (n > 0) {
          n--;
          state.phoneCode = `${translate("获取验证码 ") + n}s`;
        } else {
          clearInterval(state.timer);
          state.phoneCode = translate("获取验证码");
          state.timer = null;
          state.isGetPhone = false;
        }
      }, 1000);
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
            gp.$baseMessage(
              "请阅读并同意《智能在线客服系统服务条款》和《隐私政策》",
              "warning",
              "vab-hey-message-warning",
              false
            );
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
                    //  存用户的信息, 本地，vuex 都可以存储
                    setUserToken(data.token);
                    setNickname(data.username);
                    getUserSig(data.UserSig);
                    getTenantId(data.tenantId);
                    getUserId(data.userId);
                    getUserLevel(data.userLevel);
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
              console.log(e);
              state.loading = false;
            });

          break;

        default:
          router.push("/index");
          break;
      }
    };

    const changePhone = () => {
      state.step = 1;
      state.isChangePone = true;
    };

    const showTerm = (temp) => {
      if (temp) {
        gp.$baseMessage("查看隐私政策", "success", "vab-hey-message-success", false);
      } else {
        gp.$baseMessage("智能在线客服系统服务条款", "success", "vab-hey-message-success", false);
      }
    };

    onBeforeRouteLeave((to, from, next) => {
      clearInterval(state.timer);
      next();
    });

    return {
      translateTitle: translate,
      ...toRefs(state),
      getPhoneCode,
      sendPhoneCodeKey,
      changeCode,
      changePhone,
      showTerm,
      handleRegister,
    };
  },
});
</script>

<style lang="scss" scoped>
.register-container {
  height: 100vh;
  min-height: 700px;
  background: url("~@/assets/login_images/login_bg.png") center center fixed no-repeat;
  background-size: cover;

  .register-form {
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
      color: var(--el-color-white);
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .register-btn {
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

    .phone-code {
      position: absolute;
      top: 8px;
      right: 10px;
      width: 120px;
      height: 32px;
      font-size: 14px;
      color: #fff;
      cursor: pointer;
      user-select: none;
      border-radius: 3px;
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

  .code-tips {
    font-size: 14px;
    font-weight: bold;
    color: var(--el-color-primary);
  }

  .line-code {
    padding-top: 30px;
    text-align: center;
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
        line-height: 48px;
        border: 0;
      }

      &__suffix-inner {
        position: absolute;
        right: 15px;
        cursor: pointer;

        .el-input__count {
          position: absolute;
          top: 25px;
          right: 0;
        }
      }

      .el-input__password {
        margin-top: 15px;
      }
    }
    .el-select {
      .el-select__wrapper {
        height: 48px;
      }
    }

    .code {
      position: absolute;
      top: 4px;
      right: 4px;
      cursor: pointer;
      border-radius: $base-border-radius;
      .el-image__inner {
        height: 44px;
      }
    }
  }

  .el-step__title.is-process {
    color: var(--el-color-primary);
  }
}
</style>
