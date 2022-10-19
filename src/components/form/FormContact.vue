<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { ref } from "vue";
import { sendFormDataToWP } from "@/api";
import ErrorContact from "../error/ErrorContact.vue";

defineProps(["contentBottom", "buttonText"]);

const store = useOlivStore();

const formData = ref({
  name: "",
  email: "",
  email_check: "",
  message: "",
});

const form = ref(false);
const formError = ref(false);
// For styling
// formError.value =
//   "A aparut o problema la trimiterea mesajului. Te rugam sa reincerci in cateva minute.";

const sendFormData = async () => {
  for (const [fieldName, fieldValue] of Object.entries(formData.value)) {
    if (fieldName !== "email_check" && fieldValue.length < 1) {
      formError.value = "Toate campurile sunt obligatorii!";
      return false;
    }

    if (fieldName === "email" && !store.validateEmail(fieldValue)) {
      formError.value = "Te rugam sa introduci o adresa de email valida";
      return false;
    }

    // Honeypot
    if (fieldName === "email_check" && fieldValue.length > 0) return false;
  }

  formError.value = false;

  // Create form data
  const WPFormData = new FormData(form.value);
  WPFormData.append("name", JSON.stringify(formData.value.name));
  WPFormData.append("email", JSON.stringify(formData.value.email));
  WPFormData.append("message", JSON.stringify(formData.value.message));
  // for (const value of WPFormData.values()) {
  //   console.log(value);
  // }
  const emailResult = await sendFormDataToWP(WPFormData).then(
    (data) => data.data
  );

  if (emailResult === true) {
    form.value.reset();
  } else {
    formError.value =
      "A aparut o problema la trimiterea mesajului. Te rugam sa reincerci in cateva minute.";
  }
};
</script>
<template>
  <form ref="form" @submit.prevent="sendFormData()">
    <ErrorContact v-if="formError" :error="formError" />

    <div class="form-group row g-0">
      <div class="col-12 col-sm-6">
        <input
          name="client-name"
          type="text"
          class="form-control first"
          placeholder="Numele tau"
          v-model="formData.name"
          required
        />
      </div>
      <div class="col-12 col-sm-6">
        <input
          name="client-email"
          type="email"
          class="form-control"
          placeholder="email"
          v-model="formData.email"
          required
        />
        <input
          name="client-email-check"
          type="text"
          class="form-control check"
          placeholder="email check"
          v-model="formData.email_check"
        />
      </div>
      <div class="col-12">
        <textarea
          class="form-control"
          name="client-message"
          placeholder="Mesaj"
          v-model="formData.message"
          required
        ></textarea>
      </div>
    </div>

    <div v-html="contentBottom"></div>

    <button type="submit" class="btn btn-primary reverse">
      {{ buttonText }}
    </button>
  </form>
</template>
<style scoped lang="scss">
.check {
  display: none;
}
input.form-control {
  &:not(.first) {
    border-top: 0;
  }
}
textarea.form-control {
  border-top: 0;
}

.btn {
  width: auto !important;
}

@include media-breakpoint-up(sm) {
  input.form-control {
    &:not(.first) {
      border-top: 2px solid $border-color;
    }

    &.first {
      border-right: 0;
    }
  }
}
</style>
