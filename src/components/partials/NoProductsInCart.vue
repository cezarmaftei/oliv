<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const dismissBtn = ref(false);
const router = useRouter();

const showMenu = () => {
  dismissBtn.value.click();
  router.push("/");
};
</script>
<template>
  <p>
    Nu ai nici un produs in cos. <br /><br />
    <button class="btn btn-outline-dark reverse" @click="showMenu">
      Vezi meniul
    </button>
    <button
      class="d-none"
      data-bs-dismiss="offcanvas"
      ref="dismissBtn"
    ></button>
  </p>
</template>
