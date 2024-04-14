<template>
  <div id="app" class="container">
    <ModulePlanningHeader />
    <ModuleBox />
  </div>
</template>

<script>
import ModuleBox from "./components/ModuleBox.vue";
import ModulePlanningHeader from "./components/ModulePlanningHeader.vue";


export default {
  name: "App",
  components: {
    ModuleBox,
    ModulePlanningHeader,
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
  overflow-x: hidden; /* Prevent horizontal scrolling */
  transition: padding-left 0.3s; /* Optional: Smooth transition for padding */
}

/* Apply padding only when navbar is present */
.content-container.with-navbar {
  padding-left: 280px; /* Same width as the navbar */
}

/* Responsive adjustments if needed */
@media (max-width: 768px) {
  .content-container,
  .content-container.with-navbar {
    padding-left: 0; /* On smaller screens, remove padding */
  }
}
</style>