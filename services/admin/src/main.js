import { createApp } from "vue";
import { createPinia } from "pinia";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "sweetalert2/dist/sweetalert2.min.css";
import App from "./App.vue";
import router from "./router";
import { useUiStore } from "./stores/ui";
import "./styles/theme.css";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);

useUiStore(pinia).initializeTheme();

app.mount("#app");
