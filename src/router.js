import { createRouter, createWebHistory } from "vue-router";
import Home from "./pages/Home.vue";
import Product from "./pages/Product.vue";
import Cart from "./pages/Cart.vue";
import Profile from "./pages/Profile.vue";

const routes = [
  { path: "/", name: "home", component: Home },
  { path: "/product/:id", name: "product", component: Product, props: true },
  { path: "/cart", name: "cart", component: Cart },
  { path: "/profile", name: "profile", component: Profile },
];

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});
