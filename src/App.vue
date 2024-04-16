<template>
  <div id="app">
    <!-- Navigation bar shown only if the user is authenticated -->
    <NavigationBar v-if="isAuthenticated" />
    <!-- Content container gets 'with-navbar' class if the navbar is present -->
    <div class="content-container" :class="{ 'with-navbar': isAuthenticated }">
      <router-view />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import NavigationBar from './components/NavigationBar.vue'; 
import router from './router';

export default {
  name: 'App',
  components: {
    NavigationBar 
  },
  setup() {
    const isAuthenticated = ref(false);

    onMounted(() => {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        isAuthenticated.value = !!user;
        if (user) {
          if (router.currentRoute.value.path === '/login') {
            router.push('/module-planning');
          }
        } else {
          if (router.currentRoute.value.path !== '/login') {
            router.push('/login');
          }
        }
      });
    });

    return {
      isAuthenticated
    };
  }
};
</script>

<style>
/* App container styles */
.app-container {
  display: flex; /* Use flexbox to position navigation and content */
}

/* Content container styles */
.content-container {
  flex-grow: 1; /* Content takes up the remaining space */
  overflow-x: hidden; /* Prevent horizontal scrolling */
  transition: padding-left 0.3s; /* Optional: Smooth transition for padding */
}

/* Apply padding only when navbar is present */
.content-container.with-navbar {
  padding-left: 280px; /* Same width as the navbar */
}

/* Responsive adjustments if needed */
@media (max-width: 768px) {
  row.justify-content-center {
    min-height: auto; /* Adjust for smaller screens */
  }
  .content-container,
  .content-container.with-navbar {
    padding-left: 0; /* On smaller screens, remove padding */
  }
}
</style>