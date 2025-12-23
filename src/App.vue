<template>
  <div class="app-root">
    <header class="navbar">
      <div class="nav-logo">
        <strong>ShopStyle</strong><span class="badge badge-new">BETA</span>
      </div>
      <nav class="nav-menu" aria-label="Primary navigation">
        <RouterLink
          class="nav-link"
          :class="{ 'nav-link-active': isActive('/') }"
          to="/"
          >Home</RouterLink
        >
        <RouterLink
          class="nav-link"
          :class="{ 'nav-link-active': isActive('/product/1') }"
          to="/product/1"
          >Product</RouterLink
        >
        <RouterLink
          class="nav-link"
          :class="{ 'nav-link-active': isActive('/cart') }"
          to="/cart"
          >Cart</RouterLink
        >
        <RouterLink
          class="nav-link"
          :class="{ 'nav-link-active': isActive('/profile') }"
          to="/profile"
          >Profile</RouterLink
        >
      </nav>
      <div class="search-bar" role="search" aria-label="Site search">
        <svg
          class="icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search products"
          aria-label="Search products"
        />
      </div>
      <div class="inline-area">
        <button class="button button-ghost button-small" @click="toggleTheme">
          Theme
        </button>
        <button class="button button-outline button-small">Sign In</button>
        <button class="button button-accent button-small">Join</button>
      </div>
    </header>
    <main class="container main-content">
      <RouterView />
    </main>
    <footer class="footer" aria-label="Site footer">
      <div class="container footer-grid">
        <div class="footer-col">
          <h4>Company</h4>
          <a href="#">About</a>
          <a href="#">Careers</a>
          <a href="#">Press</a>
          <a href="#">Sustainability</a>
        </div>
        <div class="footer-col">
          <h4>Help</h4>
          <a href="#">Support</a>
          <a href="#">Orders</a>
          <a href="#">Returns</a>
          <a href="#">Contact</a>
        </div>
        <div class="footer-col">
          <h4>Explore</h4>
          <a href="#">Lookbook</a>
          <a href="#">Blog</a>
          <a href="#">Affiliates</a>
          <a href="#">Community</a>
        </div>
        <div class="footer-col">
          <h4>Legal</h4>
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
          <a href="#">Cookies</a>
          <a href="#">Licenses</a>
        </div>
      </div>
    </footer>
    <div class="floating-action">
      <div class="fab" aria-label="Floating action button">+</div>
      <div class="fab secondary" aria-label="Secondary action">?</div>
    </div>
  </div>
</template>
<script setup>
import { useRoute } from "vue-router";
const route = useRoute();
function isActive(path) {
  return route.path === path;
}
function toggleTheme() {
  const body = document.body;
  body.dataset.theme = body.dataset.theme === "light" ? "dark" : "light";
}
</script>
<style scoped>
.app-root {
  position: relative;
}
</style>
