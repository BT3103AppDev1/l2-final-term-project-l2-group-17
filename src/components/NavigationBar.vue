<template>
    <div class="d-flex flex-column flex-shrink-0 p-3 bg-light" style="width: 280px; height: 100vh;">
      <!-- Navbar brand/logo -->
      <router-link to="/home" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
        <img src="@/assets/modunus_logo.jpeg" alt="Modunus Logo" class="brand-logo">
      </router-link>
  
      <!-- Navbar links -->
      <hr>
      <ul class="nav nav-pills flex-column mb-auto">
        <li class="nav-item">
          <router-link to="/home" class="nav-link" aria-current="page">
            <i class="bi bi-house-door-fill"></i>
            Home
          </router-link>
        </li>
        <li>
          <router-link to="/module-planning" class="nav-link">
            <i class="bi bi-journal-bookmark-fill"></i>
            Planner
          </router-link>
        </li>
        <li>
          <router-link to="/modules" class="nav-link">
            <i class="bi bi-grid-fill"></i>
            Modules
          </router-link>
        </li>
        <li>
          <router-link to="/community-page" class="nav-link">
            <i class="bi bi-people-fill"></i>
            Community
          </router-link>
        </li>
        <li>
          <router-link to="/gpa-calculator" class="nav-link">
            <i class="bi bi-calculator-fill"></i>
            GPA Calculator
          </router-link>
        </li>
      </ul>
      <hr>
      <div class="dropdown">
        <a href="#" class="d-flex align-items-center link-dark text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
          <img src="" alt="" width="32" height="32" class="rounded-circle me-2">
          <strong>More</strong>
        </a>
        <ul class="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
          <li><a class="dropdown-item" href="#">Profile</a></li>
          <li><a class="dropdown-item" href="#">My Posts</a></li>
          <li><a class="dropdown-item" href="#">Liked Posts</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><router-link class="dropdown-item" to="/logout" @click="handleLogout">Sign out</router-link></li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
    import { getAuth, signOut } from 'firebase/auth';
  
    export default {
      name: 'NavigationBar',
      methods: {
        async handleLogout() {
          try {
            const auth = getAuth();
            await signOut(auth);
            this.$router.push('/login'); // Redirect user to the login page
          } catch (error) {
            console.error('Logout Failed', error);
          }
        }
      }
    };
  </script>
  
  <style scoped>
  /* Custom styles for navbar */
  .bg-light {
    background-color: #e3f2fd !important; /* Replace with your desired color */
  }
  
  /* Active link styling */
  .nav-link.router-link-active {
    background-color: #0d6efd; /* Bootstrap primary color for example */
    color: white !important;
  }
.brand-logo {
  cursor: pointer;
}
  
  /* Ensure no margin or padding is above the logo */
  a.d-flex {
    padding-top: 0;
    margin-top: 0;
    align-items: flex-start; /* Align items to the start of the container */
  }
  
  /* Adjust image size if necessary and remove any default margins */
  img {
    max-width: 100%; /* Ensure image is not bigger than its container */
    height: auto; /* Maintain aspect ratio */
    margin: 0; /* Remove default margins */
  }
  
  /* You can add more custom styles if needed */
  </style>
  
  