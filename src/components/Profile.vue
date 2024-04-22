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
          <button class="btn btn-primary me-2" @click="editUser">Edit Profile</button>
          <button class="btn btn-danger" @click="showChangePasswordModal">Change Password</button>
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
              <label for="faculty" class="form-label">Faculty</label>
                <select class="form-select" id="Faculty" :placeholder="user.faculty" v-model="editUserData.faculty"  v-if="editUserData && user">
                  <option disabled value="">Please select one</option>
                  <option v-for="faculty in facultyList" :key="faculty">{{ faculty }}</option>
                </select>
            </div>

            <div class="mb-3">
              <label for=“PriDegree” class="form-label">Primary Degree/Major</label>
                <select class="form-select" id="primarydegree" :placeholder="user.primaryDegree" v-model="editUserData.primaryDegree"  v-if="editUserData && user">
                  <option disabled value="">Please select one</option>
                  <option v-for="degree in majorDict[editUserData.faculty]" :key="degree">{{ degree }}</option>
                </select>
            </div>
            <div class="mb-3" v-if="user.academicPlan === 'Double Degree'">
              <label for=“SecDegree” class="form-label">Second Degree</label>
                <select class="form-select"  id="secondarydegree" :placeholder="user.secondDegree" v-model="editUserData.secondDegree"  v-if="editUserData && user">
                  <option disabled value="">Please select one</option>
                  <option v-for="degree in majorList" :key="degree">{{ degree }}</option>
                </select>
            </div>
            <div class="mb-3" v-if="user.academicPlan === 'Double Major'">
              <label for="SecMajor" class="form-label">Second Major</label>
                <select class="form-select" id="secondmajor" :placeholder="user.secondMajor" v-model="editUserData.secondMajor"  v-if="editUserData && user">
                  <option disabled value="">Please select one</option>
                  <option v-for="major in majorList" :key="major">{{ major }}</option>
                </select>
            </div>
            <div class="mb-3">
              <label for="academicPlan" class="form-label">Academic Plan</label>
                <select class="form-select" id="acadPlan" :placeholder="user.academicPlan" v-model="editUserData.academicPlan"  v-if="editUserData && user">
                  <option disabled value="">Please select one</option>
                  <option v-for="plan in acadPlanList" :key="plan">{{ plan }}</option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary">Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade" id="changePasswordModal" tabindex="-1" aria-labelledby="changePasswordModalLabel" aria-hidden="true">
    <div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="changePasswordModalLabel">Change Password</h5>
            <button type="button" class="btn-close" id="closePassModalButton" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <form @submit.prevent="changePassword">
                <div class="mb-3">
                    <label for="currentPassword" class="form-label">Current Password</label>
                    <input type="password" class="form-control" id="currentPassword" v-model="currentPassword">
                </div>
                <div class="mb-3">
                    <label for="newPassword" class="form-label">New Password</label>
                    <input type="password" class="form-control" id="newPassword" v-model="newPassword">
                </div>
                <div class="mb-3">
                    <label for="confirmNewPassword" class="form-label">Confirm New Password</label>
                    <input type="password" class="form-control" id="confirmNewPassword" v-model="confirmNewPassword">
                </div>
                <button type="submit" class="btn btn-primary">Update Password</button>
            </form>
            <div v-if="message" class="alert" :class="{'text-danger': !isSuccess}">
                {{ message }}
            </div>
        </div>
    </div>
</div>

</div>

  </template>
  
  <script>
  import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
  import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
  import { Modal } from 'bootstrap';
  import { facultyList, majorDict, acadPlanList, majorList } from './constants';
  
  export default {
    data() {
      return {
        user: null,
        editUserData: null,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
        message: '',
        isSuccess: false,
        faculty: '',
        primaryDegree: '',
        academicPlan: '',
        secondDegree: '',
        secondMajor: '',
        facultyList,
        majorDict,
        acadPlanList,
        majorList,
      };
    },
    created() {
      this.fetchUserData();
    },
    methods: {
    showChangePasswordModal() {
      const modal = new Modal(document.getElementById('changePasswordModal'));
      modal.show();
    },
    async changePassword() {
            const auth = getAuth();
            const user = auth.currentUser;

            if (this.newPassword !== this.confirmNewPassword) {
                this.message = "The new passwords do not match.";
                this.isSuccess = false;
                return;
            }

            if (this.newPassword.length < 8) {
              this.message = "Password should be at least 8 characters"
              this.isSuccess = false;
              return;
            }

            const credential = EmailAuthProvider.credential(
                user.email, 
                this.currentPassword
            );

            try {
                await reauthenticateWithCredential(user, credential);
                if (confirm("Are you sure you want to change your password?")) {
                await updatePassword(user, this.newPassword);
                alert("Password updated successfully!");
                this.isSuccess = true;
                } else { return ;}
            } catch (error) {
                if (error.code === 'auth/invalid-login-credentials') {
                    this.message = "The current password you entered is incorrect.";
                } 
                this.isSuccess = false;
                return;
            }

            this.$nextTick(() => {
                document.getElementById('closePassModalButton').click(); // Optionally close the modal after update
            });
        },
    
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
    },
    computed: {
    isDisabled() {
      return this.currentPassword === '' || 
             this.newPassword === '' || 
             this.confirmNewPassword !== this.newPassword || 
             this.newPassword.length < 8;
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
  .text-danger {
    color: #dc3545; 
}
  </style>
  