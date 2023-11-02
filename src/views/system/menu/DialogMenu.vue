<template>
  <el-dialog v-model="dialog" :title="'添加菜单'">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item :label="ruleFormText.title" prop="title" placeholder="请输入标题">
        <el-input v-model="ruleForm.title" autocomplete="off" />
      </el-form-item>
      <el-form-item :label="ruleFormText.path" prop="path" placeholder="请输入路径">
        <el-input v-model="ruleForm.path" />
      </el-form-item>
      <el-form-item :label="ruleFormText.component" prop="component" placeholder="请输入组件名">
        <el-input v-model="ruleForm.component" />
      </el-form-item>
      <el-form-item :label="ruleFormText.icon" prop="icon">
        <el-select
          v-model="ruleForm.icon"
          class="year"
          popper-class="style-select"
          placeholder="请选择图标"
        >
          <el-option
            class="dropdown"
            v-for="item in ElIcons"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          >
            <FontIcon :iconName="item.name" />
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="resetForm(ruleFormRef)"> 重置 </el-button>
        <el-button @click="setDialog(false)"> 取消 </el-button>
        <el-button type="primary" @click="determine(ruleFormRef)"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useStore } from "vuex";
import * as ElIcons from "@element-plus/icons-vue";
import { AddMenu } from "@/api/node-admin-api/index";
import { useBoolean } from "@/utils/hooks/index";
const { dispatch, commit } = useStore();
const ruleFormText = {
  title: "标题",
  path: "路径",
  component: "组件",
  icon: "图标",
};
const ruleFormRef = ref();
const [dialog, setDialog] = useBoolean();
// 校验规则
const rules = reactive({
  name: [{ required: true, message: "请输入标题", trigger: "blur" }],
  path: [{ required: true, message: "请输入路径", trigger: "blur" }],
  icon: [],
  component: [{ required: true, message: "请输入组件名", trigger: "blur" }],
});
// 新增菜单数据
const ruleForm = reactive({
  title: "测试",
  path: "/system",
  component: "System",
  icon: "Folder",
});
const openDialog = () => {
  setDialog(true);
};
const update = (menu) => {
  dispatch("updateRoute", menu);
};
// 新建菜单
const newlyAddeMenu = async () => {
  // const { icon, title, path } = data
  // 根目录ID
  let RootDir = "57c79357-0309-41b9-919a-253c3dfe6691";
  // 默认根目录新建 || 自选目录
  // const ID = state.checkedKeys;
  // if (ID?.length > 0 && showDelBtn.value) {
  //   RootDir = formLabelAlign.ID;
  // }
  const datas = await AddMenu({
    parentId: RootDir,
    path: ruleForm.path,
    title: ruleForm.title,
    icon: ruleForm.icon,
    componentName: "System",
  });
  datas && update(datas);
};
// 弹框确定按钮
const determine = (formEl) => {
  formEl.validate((valid) => {
    if (valid) {
      setDialog(false);
      newlyAddeMenu();
    } else {
      return false;
    }
  });
};
const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};
// eslint-disable-next-line no-undef
defineExpose({ openDialog });
</script>

<style lang="scss" scoped>
@import url(./index.scss);
</style>
