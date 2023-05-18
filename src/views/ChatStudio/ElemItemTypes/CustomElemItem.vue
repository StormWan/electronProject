<template>
  <div class="message-view__item--text">{{ tip }}</div>
</template>

<script>
import { defineComponent, toRefs, reactive, onMounted, onBeforeUnmount } from "vue";
import { mapGetters, mapState, mapMutations, mapActions } from "vuex";
export default defineComponent({
  name: "CustomElemItem", // 自定义消息
  components: {},
  computed: {},
  props: {
    message: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {};
  },
  methods: {},
  setup(props, { attrs, emit, expose, slots }) {
    const state = reactive({ text: "wewe" });
    const { message } = toRefs(props);
    const { payload, nick } = message.value;
    let tip = "";
    const {
      data, // group_create
      description, // ""
      extension, // huangyk创建群组
    } = payload;
    switch (data) {
      case "group_create":
        tip = nick + "创建群组";
        break;
      default:
        tip = "未知消息";
        break;
    }
    onMounted(() => {});
    onBeforeUnmount(() => {});
    return {
      tip,
      nick,
      payload,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>
.message-view__item--text {
  width: fit-content;
  padding: 10px 14px;
  max-width: 360px;
  padding: 10px 14px;
  box-sizing: border-box;
  border-radius: 3px;
}
</style>
