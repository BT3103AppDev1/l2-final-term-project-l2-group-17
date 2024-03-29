  <template>
    <div>
      <h2>Login</h2>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div> <!-- Error message display -->
      <input type="email" v-model="email" placeholder="Email">
      <input type="password" v-model="password" placeholder="Password">
      <button @click="login">Login</button>
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
          var user = userCredential.user;
          this.$router.push('/Home');
        } catch (error) {
          // Check the error.code to display the appropriate message
          switch (error.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-email':
              this.errorMessage = 'Incorrect email or password. Please try again.';
              break;
            case 'auth/user-disabled':
              this.errorMessage = 'This account has been disabled. Please contact support.';
              break;
            default:
              this.errorMessage = 'An error occurred. Please try again later.';
              break;
          }
          console.error('Login error:', error);
        }
      },
    },
  };
  </script>

<style>
/* Your existing styles */
.error-message {
  color: red;
  margin-bottom: 10px;
}
</style>

