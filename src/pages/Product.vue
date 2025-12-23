<template>
  <section>
    <div class="page-header">
      <h1>{{ product?.title || "Product" }}</h1>
    </div>
    <div class="product-detail">
      <div>
        <div class="card" style="padding: 0">
          <img
            :src="product?.image"
            :alt="product?.title"
            class="product-thumb"
            style="
              width: 100%;
              aspect-ratio: 4/5;
              object-fit: cover;
              border-radius: var(--radius-l);
            "
          />
        </div>
        <div class="mt">
          <div
            class="card"
            style="
              font-size: 0.75rem;
              display: flex;
              flex-direction: column;
              gap: 0.75rem;
            "
          >
            <div class="component-header">
              <h3 style="margin: 0">Reviews</h3>
              <div class="actions">
                <button class="button button-small button-outline">
                  Write Review
                </button>
              </div>
            </div>
            <div class="review-item" style="display: flex; gap: 0.6rem">
              <div
                class="avatar"
                style="
                  width: 36px;
                  height: 36px;
                  border-radius: 50%;
                  background: var(--color-surface-alt);
                "
              ></div>
              <div style="flex: 1">
                <div
                  style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                  "
                >
                  <strong style="font-size: 0.8rem">Alexandra</strong>
                  <span class="rating">★★★★★</span>
                </div>
                <p
                  class="text-soft"
                  style="margin: 0.25rem 0 0; font-size: 0.75rem"
                >
                  Great fit and fabric quality. Holds shape after wash.
                </p>
                <div class="inline-note" style="font-size: 0.65rem">
                  Size M • Color Navy • 3 days ago
                </div>
              </div>
            </div>
            <div class="review-item" style="display: flex; gap: 0.6rem">
              <div
                class="avatar"
                style="
                  width: 36px;
                  height: 36px;
                  border-radius: 50%;
                  background: var(--color-surface-alt);
                "
              ></div>
              <div style="flex: 1">
                <div
                  style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                  "
                >
                  <strong style="font-size: 0.8rem">Maksim</strong>
                  <span class="rating">★★★★☆</span>
                </div>
                <p
                  class="text-soft"
                  style="margin: 0.25rem 0 0; font-size: 0.75rem"
                >
                  Comfortable everyday piece. Slightly longer than expected.
                </p>
                <div class="inline-note" style="font-size: 0.65rem">
                  Size L • Color Black • 1 week ago
                </div>
              </div>
            </div>
            <div class="review-item" style="display: flex; gap: 0.6rem">
              <div
                class="avatar"
                style="
                  width: 36px;
                  height: 36px;
                  border-radius: 50%;
                  background: var(--color-surface-alt);
                "
              ></div>
              <div style="flex: 1">
                <div
                  style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                  "
                >
                  <strong style="font-size: 0.8rem">Sara</strong>
                  <span class="rating">★★★☆☆</span>
                </div>
                <p
                  class="text-soft"
                  style="margin: 0.25rem 0 0; font-size: 0.75rem"
                >
                  Color is beautiful, fabric slightly thin for winter.
                </p>
                <div class="inline-note" style="font-size: 0.65rem">
                  Size S • Color Olive • 2 weeks ago
                </div>
              </div>
            </div>
            <div style="display: flex; gap: 0.5rem">
              <button class="button button-small button-ghost">See all</button>
              <button class="button button-small">Load more</button>
            </div>
          </div>
        </div>
      </div>
      <aside class="sticky-panel">
        <div class="card">
          <div class="badge-stack" v-if="product?.badges">
            <span
              v-for="b in product.badges"
              :key="b"
              class="badge"
              :class="badgeClass(b)"
              >{{ b }}</span
            >
          </div>
          <h2 style="margin: 0">
            €{{ product?.price }}
            <span v-if="product?.oldPrice" class="price-old"
              >€{{ product.oldPrice }}</span
            >
          </h2>
          <div class="rating">
            <span>{{ product?.rating }}</span
            ><span class="text-faint">(static)</span>
          </div>
          <div
            style="
              display: flex;
              flex-direction: column;
              gap: 0.6rem;
              margin-top: 0.4rem;
            "
          >
            <div
              class="surface"
              style="padding: 0.75rem; border-radius: var(--radius-m)"
            >
              <h3 style="margin: 0; font-size: 0.9rem">Description</h3>
              <p
                class="text-soft"
                style="font-size: 0.8rem; margin: 0.35rem 0 0"
              >
                Breathable cotton crew with a structured collar and refined
                silhouette. Soft-hand feel with durable stitching for everyday
                wear.
              </p>
              <div
                style="
                  display: flex;
                  gap: 0.4rem;
                  flex-wrap: wrap;
                  margin-top: 0.6rem;
                "
              >
                <span class="badge">Soft Touch</span>
                <span class="badge">Durable</span>
                <span class="badge">Everyday</span>
              </div>
            </div>
            <div
              class="surface"
              style="padding: 0.75rem; border-radius: var(--radius-m)"
            >
              <h3 style="margin: 0; font-size: 0.9rem">Highlights</h3>
              <ul
                style="
                  margin: 0.5rem 0 0;
                  padding-left: 1rem;
                  list-style: disc;
                  color: var(--color-text-soft);
                  font-size: 0.8rem;
                "
              >
                <li>Premium 100% cotton jersey</li>
                <li>Reinforced rib-knit collar</li>
                <li>Classic, relaxed fit</li>
              </ul>
            </div>
          </div>
          <div class="inline-area mt-s">
            <button class="button button-accent grow">Add to Cart</button>
            <button class="button button-ghost button-small">Fav</button>
          </div>
        </div>
        <div class="card surface" style="padding: 1rem">
          <h3 style="margin: 0; font-size: 0.9rem">Specifications</h3>
          <div
            style="
              display: grid;
              gap: 0.75rem;
              grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            "
            class="mt-s"
          >
            <div
              class="feature"
              style="display: flex; flex-direction: column; gap: 0.2rem"
            >
              <span
                class="feature-title"
                style="
                  font-weight: 600;
                  font-size: 0.8rem;
                  color: var(--color-text-soft);
                "
                >Fabric Weight</span
              >
              <span style="font-size: 0.8rem">180gsm mid-weight jersey.</span>
            </div>
            <div
              class="feature"
              style="display: flex; flex-direction: column; gap: 0.2rem"
            >
              <span
                class="feature-title"
                style="
                  font-weight: 600;
                  font-size: 0.8rem;
                  color: var(--color-text-soft);
                "
                >Care</span
              >
              <span style="font-size: 0.8rem">Machine wash cold.</span>
            </div>
            <div
              class="feature"
              style="display: flex; flex-direction: column; gap: 0.2rem"
            >
              <span
                class="feature-title"
                style="
                  font-weight: 600;
                  font-size: 0.8rem;
                  color: var(--color-text-soft);
                "
                >Hem</span
              >
              <span style="font-size: 0.8rem">Double stitched lower.</span>
            </div>
            <div
              class="feature"
              style="display: flex; flex-direction: column; gap: 0.2rem"
            >
              <span
                class="feature-title"
                style="
                  font-weight: 600;
                  font-size: 0.8rem;
                  color: var(--color-text-soft);
                "
                >Collar</span
              >
              <span style="font-size: 0.8rem">Reinforced rib knit.</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
    <hr />
    <section>
      <div class="component-header"><h2>Related Products</h2></div>
      <div class="related-grid">
        <div v-for="r in related" :key="r.id" class="wishlist-item">
          <img :src="r.image" :alt="r.title" />
          <strong style="font-size: 0.7rem">{{ r.title }}</strong>
          <span class="price">€{{ r.price }}</span>
        </div>
      </div>
    </section>
  </section>
</template>
<script setup>
import { products } from "../data/products.js";
import { computed } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const id = Number(route.params.id);
const product = computed(() => products.find((p) => p.id === id));
const related = computed(() => products.filter((p) => p.id !== id).slice(0, 4));
function badgeClass(b) {
  return { "badge-sale": b === "Sale", "badge-new": b === "New" };
}
</script>
