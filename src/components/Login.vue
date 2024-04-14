<template>
  <div class="container-fluid py-5">
    <div class="row min-vh-100">
      <div class="col-md-3 col-lg-2 d-flex flex-column sidebar">
        <carousel/>
      </div>

      <div class="col-md-9 col-lg-10 offset-md-3 offset-lg-2 d-flex align-items-center justify-content-center">
        <div class="row justify-content-center">
          <div class="col-md-6">
            <div class="text-start mb-4">
              <img src="@/assets/modunus_logo.jpg" alt="Modunus Logo" class="logo mb-3 img-fluid" />
            </div>
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
                <div class="input-group">
                  <input :type="passwordFieldType" class="form-control" id="password" v-model="password" required placeholder="Enter your password" autocomplete="current-password">
                  <span class="input-group-text" @click="togglePasswordVisibility">
                    <font-awesome-icon :icon="passwordIcon" />
                  </span>
                </div>
                <div v-if="errorMessage" class="alert alert-danger mt-2">{{ errorMessage }}</div>
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
  </div>
  </div>


</template>



<script>
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Carousel from './Carousel.vue'

library.add(faEye, faEyeSlash);

export default {
  components: {
    'font-awesome-icon': FontAwesomeIcon,
    Carousel
  },
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
      isPasswordVisible: false,
    };
  },
  computed: {
    passwordFieldType() {
      return this.isPasswordVisible ? 'text' : 'password';
    },
    passwordIcon() {
      return this.isPasswordVisible ? faEyeSlash : faEye;
    },
  },
  methods: {
    togglePasswordVisibility() {
      this.isPasswordVisible = !this.isPasswordVisible;
    },
    async login() {
      this.errorMessage = '';
      if (!this.email || !this.password) {
        this.errorMessage = 'Please enter both email and password.';
        return;
      }
      const auth = getAuth();
      try {

        await signInWithEmailAndPassword(auth, this.email, this.password);
        this.$router.push('/module-planning');
      } catch (error) {
        if (error.code === 'auth/too-many-requests') {
          this.errorMessage = 'Access to this account has been temporarily disabled due to many failed login attempts. Please reset your password';
        } else {
          this.errorMessage = 'Incorrect email or password, please try again.';
        }
        console.error('Login error:', error);
      }
    },
  },
};
</script>

<style scoped>
.input-group-text {
  cursor: pointer;
  background: transparent;
  border-left: 0;
  outline: none;
}

.input-group .form-control {
  border-right: none;
}

.input-group .form-control:focus {
  box-shadow: none; 
  border-color: #ced4da; 
  outline: none; 
}

.input-group .fa {
  margin-right: 0; 
}

.input-group .form-control:-webkit-autofill,
.input-group .form-control:-webkit-autofill:hover, 
.input-group .form-control:-webkit-autofill:focus, 
.input-group .form-control:-webkit-autofill:active  {
    transition: background-color 5000s ease-in-out 0s, color 5000s ease-in-out 0s;
    -webkit-text-fill-color: #495057 !important;
    box-shadow: none !important;
    border-color: #ced4da; 
    outline: none; 
}

.sidebar {
  position: fixed; 
  top: 0;         
  left: 0;         
  width: 30%;    
  height: 100%;    
  background-color: #b8e2f2;
  overflow-y: auto; 
  justify-content: flex-end; 
  display: flex;
  flex-direction: column;
}


</style>


