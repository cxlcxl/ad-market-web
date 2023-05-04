import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'vant/lib/index.css';
import { createRouter,createWebHistory} from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("./home.vue"),
    },
    {
      path: "/action",
      name: "PayAction",
      component: () => import("./pay.vue"),
    },
  ]
})

const app = createApp(App)
app.use(router).mount('#app')
