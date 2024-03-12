import storage from "@/utils/localforage/index";
export const REQUEST_TIMEOUT_MS = 6000;

export const StoreKey = {
  Access: "access-control",
};

export const OpenaiPath = {
  ChatPath: "v1/chat/completions",
  UsagePath: "dashboard/billing/usage",
  SubsPath: "dashboard/billing/subscription",
  ListModelPath: "v1/models",
};
// 默认配置
export const modelConfig = {
  model: "gpt-3.5-turbo",
  temperature: 0.6,
  top_p: 1,
  max_tokens: 1024,
  presence_penalty: 0,
  frequency_penalty: 0,
  token: process.env.VUE_APP_OPENAI_API_KEY,
  openaiUrl: process.env.VUE_APP_BASE_URL,
  historyMessageCount: 1,
  compressMessageLengthThreshold: 1000,
};

export function useAccessStore() {
  return storage.get(StoreKey.Access) || modelConfig;
}

export const DEFAULT_MODELS = [
  {
    name: "gpt-4",
    available: true,
  },
  {
    name: "gpt-4-0314",
    available: true,
  },
  {
    name: "gpt-4-0613",
    available: true,
  },
  {
    name: "gpt-4-32k",
    available: true,
  },
  {
    name: "gpt-4-32k-0314",
    available: true,
  },
  {
    name: "gpt-4-32k-0613",
    available: true,
  },
  {
    name: "gpt-3.5-turbo",
    available: true,
  },
  {
    name: "gpt-3.5-turbo-0301",
    available: true,
  },
  {
    name: "gpt-3.5-turbo-0613",
    available: true,
  },
  {
    name: "gpt-3.5-turbo-16k",
    available: true,
  },
  {
    name: "gpt-3.5-turbo-16k-0613",
    available: true,
  },
  {
    name: "qwen-v1", // 通义千问
    available: false,
  },
  {
    name: "ernie", // 文心一言
    available: false,
  },
  {
    name: "spark", // 讯飞星火
    available: false,
  },
  {
    name: "llama", // llama
    available: false,
  },
  {
    name: "chatglm", // chatglm-6b
    available: false,
  },
];

export const modelValue = {
  Model: {
    ID: "model",
    Title: "模型 (model)",
    SubTitle: "",
    defaultValue: "",
    options: DEFAULT_MODELS,
  },
  OpenaiUrl: {
    ID: "openaiUrl",
    Title: "接口地址",
    SubTitle: "除默认地址外，必须包含 http(s)://",
    Placeholder: "https://api.openai.com",
    defaultValue: "",
    password: true,
  },
  Token: {
    ID: "token",
    Title: "API Key",
    SubTitle: "使用自己的 OpenAI API Key",
    Placeholder: "OpenAI API Key",
    defaultValue: "",
    password: true,
  },
  Temperature: {
    ID: "temperature",
    Title: "随机性 (temperature)",
    SubTitle: "值越大，回复越随机",
    defaultValue: "",
    Range: true,
    step: 0.1,
    min: 0,
    max: 1,
  },
  TopP: {
    ID: "top_p",
    Title: "核采样 (top_p)",
    SubTitle: "与随机性类似，但不要和随机性一起更改",
    defaultValue: "",
    Range: true,
    step: 0.1,
    min: 0,
    max: 1,
  },
  // MaxTokens: {
  //   ID: "max_tokens",
  //   Title: "单次回复限制 (max_tokens)",
  //   SubTitle: "单次交互所用的最大 Token 数",
  //   defaultValue: "",
  //   Number: true,
  //   min: 1024,
  //   max: 512000,
  // },
  PresencePenalty: {
    ID: "presence_penalty",
    Title: "话题新鲜度 (presence_penalty)",
    SubTitle: "值越大，越有可能扩展到新话题",
    defaultValue: "",
    Range: true,
    step: 0.1,
    min: 0,
    max: 2,
  },
  FrequencyPenalty: {
    ID: "frequency_penalty",
    Title: "频率惩罚度 (frequency_penalty)",
    SubTitle: "值越大，越有可能降低重复字词",
    defaultValue: "",
    Range: true,
    step: 0.1,
    min: 0,
    max: 2,
  },
  historyMessageCount: {
    ID: "historyMessageCount",
    Title: "附带历史消息数",
    SubTitle: "每次请求携带的历史消息数",
    defaultValue: "",
    Range: true,
    step: 1,
    min: 1,
    max: 24,
  },
};
