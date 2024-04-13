<template>
  <div id="app" class="app-container">
    <NavigationBar v-if="showNavbar" />
    <div class="content-container">
      <router-view />
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import NavigationBar from './components/NavigationBar.vue';

export default {
  name: "App",
  components: {
    NavigationBar
  },
  setup() {
    const route = useRoute();
    const noNavbarPaths = ['/login', '/signup', '/forgot-password'];
    const showNavbar = computed(() => !noNavbarPaths.includes(route.path));

    return {
      showNavbar
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
}
</style>
