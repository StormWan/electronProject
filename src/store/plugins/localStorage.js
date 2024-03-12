import storage from "@/utils/localforage/index";
import { USER_MODEL, USER_SETUP } from "@/store/constants";

const handlers = {
  UPDATE_USER_INFO: (state) => {
    storage.set(USER_MODEL, state.data);
  },
  UPDATE_USER_SETUP: (state) => {
    storage.set(USER_SETUP, state.settings);
  },
};

const handleMutation = (store) => {
  store.subscribe((mutation, state) => {
    const { payload, type } = mutation;
    handlers[type]?.(state);
  });
};

export default handleMutation;
