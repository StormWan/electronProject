<template>
  <div v-if="qrCodeUrl" class="flex flex_j_c-center">
    <img :src="qrCodeUrl" alt="QR Code" />
  </div>
</template>

<script>
import QRCode from "qrcode";

export default {
  data() {
    return {
      text: "测试",
      qrCodeUrl: "",
    };
  },
  mounted() {
    this.generateQRCode();
  },
  methods: {
    async generateQRCode() {
      try {
        const canvas = await QRCode.toCanvas(this.text);
        this.qrCodeUrl = canvas.toDataURL();
      } catch (error) {
        console.error("生成二维码失败：", error);
      }
    },
  },
};
</script>
