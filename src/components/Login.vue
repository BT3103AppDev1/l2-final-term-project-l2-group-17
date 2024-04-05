<template>
  <div class="container py-5">
    <!-- Logo Image in the top left corner -->
    <div class="text-start mb-4">
      <img src="@/assets/modunus_logo.jpg" alt="Modunus Logo" class="logo mb-3" />
    </div>
    
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow">
          <div class="card-body">
            <h2 class="card-title text-center mb-4">Login</h2>
            <form @submit.prevent="login">
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" id="email" v-model="email" required placeholder="Enter your email" autocomplete="email">
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" v-model="password" required placeholder="Enter your password" autocomplete="current-password">
              </div>
              <div class="d-grid gap-2">
                <button type="submit" class="btn btn-primary">Log In</button>
              </div>
            </form>
            <p class="mt-3 text-center">
              Don't have an account? <router-link to="/signup">Register here.</router-link><br>
              Forgot your password? <router-link to="/forgot-password">Reset it here.</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
    };
  },
  methods: {
    async login() {
      // Check for empty fields first
      if (!this.email || !this.password) {
        this.errorMessage = 'Please enter both email and password.';
        return;
      }

      const auth = getAuth();
      try {
        const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
        // Signed in
        this.$router.push('/gpacalc'); 
      } catch (error) {
        // Display appropriate error messages
        this.errorMessage = error.message;
        console.error('Login error:', error);
      }
    },
  },
};
</script>

<style scoped>
.logo {
  max-width: 200px; 
  display: block; 
  margin-left: 15px;
  margin-top: 15px; 
}
</style>
