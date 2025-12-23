<template>
  <article class="product-card" :aria-labelledby="`prod-${product.id}-title`">
    <img class="product-thumb" :src="product.image" :alt="product.title" />
    <div class="badge-stack" v-if="product.badges">
      <span
        v-for="b in product.badges"
        :key="b"
        class="badge"
        :class="badgeClass(b)"
        >{{ b }}</span
      >
    </div>
    <div class="product-info">
      <h3 :id="`prod-${product.id}-title`" class="product-title">
        {{ product.title }}
      </h3>
      <div class="price-row">
        <span class="price">€{{ product.price }}</span>
        <span v-if="product.oldPrice" class="price-old"
          >€{{ product.oldPrice }}</span
        >
      </div>
      <div class="rating">
        <span>{{ product.rating }}</span
        ><span class="text-faint" style="margin-left: 0.3rem">(static)</span>
      </div>
    </div>
    <RouterLink class="button button-small w-100" :to="`/product/${product.id}`"
      >View</RouterLink
    >
  </article>
</template>
<script setup>
const props = defineProps({ product: { type: Object, required: true } });
function badgeClass(b) {
  return {
    "badge-sale": b === "Sale",
    "badge-new": b === "New",
  };
}
</script>
