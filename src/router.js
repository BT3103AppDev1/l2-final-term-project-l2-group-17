import { createRouter, createWebHistory } from 'vue-router';
import Login from './components/Login.vue';
import SignUp from './components/SignUp.vue';
import ForgotPassword from './views/ForgotPassword.vue';
import Logout from './components/Logout.vue';
import GpaCalc from './components/GpaCalc.vue';
// import Home from './views/Home.vue';

const routes = [
  // { path: '/', component: Home },
  { path: '/', redirect : '/login'},
  { path: '/login', component: Login, alias: '/' },
  { path: '/signup', component: SignUp },
  { path: '/forgot-password', component: ForgotPassword },
  { path: '/logout', component: Logout},
  { path: '/gpacalc', component: GpaCalc}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
