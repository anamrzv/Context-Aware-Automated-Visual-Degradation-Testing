<template>
  <section>
    <div class="hero fade-in" aria-label="Promotional hero">
      <h1 class="heading-em">Elevate Your Wardrobe.</h1>
      <p class="text-soft">
        Curated apparel & essentials. Static Vue prototype packed with
        components for vision testing.
      </p>
        <a href="#new" class="button button-large">Shop New</a>
        <a href="#sale" class="button button-accent button-large">View Sale</a>
        <a href="#collections" class="button button-outline button-large"
          >Collections</a
        >
      <div class="badge-stack">
        <span class="badge badge-new">New Season</span>
        <span class="badge badge-sale">Flash Sale</span>
      </div>
    </div>

    <div class="section" id="filters">
      <div class="component-header">
        <h2>Refine Picks</h2>
        <div class="actions">
          <button class="button button-small button-ghost">Reset</button
          ><button class="button button-small">Apply</button>
        </div>
      </div>
      <div class="filters-bar">
        <div class="filter-group">
          <span class="filter-title">Category</span>
          <div class="color-swatches">
            <div class="swatch" style="background: #222"></div>
            <div class="swatch" style="background: #c0392b"></div>
            <div class="swatch" style="background: #2980b9"></div>
          </div>
        </div>
        <div class="filter-group">
          <span class="filter-title">Sizes</span>
          <div class="inline-badge-row">
            <span class="badge">XS</span><span class="badge">S</span
            ><span class="badge">M</span><span class="badge">L</span>
          </div>
        </div>
        <div class="filter-group">
          <span class="filter-title">Highlights</span>
          <div class="inline-badge-row">
            <span class="badge badge-new">New</span
            ><span class="badge badge-sale">Sale</span
            ><span class="badge">Eco</span>
          </div>
        </div>
      </div>
    </div>

    <div class="section" id="collections">
      <div class="component-header">
        <h2>Featured Collections</h2>
        <div class="actions">
          <button class="button button-small button-outline">
            Explore All
          </button>
        </div>
      </div>
      <div class="banner-row">
        <div class="banner">
          <h3>Minimal Layers</h3>
          <p>Subtle palettes & structured basics.</p>
          <button class="button button-small button-ghost">View</button>
        </div>
        <div class="banner banner-accent">
          <h3>Street Essentials</h3>
          <p>Urban silhouettes & bold graphics.</p>
          <button class="button button-small button-ghost">View</button>
        </div>
        <div class="banner banner-outline">
          <h3>Seasonal Colorways</h3>
          <p>Transition styles with tonal depth.</p>
          <button class="button button-small">View</button>
        </div>
      </div>
    </div>

    <div class="section" id="new">
      <div class="component-header">
        <h2>New Arrivals</h2>
        <div class="actions">
          <button class="button button-small button-ghost">Prev</button
          ><button class="button button-small">Next</button>
        </div>
      </div>
      <div class="product-grid">
        <ProductCard v-for="p in products" :key="p.id" :product="p" />
      </div>
    </div>

    <div class="section" id="sale">
      <div
        class="banner"
        style="
          background: var(--color-accent);
          align-items: center;
          text-align: center;
        "
      >
        <h2 style="margin: 0">Seasonal Sale</h2>
        <div
          class="price-row"
          style="font-size: 2rem; font-weight: 700; justify-content: center"
        >
          Up to 60% off<span
            class="price-old"
            style="text-decoration: none"
          ></span>
        </div>
        <div style="display: flex; justify-content: center">
          <button
            class="button button-large"
            style="
              background: #fbbf24;
              color: #0c4a6e;
              font-weight: 700;
              box-shadow: 0 4px 12px rgba(251, 191, 36, 0.5);
              padding: 1rem 3rem;
              font-size: 1.1rem;
            "
          >
            Shop Sale
          </button>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="newsletter">
        <h2>Stay Updated</h2>
        <p class="text-soft">Visual-only subscription form.</p>
        <form action="#">
          <input class="input" placeholder="Email" /><button
            class="button button-accent"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  </section>
</template>
<script setup>
import { products } from "../data/products.js";
import ProductCard from "../components/ProductCard.vue";
</script>
