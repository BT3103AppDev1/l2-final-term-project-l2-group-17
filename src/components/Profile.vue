<template>
    <div class="community-header">
      <div class="container text-center text-md-start">
        <div class="row align-items-center">
          <div class="col-md-7" v-if="user">
            <h1 class="display-5 fw-bold">Hello, {{ user.username }}</h1>
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
          <p class="card-text"><strong>Name:</strong> {{ user.name }}</p>
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
    <div class="modal fade" id="editUserModal" tabindex="-1" aria-labelledby="editUserModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="editUserModalLabel">Edit Profile</h5>
          <button type="button" id="closeModalButton" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="updateUserProfile">
            <div class="mb-3">
              <label for="name" class="form-label">Name</label>
              <input type="text" class="form-control" id="name" :placeholder="user.name" v-model="editUserData.name" v-if="editUserData && user">
            </div>
            <div class="mb-3">
              <label for="username" class="form-label">Username</label>
              <input type="text" class="form-control" id="username" :placeholder="user.username" v-model="editUserData.username"  v-if="editUserData && user">
            </div>
            <div class="mb-3">
              <label for="Faculty" class="form-label">Faculty</label>
              <input type="text" class="form-control" id="Faculty" :placeholder="user.faculty"v-model="editUserData.faculty"  v-if="editUserData && user">
            </div>
            <div class="mb-3">
              <label for="PriDegree" class="form-label">Primary Degree</label>
              <input type="text" class="form-control" id="primarydegree" :placeholder="user.primaryDegree" v-model="editUserData.primaryDegree"  v-if="editUserData && user">
            </div>
            <div class="mb-3">
              <label for="SecDegree" class="form-label">Secondary Degree</label>
              <input type="text" class="form-control" id="secondarydegree" :placeholder="user.secondDegree" v-model="editUserData.secondDegree"  v-if="editUserData && user">
            </div>
            <div class="mb-3">
              <label for="SecMajor" class="form-label">Second Major</label>
              <input type="text" class="form-control" id="secondmajor" :placeholder="user.secondMajor" v-model="editUserData.secondMajor"  v-if="editUserData && user">
            </div>
            <div class="mb-3">
              <label for="academicPlan" class="form-label">Academic Plan</label>
              <input type="text" class="form-control" id="acadPlan" :placeholder="user.academicPlan" v-model="editUserData.academicPlan"  v-if="editUserData && user">
            </div>
            <button type="submit" class="btn btn-primary">Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  </div>
  </template>
  
  <script>
  import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
  import {  getAuth } from 'firebase/auth';
  import { Modal } from 'bootstrap';
  
  export default {
    data() {
      return {
        user: null,
        editUserData: null
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
      this.editUserData = { ...this.user }; 
      const modal = new Modal(document.getElementById('editUserModal'));
      modal.show();
    },
    async updateUserProfile() {
      const auth = getAuth();
      const db = getFirestore();
      const userRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(userRef, this.editUserData, { merge: true });
      this.user = this.editUserData; 
      this.$nextTick(() => {
        document.getElementById('closeModalButton').click();
      })
    },
    

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
  