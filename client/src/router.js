import { createRouter, createWebHistory } from "vue-router";
import Evaluation from "./pages/Evaluation.vue";
import NotFound from "./pages/NotFound.vue";
import ImportIdeas from "./pages/ImportIdeas";
import Login from "./pages/Login.vue";
import Register from "./pages/Register.vue";
import Home from "./pages/Home.vue";
import AutomaticEval from "./pages/AutomaticEval.vue";

import store from "./store";
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Home,
    },
    {
      path: "/register",
      component: Register,
      meta: {
        requiresGuest: true,
      },
    },
    {
      path: "/login",
      component: Login,
      meta: {
        requiresGuest: true,
      },
    },
    {
      path: "/import",
      component: ImportIdeas,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/evaluation",
      component: Evaluation,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/automaticEvaluation",
      component: AutomaticEval,
      meta: {
        requiresAuth: true,
      },
    },

    { path: "/:notFound(.*)", component: NotFound },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!store.getters.isLoggedIn) {
      //Redirect to the login page
      next("/login");
    } else {
      next();
    }
  } else if (to.matched.some((record) => record.meta.requiresGuest)) {
    if (store.getters.isLoggedIn) {
      //Redirect to the evaluation page
      next("/import");
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
