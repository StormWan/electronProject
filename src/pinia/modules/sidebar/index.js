import { nextTick } from "vue";
import { defineStore } from "pinia";
const { production } = require("@/config/vue.custom.config");

export const useSidebarStore = defineStore("sidebar-store", {
  state: () => ({}),
  getters: {},
  actions: {},
});
