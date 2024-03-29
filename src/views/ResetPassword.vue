<template>
  <div>
    <h2>Reset Password</h2>
    <input type="password" v-model="password" placeholder="New Password">
    <button @click="updatePassword">Update Password</button>
  </div>
</template>

<script>
import { getAuth, updatePassword } from 'firebase/auth';

export default {
  data() {
    return {
      password: '',
    };
  },
  methods: {
    async updatePassword() {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        try {
          await updatePassword(user, this.password);
          // Update successful.
          this.$router.push('/Login');
        } catch (error) {
          // An error occurred, handle it here
          console.error("Error updating password: ", error);
          // Show error message to the user
        }
      } else {
        // No user is signed in.
        // Handle this case, maybe by showing an error or redirecting to login
      }
    },
  },
};
</script>

<style>
/* Add your styles here if necessary */
</style>
