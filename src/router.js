import { createRouter, createWebHistory } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';


import Login from './components/Login.vue';
import SignUp from './components/SignUp.vue';
import ForgotPassword from './components/ForgotPassword.vue';
import Logout from './components/Logout.vue'; 
import ModuleBox from './components/ModuleBox.vue';
import CommunityPage from './components/CommunityPage.vue';
import GPACalculator from './components/GpaCalc.vue';
import Profile from './components/Profile.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/signup', component: SignUp },
  { path: '/forgot-password', component: ForgotPassword},
  { path: '/logout', component: Logout, meta: { requiresAuth: true } },
  { path: '/gpa-calculator', component: GPACalculator, meta: { requiresAuth: true }}, 
  { path: '/module-planning', component: ModuleBox, meta: { requiresAuth: true }},
  { path: '/community-page', component: CommunityPage, meta: { requiresAuth: true }},
  { path: '/profile', component: Profile, meta: { requiresAuth: true }},

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = await getAuthState();

  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

function getAuthState() {
  return new Promise(resolve => {
    const auth = getAuth();
    onAuthStateChanged(auth, user => {
      resolve(!!user);
    });
  });
}


export default router;

