<template>
  <div class="container py-5">
    <!-- Logo Image -->
    <div class="text-center mb-4">
      <img src="@/assets/modunus_logo.png" alt="Modunus Logo" class="logo" />
    </div>

    <!-- Reset Password Card -->
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
                <button type="submit" class="btn btn-primary">Send Reset Email</button>
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
    async submitForgotPassword() {
      const auth = getAuth();
      try {
        await sendPasswordResetEmail(auth, this.email);
        alert('Password reset email sent! Please check your junk folder if you do not see it in inbox.');
        this.$router.push('/login');
      } catch (error) {
        // Check if the error code is 'auth/user-not-found' and display an appropriate message
        if (error.code === 'auth/user-not-found') {
          alert('No user found with this email address.');
        } else {
          // For other types of errors, you can log them or display a generic error message
          console.error('Reset password error:', error);
          alert('An error occurred while sending reset email.');
        }
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
