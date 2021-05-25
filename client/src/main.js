import { createApp } from "vue";
import router from "./router.js";
import App from "./App.vue";
import store from "./store.js";
import axios from "axios";

const app = createApp(App);
app.config.globalProperties.$http = axios;
//load the token from the local storage
const token = localStorage.getItem("token");
// if there is any token then we will simply append default axios authorization headers
if (token) {
  app.config.globalProperties.$http.defaults.headers.common[
    "Authorization"
  ] = token;
}
app.use(router);
app.use(store);

app.mount("#app");
