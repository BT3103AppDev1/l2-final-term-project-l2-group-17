import { createRouter, createWebHistory } from 'vue-router';
import { auth } from './firebase';
import { getAuth } from 'firebase/auth';


import Login from './components/Login.vue';
import SignUp from './components/SignUp.vue';
import ForgotPassword from './components/ForgotPassword.vue';
import Logout from './components/Logout.vue';
import ModuleBox from './components/ModuleBox.vue';
import CommunityPage from './components/CommunityPage.vue';
import GPACalculator from './components/GpaCalc.vue';


const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login, meta: { hideNavbar: true } },
  { path: '/signup', component: SignUp, meta: { hideNavbar: true } },
  { path: '/forgot-password', component: ForgotPassword, meta: { hideNavbar: true } },
  { path: '/logout', component: Logout, meta: { requiresAuth: true } },
  { path: '/gpa-calculator', component: GPACalculator, meta: { requiresAuth: true }},
  { path: '/module-planning', component: ModuleBox, meta: { requiresAuth: true }},
  { path: '/community-page', component: CommunityPage, meta: { requiresAuth: true }},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const hideNavbar = to.matched.some(record => record.meta.hideNavbar);
  const auth = getAuth(); // Get the auth instance
  const isAuth = auth.currentUser; // Check if a user is signed in

  if (requiresAuth && !isAuth) {
    next('/login');
  } else if (hideNavbar && isAuth) {
    next('/module-planning');
  } else {
    next();
  }
});


export default router;

