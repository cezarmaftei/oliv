<script setup>
import { useOlivStore } from "@/stores/oliv.js";
const store = useOlivStore();
</script>
<template>
  <transition name="fade-out-element">
    <div
      class="store-update-overlay align-items-center justify-content-center"
      v-if="!store.isLoaded || store.storeLiveUpdate"
    >
      <svg
        class="logo-leaf-loading d-block"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 7.6 16.1"
      >
        <path
          d="M6.9,0S-3.92,3.27,1.53,16.1c0,0,8.51-5.26,5.37-16.1M2.36,13.28c-3-4.39,1.42-9.67,2.9-11.23.27-.29.45-.45.45-.45C1.25,9,2.36,13.28,2.36,13.28"
          style="fill: #abc843"
        />
      </svg>
    </div>
  </transition>
</template>

<style scoped lang="scss">
.fade-out-element-enter-active,
.fade-out-element-leave-active {
  transition: opacity 0.25s ease;
}
.fade-out-element-enter-to,
.fade-out-element-leave-from {
  opacity: 1;
}

.fade-out-element-enter-from,
.fade-out-element-leave-to {
  opacity: 0;
}
.store-update-overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 10000;
  left: 0;
  top: 0;
  background: rgba($white, 0.8);
  display: flex;
}

.logo-leaf-loading {
  width: 50px;
  height: auto;
  transform: scale(1);
  animation: pulse 3s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  70% {
    transform: scale(1.3);
  }

  100% {
    transform: scale(1);
  }
}
</style>
