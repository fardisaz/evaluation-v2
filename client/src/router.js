import { createRouter, createWebHistory } from "vue-router";
import Evaluation from "./pages/Evaluation.vue";
import NotFound from "./pages/NotFound.vue";
import ImportIdeas from "./pages/ImportIdeas";
import Login from "./pages/Login.vue";
import Register from "./pages/Register.vue";
const router = createRouter({
  history: createWebHistory(),
  routes: [
    // { path: '/', redirect: '/import' },
    { path: "/register", component: Register },
    { path: "/login", component: Login },
    { path: "/import", component: ImportIdeas },
    { path: "/evaluation", component: Evaluation },

    { path: "/:notFound(.*)", component: NotFound },
  ],
});

export default router;
