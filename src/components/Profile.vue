<template>
    <div class="community-header">
      <div class="container text-center text-md-start">
        <div class="row align-items-center">
          <div class="col-md-7" v-if="user">
            <h1 class="display-5 fw-bold">Hello, {{ user.name }}</h1>
          </div>
          <div class="col-md-5 d-none d-md-block">
            <img src="../../assets/profile.svg" alt="Profile Icon" class="img-fluid" style="max-width: 50%;">
          </div>
        </div>
      </div>
    </div>
    <div class="container mt-5">
      <h1 class="mb-4">User Profile</h1>
      <div v-if="user" class="card">
        <div class="card-body">
          <p class="card-text"><strong>Username:</strong> {{ user.username }}</p>
          <p class="card-text"><strong>Email:</strong> {{ user.email }}</p>
          <p class="card-text"><strong>Faculty:</strong> {{ user.faculty }}</p>
          <p class="card-text"><strong>Primary Degree:</strong> {{ user.primaryDegree }}</p>
          <p class="card-text"><strong>Second Degree:</strong> {{ user.secondDegree || "N/A" }}</p>
          <p class="card-text"><strong>Second Major:</strong> {{ user.secondMajor || "N/A" }}</p>
          <p class="card-text"><strong>Academic Plan:</strong> {{ user.academicPlan }}</p>
          <button class="btn btn-primary" @click="editUser">Edit Profile</button>
        </div>
      </div>
      <div v-else>
        <p>Loading user data...</p>
      </div>
    </div>
  </template>
  
  <script>
  import { getFirestore, doc, getDoc } from 'firebase/firestore';
  import {  getAuth } from 'firebase/auth';
  
  export default {
    data() {
      return {
        user: null
      };
    },
    created() {
      this.fetchUserData();
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
      editUser() {
        console.log("Edit Mode - Implement according to your app's requirements");
      }
    }
  }
  </script>
  
  <style>
  .community-header {
    background-color: #e7f2ff;
    padding: 2rem 0;
    border-radius: 10px;
    margin-top: 0;
  }
  </style>
  