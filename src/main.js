import { createApp } from "vue";
import App from "./App.vue";
import router from "./router.js";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/components.css";
import "./styles/theme.css";

createApp(App).use(router).mount("#app");
