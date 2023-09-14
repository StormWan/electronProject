import storage from "storejs";
import { USER_DATA, SET_UP } from "@/store/mutation-types";

const handlers = {
  UPDATE_USER_INFO: (state) => {
    storage.set(USER_DATA, state.data);
  },
  UPDATE_USER_SETUP: (state) => {
    storage.set(SET_UP, state.settings);
  },
};

const handleMutation = (store) => {
  store.subscribe((mutation, state) => {
    const { payload, type } = mutation;
    handlers[type]?.(state);
  });
};

export default handleMutation;
