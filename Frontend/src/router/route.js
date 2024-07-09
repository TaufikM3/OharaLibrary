import Vue from "vue";
import VueRouter from "vue-router";
import home from "../views/Home.vue";
import dashboard from "../views/Dashboard";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: home,
  },

  {
    path: "/dashboard",
    name: "dashboard",
    component: dashboard,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
