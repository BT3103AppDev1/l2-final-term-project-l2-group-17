<template>
  <div class="container py-5">
    <!-- Logo Image -->
    <div class="text-center mb-4">
      <img src="@/assets/modunus_logo.png" alt="Modunus Logo" class="logo" />
    </div>

    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card">
          <div class="card-body">
            <h2 class="card-title text-center">Welcome! Let's get you settled.</h2>
            <form @submit.prevent="signUp" class="needs-validation" novalidate>
              
              <div class="row">
                <!-- General Information -->
                <div class="col-md-6 mb-3">
                  <label for="name" class="form-label">Name*</label>
                  <input type="text" class="form-control" id="name" v-model="registerInfo.name" required placeholder="Name">
                </div>
                
                <div class="col-md-6 mb-3">
                  <label for="studentId" class="form-label">Student ID*</label>
                  <input type="text" class="form-control" id="studentId" v-model="registerInfo.NUSId" required placeholder="EXXXXXXX">
                </div>
              </div>
              
              <!-- Account Information -->
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="username" class="form-label">Username*</label>
                  <input type="text" class="form-control" :class="{'is-invalid': usernameTaken}" id="username" v-model="registerInfo.username" @blur="checkUsername" required placeholder="Username">
                  <div v-if="usernameTaken" class="invalid-feedback">
                    This username is already taken. Please choose another one.
                  </div>
                </div>
                
                <div class="col-md-6 mb-3">
                  <label for="email" class="form-label">Email*</label>
                  <input type="email" class="form-control" id="email" v-model="registerInfo.email" required placeholder="Email">
                </div>
              </div>
              <div class="row">  
                <!-- Password Input -->
                <div class="col-md-6 mb-3">
                  <label for="password" class="form-label">Password*</label>
                  <div class="input-group">
                    <input :type="passwordFieldType" class="form-control" id="password" v-model="registerInfo.password" required placeholder="Password">
                    <span class="input-group-text" @click="togglePasswordVisibility">
                      <font-awesome-icon :icon="passwordIcon" />
                    </span>
                  </div>
                  <div v-if="!isPasswordValid" class="invalid-feedback" style="display:block;">
                    Password should be at least 8 characters
                  </div>
                </div>
                  
                <!-- Confirm Password Input -->
                <div class="col-md-6 mb-3">
                  <label for="confirmPassword" class="form-label">Confirm Password*</label>
                  <div class="input-group">
                    <input :type="confirmPasswordFieldType" class="form-control" id="confirmPassword" v-model="registerInfo.confirmPassword" required placeholder="Confirm Password">
                    <span class="input-group-text" @click="toggleConfirmPasswordVisibility">
                      <font-awesome-icon :icon="confirmPasswordIcon" />
                    </span>
                  </div>
                  <div v-if="!passwordsMatch" class="invalid-feedback" style="display:block;">
                    Password do not match
                  </div>
                </div>
              </div>

            <div class="row">  
              <!-- Faculty Dropdown -->
              <div class="col-md-6 mb-3">
                <label for="faculty" class="form-label">Faculty*</label>
                <select class="form-select" id="faculty" v-model="registerInfo.faculty" required>
                  <option disabled value="">Please select one</option>
                  <option v-for="faculty in facultyList" :key="faculty">{{ faculty }}</option>
                </select>
              </div>

              <!-- Primary Degree/Major Dropdown -->
              <div class="col-md-6 mb-3">
                <label for="primaryDegree" class="form-label">Primary Degree/Major*</label>
                <select class="form-select" id="primaryDegree" v-model="registerInfo.primaryDegree" required>
                  <option disabled value="">Please select one</option>
                  <option v-for="degree in majorDict[registerInfo.faculty]" :key="degree">{{ degree }}</option>
                </select>
              </div>
            </div>

            <div class="row">
              <!-- Academic Plan Dropdown -->
              <div class="col-md-6 mb-3">
                <label for="academicPlan" class="form-label">Academic Plan*</label>
                <select class="form-select" id="academicPlan" v-model="registerInfo.academicPlan" @change="handleAcademicPlanChange" required>
                  <option disabled value="">Please select one</option>
                  <option v-for="plan in acadPlanList" :key="plan">{{ plan }}</option>
                </select>
              </div>

              <!-- Conditionally Rendered Second Degree Dropdown -->
              <div class="col-md-6 mb-3" v-if="registerInfo.academicPlan === 'Double Degree'">
                <label for="secondDegree" class="form-label">Second Degree*</label>
                <select class="form-select" id="secondDegree" v-model="registerInfo.secondDegree" required>
                  <option disabled value="">Please select one</option>
                  <option v-for="degree in majorList" :key="degree">{{ degree }}</option>
                </select>
              </div>

              <!-- Conditionally Rendered Second Major Dropdown -->
              <div class="col-md-6 mb-3" v-if="registerInfo.academicPlan === 'Double Major'">
                <label for="secondMajor" class="form-label">Second Major*</label>
                <select class="form-select" id="secondMajor" v-model="registerInfo.secondMajor" required>
                  <option disabled value="">Please select one</option>
                  <option v-for="major in majorList" :key="major">{{ major }}</option>
                </select>
              </div>
            </div>

              <div class="text-center">
                <button type="submit" class="btn btn-primary" :disabled="!isFormComplete">Sign Up</button>
              </div>
            </form>
            
            <p class="text-center mt-3">
              Already have an account? <router-link to="/login">Login here.</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

  
<script>
import firebaseApp from '../firebase.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase.js';
import { query, getDocs, collection, where } from 'firebase/firestore';
import { doc, setDoc } from 'firebase/firestore';
import { facultyList, majorDict, acadPlanList, majorList } from './constants';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faEye, faEyeSlash);
  
export default {
  components: {
    FontAwesomeIcon,
  },
  data() {
    return {
      registerInfo: {
        name: '',
        NUSId: '',
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        faculty: '',
        primaryDegree: '',
        academicPlan: '',
        secondDegree: '',
        secondMajor: '',
      },
      passwordFieldType: 'password',
      confirmPasswordFieldType: 'password',
      passwordIcon: 'eye-slash',
      confirmPasswordIcon: 'eye-slash',
      facultyList,
      majorDict,
      acadPlanList,
      majorList,
      usernameTaken: false,
    };
  },
  computed: {
    isFormComplete() {
      let formComplete = this.registerInfo.name && this.registerInfo.NUSId &&
                         this.registerInfo.username && this.registerInfo.password &&
                         this.registerInfo.email && this.registerInfo.faculty &&
                         this.registerInfo.primaryDegree && this.registerInfo.academicPlan;

      if (this.registerInfo.academicPlan === 'Double Degree') {
        formComplete = formComplete && this.registerInfo.secondDegree;
      }
      if (this.registerInfo.academicPlan === 'Double Major') {
        formComplete = formComplete && this.registerInfo.secondMajor;
      }
      return formComplete;
    },
    passwordsMatch() {
      return this.registerInfo.password === this.registerInfo.confirmPassword;
    },
    isPasswordValid() {
      return this.registerInfo.password.length >= 8;
    }
  },

  methods: {
    togglePasswordVisibility() {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
      this.passwordIcon = this.passwordFieldType === 'text' ? 'eye' : 'eye-slash';
    },
    toggleConfirmPasswordVisibility() {
      this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
      this.confirmPasswordIcon = this.confirmPasswordFieldType === 'text' ? 'eye' : 'eye-slash';
    },
    async isUsernameUnique(username) {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);
      return querySnapshot.empty; // returns true if no documents match the query (i.e., username is unique)
    },
    async isUsernameUnique(username) {
      // Create a query against the collection.
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);
      return querySnapshot.empty; // returns true if no documents match the query
    },
    async checkUsername() {
      if (this.registerInfo.username) {
        const usernameUnique = await this.isUsernameUnique(this.registerInfo.username);
        this.usernameTaken = !usernameUnique;
      }
    },
    async signUp() {
      if (!this.isFormComplete || !this.passwordsMatch || this.usernameTaken) {
      alert('Please make sure all fields are filled in correctly and that the username is not already taken.');
      return;
      }
      try {   
        const userCredential = await createUserWithEmailAndPassword(auth, this.registerInfo.email, this.registerInfo.password);
        const user = userCredential.user;
        
        await setDoc(doc(db, 'users', user.uid), {
          name: this.registerInfo.name,
          NUSId: this.registerInfo.NUSId,
          username: this.registerInfo.username,
          email: this.registerInfo.email,
          faculty: this.registerInfo.faculty,
          primaryDegree: this.registerInfo.primaryDegree,
          academicPlan: this.registerInfo.academicPlan,
          secondDegree: this.registerInfo.secondDegree,
          secondMajor: this.registerInfo.secondMajor,
        });

        alert('Registration successful!');
        this.$router.push('/login');
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          // Handle the case where the email is already in use
          alert('This email is already in use by another account.');
        } else {
          // Handle other types of errors
          alert(`Error: ${error.message}`);
        }
      }
    },
    handleAcademicPlanChange() {
      if (this.registerInfo.academicPlan !== 'Double Degree') {
        this.registerInfo.secondDegree = '';
      }
      if (this.registerInfo.academicPlan !== 'Double Major') {
        this.registerInfo.secondMajor = '';
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

.invalid-feedback {
  color: #dc3545; 
  display: none;
}

</style>
  
  
    