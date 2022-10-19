<script setup>
import { useOlivStore } from "@/stores/oliv.js";
const store = useOlivStore();
</script>
<template>
  <div
    class="store-update-overlay align-items-center justify-content-center"
    v-if="!store.isLoaded || store.storeLiveUpdate"
  >
    <!-- Safari and others -->
    <div class="infinity">
      <div>
        <span></span>
      </div>
      <div>
        <span></span>
      </div>
      <div>
        <span></span>
      </div>
    </div>

    <!-- Stuff -->
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="display: none">
      <defs>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
            result="goo"
          />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
    </svg>
  </div>
</template>

<style scoped lang="scss">
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

$color: $olive;
$colorRight: $red;
$colorLeft: $yellow;

.infinity {
  width: 120px;
  height: 60px;
  position: relative;
  div,
  span {
    position: absolute;
  }
  div {
    top: 0;
    left: 50%;
    width: 60px;
    height: 60px;
    animation: rotate 6.9s linear infinite;
    span {
      left: -8px;
      top: 50%;
      margin: -8px 0 0 0;
      width: 16px;
      height: 16px;
      display: block;
      background: $color;
      box-shadow: 2px 2px 8px rgba($color, 0.09);
      border-radius: 50%;
      transform: rotate(90deg);
      animation: move 6.9s linear infinite;
      &:before,
      &:after {
        content: "";
        position: absolute;
        display: block;
        border-radius: 50%;
        width: 14px;
        height: 14px;
        background: inherit;
        top: 50%;
        left: 50%;
        margin: -7px 0 0 -7px;
        box-shadow: inherit;
      }
      &:before {
        animation: drop1 0.8s linear infinite;
      }
      &:after {
        animation: drop2 0.8s linear infinite 0.4s;
      }
    }
    &:nth-child(2) {
      animation-delay: -2.3s;
      span {
        animation-delay: -2.3s;
      }
    }
    &:nth-child(3) {
      animation-delay: -4.6s;
      span {
        animation-delay: -4.6s;
      }
    }
  }
}

@keyframes moveSvg {
  0% {
    offset-distance: 0%;
  }
  25% {
    background: $colorRight;
  }
  75% {
    background: $colorLeft;
  }
  100% {
    offset-distance: 100%;
  }
}

@keyframes rotate {
  50% {
    transform: rotate(360deg);
    margin-left: 0;
  }
  50.0001%,
  100% {
    margin-left: -60px;
  }
}

@keyframes move {
  0%,
  50% {
    left: -8px;
  }
  25% {
    background: $colorRight;
  }
  75% {
    background: $colorLeft;
  }
  50.0001%,
  100% {
    left: auto;
    right: -8px;
  }
}

@keyframes drop1 {
  100% {
    transform: translate(32px, 8px) scale(0);
  }
}

@keyframes drop2 {
  0% {
    transform: translate(0, 0) scale(0.9);
  }
  100% {
    transform: translate(32px, -8px) scale(0);
  }
}
</style>
