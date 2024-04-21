<template>
  <div class="navbar-fixed">
    <!-- Navbar brand/logo -->
    <router-link to="/module-planning" class="navbar-brand">
      <img src="@/assets/modunus_logo.png" alt="Modunus Logo" class="brand-logo">
    </router-link>
    <div v-if="user" class="welcome-message">{{ welcomeMessage }}</div>
  
    <!-- Navbar links -->
    <nav class="nav-menu">
      <div class="nav-section-title">DASHBOARD</div>
      <div class="nav-section dashboard">
        <router-link to="/module-planning" class="nav-item" :class="{ active: isRouteActive('/module-planning') }">
          <font-awesome-icon icon="clipboard-list" fixed-width class="nav-icon" />
          Planner
        </router-link>
        <router-link to="/community-page" class="nav-item" :class="{ active: isRouteActive('/community-page') }">
          <font-awesome-icon icon="users" fixed-width class="nav-icon" />
          Community
        </router-link>
        <router-link to="/gpa-calculator" class="nav-item" :class="{ active: isRouteActive('/gpa-calculator') }">
          <font-awesome-icon icon="calculator" fixed-width class="nav-icon" />
          GPA Calculator
        </router-link>
      </div>
      <div class="nav-section general">
        <div class="nav-section-title">GENERAL</div>
        <router-link to="/profile" class="nav-item" :class="{ active: isRouteActive('/profile') }">
          <font-awesome-icon icon="user" fixed-width class="nav-icon" />
          Profile
        </router-link>
        <div class="nav-item" @click="toggleFeedbackModal">
        <font-awesome-icon icon="comment-dots" fixed-width class="nav-icon" />
        Feedback
      </div>
        <a href="#" class="nav-item" @click="handleLogout">
          <font-awesome-icon icon="sign-out-alt" fixed-width class="nav-icon" />
          Logout
        </a>
      </div>
      <FeedbackModal v-if="showFeedbackModal" @close="toggleFeedbackModal" />
    </nav>
  </div>
</template>


<script>
import { confirmPasswordReset, getAuth, signOut} from 'firebase/auth';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHome, faClipboardList, faUsers, faCalculator, faUser, faSignOutAlt, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import FeedbackModal from './FeedbackModal.vue';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

library.add(faHome, faClipboardList, faUsers, faCalculator, faUser, faSignOutAlt, faCommentDots);

export default {
  name: 'NavigationBar',
  components: {
    FontAwesomeIcon,
    FeedbackModal
  },
  created() {
    this.fetchUserData(); 
  },
  data() {
    return {
      user: null,
      showFeedbackModal: false, // Controls the visibility of the feedback modal
    };
  },
  methods: {
    async fetchUserData() {
      const auth = getAuth();
      const db = getFirestore();
      if (auth.currentUser) {
        const userDoc = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
          this.user = docSnap.data(); 
        } else {
          console.log("No such document!");
        }
      }
    },
    isRouteActive(routePath) {
      return this.$route.path === routePath;
    },
    toggleFeedbackModal() {
      this.showFeedbackModal = !this.showFeedbackModal;
    },
    async handleLogout() {
      if (confirm('Are you sure you want to log out?')) { // Pop-up confirmation
        try {
          const auth = getAuth();
          await signOut(auth);
          this.$router.push('/login'); // Redirect user to the login page
        } catch (error) {
          console.error('Logout Failed', error);
        }
      }
    }
  },
  computed: {
    welcomeMessage() {
      return this.user ? `Welcome, ${this.user.username}` : "Welcome, Guest";
    }
  }
};
</script>

<style scoped>
.navbar-fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  overflow-y: auto;
  z-index: 1000;
  padding-top: 0;
}

.nav-section {
  margin-bottom: 1rem;
}

.navbar-brand {
  display: block;
  justify-content: center;
  margin-bottom: 1rem;
}

.brand-logo {
  width: 100%;
  height: auto;
  padding-top: 20px;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  align-items: stretch; /* Aligns items in a column */
}


.nav-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem; /* Padding inside each nav item */
  text-decoration: none;
  color: inherit; /* Takes the color from parent */
  cursor: pointer;
}
.nav-icon {
  margin-right: 1rem; /* Space between icon and text */
}

.active {
  background-color: #0d6efd; /* Highlight color */
  color: white;
  border-radius: 0.25rem;
}
.nav-section.dashboard {
  margin-bottom: 1rem; /* Adjust to match the spacing you desire */
} 

.nav-section.general {
  margin-top: auto; /* Pushes it to the bottom */
  padding-top: 10px; /* Space above general section items */
  border-top: 1px solid #ddd; /* Line above general section */
}
.nav-section-title {
  padding: 10px 0;
  font-weight: bold;
}

.welcome-message {
  font-weight: bold;
  margin-top: 10px;
  font-size: larger
}
</style>



  
  