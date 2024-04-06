import { createRouter, createWebHistory } from 'vue-router';
import Login from './components/Login.vue';
import SignUp from './components/SignUp.vue';
import ForgotPassword from './views/ForgotPassword.vue';
import Logout from './components/Logout.vue';
import ModuleBox from './components/ModuleBox.vue';
// import Home from './views/Home.vue';

const routes = [
  // { path: '/', component: Home },
  { path: '/', redirect : '/login'}, 
  { path: '/login', component: Login, alias: '/' },
  { path: '/signup', component: SignUp },
  { path: '/forgot-password', component: ForgotPassword },
  { path: '/logout', component: Logout},
  { path: '/moduleplanning', component: ModuleBox }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
