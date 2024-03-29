<template>
  <div>
    <h2>Forgot Password</h2>
    <input type="email" v-model="email" placeholder="Email">
    <button @click="resetPassword">Reset Password</button>
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
    resetPassword() {
      const auth = getAuth();
      sendPasswordResetEmail(auth, this.email)
        .then(() => {
          alert("Password reset email sent!")
          // Handle the success scenario, maybe show a confirmation message
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // Handle errors here, show an error message to the user
        });
    },
  },
};
</script>

<style>
/* Your styles here */
</style>
