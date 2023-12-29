<template>
  <div class="loading fixed-center flex-col">
    <div class="showMore bouncing-loader">
      <div v-for="item in 3" :key="item"></div>
    </div>
    <h2 class="title">PureAdmin管理系统</h2>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.loading {
  color: #999;
}
.title {
  font-weight: 500;
  font-size: 28px;
  margin: 15px 0;
}

.showMore {
  padding-top: 12px;
  text-align: center;
  font-size: 12px;
  cursor: pointer;
  color: var(--color-time-divider);
}

.bouncing-loader {
  display: flex;
  justify-content: center;
}

@keyframes bouncing-loader {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0.1;
    transform: translateY(-1rem);
  }
}
.bouncing-loader > div {
  width: 8px;
  height: 8px;
  margin: 0 3px;
  background: #8385aa;
  border-radius: 50%;
  animation: bouncing-loader 0.6s infinite alternate;
}
.bouncing-loader > div:nth-child(2) {
  animation-delay: 0.2s;
}
.bouncing-loader > div:nth-child(3) {
  animation-delay: 0.4s;
}
</style>
