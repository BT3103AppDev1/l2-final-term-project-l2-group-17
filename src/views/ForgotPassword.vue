<template>
<div>
    <!-- Logo Image -->
    <div class="text-start mb-4">
      <img src="@/assets/modunus_logo.jpg" alt="Modunus Logo" class="logo" />
    </div>
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow">
          <div class="card-body">
            <h2 class="card-title text-center mb-4">Forgot Password</h2>
            <form @submit.prevent="submitForgotPassword">
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" id="email" v-model="email" required placeholder="Enter your email">
              </div>
              <div class="d-grid gap-2">
                <button type="submit" class="btn btn-primary">Reset Password</button>
                <router-link to="/login" class="btn btn-link">Back to Login</router-link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

export default {
  data() {
    return {
      email: '',
    };
  },
  methods: {
    async resetPassword() {
      const auth = getAuth();
      try {
        await sendPasswordResetEmail(auth, this.email);
        // After successful password reset, navigate to login page
        this.$router.push('/login');
      } catch (error) {
        // Handle errors
        console.error(error);
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
