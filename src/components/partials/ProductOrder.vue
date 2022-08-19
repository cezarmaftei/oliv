<script setup>
const getOrderProductExtras = (product) => {
  return product.meta_data.filter((meta) =>
    meta.key === "api_exoptions" ? meta.value : false
  );
};

defineProps({
  product: Object,
});
</script>

<template>
  <div class="d-flex">
    <figure>
      <img :src="product.image.src" />
    </figure>
    <div>
      <h3>{{ `${product.quantity} X ${product.name}` }}</h3>

      <div
        v-for="productExtra in getOrderProductExtras(product)"
        :key="productExtra"
      >
        <div v-for="extra in productExtra.value" :key="extra">
          {{ extra.name }} x {{ extra.value }}:
          <strong
            >{{ parseFloat(extra.value) * parseFloat(extra.price) }}lei</strong
          >
        </div>
      </div>
    </div>

    <div>{{ product.subtotal }}lei</div>
  </div>
</template>
