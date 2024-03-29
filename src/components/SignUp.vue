<template>
    <div class="container">
      <div class="logo"></div>
      <div class="card">
        <div class="card-content">
          <h2>Welcome! Let's get you settled.</h2>
          <div class="form-container">
            <div class="form-section">
              <h3>General Information</h3>
              <input type="text" v-model="registerInfo.name" placeholder="Name" />
              <input type="text" v-model="registerInfo.NUSId" placeholder="StudentID" />
              <h3>Account Information</h3>
              <input type="text" v-model="registerInfo.username" placeholder="Username" />
              <input type="password" v-model="registerInfo.password" placeholder="Password" />
              <input type="email" v-model="registerInfo.email" placeholder="Email" />
            </div>
            <div class="form-section">
                <h3>Academic Information</h3>
                <label>Faculty</label>
                <select v-model="registerInfo.faculty">
                    <option disabled value="">Please select one</option>
                    <option v-for="faculty in facultyList" :key="faculty">{{ faculty }}</option>
                </select>

                <label>Primary Degree</label>
                <select v-model="registerInfo.primaryDegree">
                    <option disabled value="">Please select one</option>
                    <option v-for="degree in majorDict[registerInfo.faculty]" :key="degree">{{ degree }}</option>
                </select>

                <label>Academic Plan</label>
                <select v-model="registerInfo.academicPlan" @change="handleAcademicPlanChange">
                    <option disabled value="">Please select one</option>
                    <option v-for="plan in acadPlanList" :key="plan">{{ plan }}</option>
                </select>

                <div v-if="registerInfo.academicPlan === 'Double Degree'">
                    <label>Second Degree</label>
                    <select v-model="registerInfo.secondDegree">
                    <option disabled value="">Please select one</option>
                    <option v-for="degree in majorDict[registerInfo.faculty]" :key="degree">{{ degree }}</option>
                    </select>
                </div>

                <div v-if="registerInfo.academicPlan === 'Double Major'">
                    <label>Second Major</label>
                    <select v-model="registerInfo.secondMajor">
                    <option disabled value="">Please select one</option>
                    <option v-for="major in majorList" :key="major">{{ major }}</option>
                    </select>
                </div>
                </div>
              <!-- Add your academic information fields here -->
              <button :disabled="!isFormComplete" @click="signUp">Sign Up</button>
            </div>
          </div>
        </div>
      </div>
  </template>
  
<script>
import  firebaseApp  from '../firebase.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase.js';
import { doc, setDoc } from 'firebase/firestore';
import { facultyList, majorDict, acadPlanList, majorList } from './constants';
  
  export default {
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
        isFormComplete: false,
        facultyList, 
        majorDict,
        acadPlanList,
        majorList,
        };
    },
    methods: {
      async signUp() {
        if (!this.isFormComplete) {
          alert('Please fill in all fields.');
          return;
        }

        try {   
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, this.registerInfo.email, this.registerInfo.password);
        const user = userCredential.user;

        // Store additional user information in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          name: this.registerInfo.name,
          NUSId: this.registerInfo.NUSId,
          username: this.registerInfo.username,
          email: this.registerInfo.email,
          // password: this.registerInfo.password,
          faculty: this.registerInfo.faculty,
          primaryDegree: this.registerInfo.primaryDegree,
          academicPlan: this.registerInfo.academicPlan,
          secondDegree: this.registerInfo.secondDegree,
          secondMajor: this.registerInfo.secondMajor,
          // any other fields?  
        });
        alert('Registration successful!');
        // this.$router.push('/Home');
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(`Error ${errorCode}: ${errorMessage}`);
      }
    },
        
      handleAcademicPlanChange() {
        if (this.registerInfo.academicPlan !== 'Double Degree') {
        this.registerInfo.secondDegree = '';
        }
        if (this.registerInfo.academicPlan !== 'Double Major') {
          this.registerInfo.secondMajor = '';
        }
        // Revalidate the form
        this.validateForm();
      },
      validateForm() {
      // Start with checking the general and account information fields
      this.isFormComplete = this.registerInfo.name && this.registerInfo.NUSId &&
                            this.registerInfo.username && this.registerInfo.password &&
                            this.registerInfo.email && this.registerInfo.faculty &&
                            this.registerInfo.primaryDegree && this.registerInfo.academicPlan;
      
      // Check for additional conditions based on academic plan
      if (this.registerInfo.academicPlan === 'Double Degree') {
        this.isFormComplete = this.isFormComplete && this.registerInfo.secondDegree;
      }
      if (this.registerInfo.academicPlan === 'Double Major') {
        this.isFormComplete = this.isFormComplete && this.registerInfo.secondMajor;
      }
    },
  },

  watch: {
      registerInfo: {
      handler() {
          this.isFormComplete = Object.values(this.registerInfo).every((value) => value !== '');
      },
      deep: true,
      },
  },
};
  </script>

<style scoped>
/* Add style later */
</style>
  
  
    