import { useAccessStore } from "@/api/openai/constant";
export default {
  state: {
    model: useAccessStore()?.model,
  },
  mutations: {
    setModel(state, value) {
      state.model = value;
    },
  },
};
