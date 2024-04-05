<template>
  <div class="container mt-3">
    <div class="d-flex align-items-center">
      <h1 class="mb-3 d-inline-flex align-items-center">
        GPA Calculator
        <font-awesome-icon icon="calculator" class="ms-3" />
      </h1>
    </div>

    <div v-if="!selectedSemesterId">
      <button @click="addSemester" class="btn btn-success mt-3">
        <font-awesome-icon :icon="['fas', 'plus']" /> Add Semester
      </button>
      <div class="mt-3">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Semester</th>
              <th scope="col">GPA</th>
              <th scope="col">Workload</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="semesters.length" v-for="(semester, index) in semesters" :key="semester.id">
              <td>{{ semester.name }}</td>
              <td>{{ semester.grade }}</td>
              <td>{{ semester.workload }}</td>
              <td>
                <button class="btn btn-primary me-2" @click="viewSemester(semester.id)">View / Edit</button>
                <button class="btn btn-danger" @click="deleteSemester(semester.id)">Delete</button>
              </td>
            </tr>
            <tr v-else>
              <td colspan="4" class="text-center"><em>No semesters added yet</em></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="modal fade" id="addSemesterModal" tabindex="-1" aria-labelledby="addSemesterModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="addSemesterModalLabel">Add New Semester</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <input type="text" v-model="newSemesterName" class="form-control" placeholder="e.g. Y1S1">
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" @click="confirmAddSemester">Add Semester</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectedSemesterId">
      <form @submit.prevent="addModule">
        <div class="form-group">
          <v-select 
            :options="formattedModules" 
            v-model="selectedModule" 
            :disabled="editingIndex !== null"
            placeholder="Search Module Code">
          </v-select>
        </div>
        <div class="form-group mt-3">
          <select v-model="newModule.grade" required class="form-control">
            <option value="">Select Grade</option>
            <option v-for="(value, key) in gradeToGpa" :key="key" :value="key">{{ key }}</option>
          </select>
        </div>

        <button type="submit" class="btn btn-primary mt-3 me-3">
          {{ editingIndex !== null ? 'Save edit' : 'Add Module' }}
        </button>
        <button v-if="editingIndex !== null" @click="cancelEdit" type="button" class="btn btn-secondary mt-3 me-3">
          Cancel Edit
        </button>

        <button v-if="editingIndex === null" @click="saveSemesterDetails" class="btn btn-success mt-3">
          Save / Return
        </button>
      </form>

      <div class="mt-4">
        <h3>Your Modules <font-awesome-icon icon="book" class="me-2" /></h3>
        <ul class="list-group">
          <li v-if="modules.length === 0" class="list-group-item">
              No modules added yet.
          </li>
          <li v-else v-for="(module, index) in modules" :key="index" class="list-group-item d-flex justify-content-between align-items-center">
              <span>
                  <strong>{{ module.name }}</strong> - Grade: {{ module.grade }}, GPA: {{ gradeToGpa[module.grade].toFixed(1) }}, Credits: {{ module.credits }}
              </span>
              <div>
                  <button @click="editModule(index)" class="btn btn-primary btn-sm me-3">
                      Edit
                      <font-awesome-icon icon="edit" />
                  </button>
                  <button @click="deleteModule(index)" class="btn btn-danger btn-sm">
                      Delete
                      <font-awesome-icon icon="trash" />
                  </button>
              </div>
          </li>
        </ul>
        <h4 class="mt-4"><strong>Semester: {{ getSelectedSemesterName }}</strong></h4>

        <h4>Your GPA: {{ calculatedGPA.toFixed(2) }}</h4>
        <h4>Total MCs taken: {{ calculatedCredits }}</h4>
      </div>

    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCalculator, faTrash, faEdit, faBook, faPlus } from '@fortawesome/free-solid-svg-icons';
import VueSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import { Modal } from 'bootstrap';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';


// Adding icons to the library
library.add(faCalculator, faTrash, faEdit, faBook, faPlus);

export default {
  components: {
    FontAwesomeIcon,
    'v-select': VueSelect
  },
  data() {
    return {
      selectedSemesterId: null,
      selectedModule: null,
      modules: [],
      test_modules: [],
      semesters: [],
      newModule: {
        name: '',
        grade: '',
        credits: ''
      },
      newSemesterName: '', 
      gradeToGpa: {
        'A+': 5.0,
        'A': 5.0,
        'A-': 4.5,
        'B+': 4.0,
        'B': 3.5,
        'B-': 3.0,
        'C+': 2.5,
        'C': 2.0,
        'D+': 1.5,
        'D': 1.0,
        'F': 0,
        'S': 0
      },
      editingIndex: null,
    };
  },
  async mounted() {
    await this.fetchModules();
    this.loadUserData();
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, log user details here
        console.log(user);
      } else {
        // No user is signed in.
        console.log('No user is signed in.');
      }
    });
  },
  methods: {
    async loadUserData() {
      const auth = getAuth();
      const db = getFirestore();
      const user = auth.currentUser;
      
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          this.modules = userData.modules || [];
          this.semesters = userData.semesters || [];
        } else {
          console.log("No user data found");
        }
      }
    },
    async saveUserData() {
      const auth = getAuth();
      const db = getFirestore();
      const user = auth.currentUser;

      if (user) {
        await setDoc(doc(db, "users", user.uid), {
          modules: this.modules,
          semesters: this.semesters
        });
      }
    },
    deleteSemester(semesterId) {
      const userConfirmed = confirm("Are you sure you want to delete this semester?");
      if (userConfirmed) {
        this.semesters = this.semesters.filter(semester => semester.id !== semesterId);
        if (this.selectedSemesterId === semesterId) {
          this.selectedSemesterId = null;
        }
      }
    },
    saveSemesterDetails() {
      const userConfirmed = confirm("Are you sure you want to save the changes?");
      if (!userConfirmed) {
        return;
      }
      const semesterIndex = this.semesters.findIndex(s => s.id === this.selectedSemesterId);
      if (semesterIndex === -1) return;

      let totalCredits = 0;
      let totalPoints = 0;
      this.modules.forEach(module => {
        const gradePoint = this.gradeToGpa[module.grade];
        totalCredits += module.credits;
        totalPoints += gradePoint * module.credits;
      });

      this.semesters[semesterIndex] = {
        ...this.semesters[semesterIndex],
        grade: this.calculatedGPA.toFixed(2),
        workload: this.calculatedCredits,
        modules: this.modules
      };

      this.selectedSemesterId = null;
      this.modules = [];
      this.editingIndex = null;
    },
    addSemester() {
      const modalElement = document.getElementById('addSemesterModal');
      const modal = new Modal(modalElement);
      modal.show();
    },
    async confirmAddSemester() {
      if (this.newSemesterName.trim()) {
        const newId = this.semesters.length + 1;
        const newSemester = {
          id: newId,
          name: this.newSemesterName,
          modules: [],
          workload: 'N.A',
          grade: 'N.A'
        };
        this.semesters.push(newSemester);
        this.newSemesterName = '';

        const modal = bootstrap.Modal.getInstance(document.getElementById('addSemesterModal'));
        modal.hide();
      } else {
        alert("Please enter a semester name.");
      }
      await this.saveUserData();
    },
    viewSemester(semesterId) {
      this.selectedSemesterId = semesterId;
      this.modules = this.semesters.find(s => s.id === semesterId)?.modules || [];
    },
    addModule() {
      if (this.editingIndex !== null) {
        if (confirm("Are you sure you want to edit this module?")) {
          this.modules[this.editingIndex] = { ...this.newModule };
          this.editingIndex = null;
        } else {
          return;
        }
      } else {
        this.newModule.credits = parseInt(this.selectedModule.credits, 10) || 0;
        this.newModule.name = this.selectedModule.label;
        this.modules.push({ ...this.newModule });
      }
      this.newModule = { name: '', grade: '', credits: '' };
    },
    deleteModule(index) {
      if (confirm("Are you sure you want to delete this module?")) {
        this.modules.splice(index, 1);
      }
    },
    editModule(index) {
      const module = this.modules[index];
      this.newModule = { ...module };
      this.editingIndex = index;
      const selected = this.formattedModules.find(m => m.value === module.name);
      if (selected) {
        this.selectedModule = selected;
      }
    },
    cancelEdit() {
      this.editingIndex = null;
      this.newModule = { name: '', grade: '', credits: '' };
      this.selectedModule = null;
    },
    async fetchModules() {
      try {
        const response = await fetch('https://api.nusmods.com/v2/2023-2024/moduleInfo.json');
        if (!response.ok) {
          throw new Error('Failed to fetch modules');
        }
        const data = await response.json();
        this.test_modules = data;
      } catch (error) {
        console.error(error);
      }
    },
  },
  computed: {
    getSelectedSemesterName() {
      const selectedSemester = this.semesters.find(semester => semester.id === this.selectedSemesterId);
      return selectedSemester ? selectedSemester.name : 'No semester selected';
    },
    calculatedGPA() {
      let totalPoints = 0;
      let totalCredits = 0;
      this.modules.forEach(module => {
        const gradeValue = this.gradeToGpa[module.grade];
        if (module.grade !== 'S') {
          totalPoints += gradeValue * module.credits;
          totalCredits += module.credits;
        }
      });
      return totalCredits > 0 ? totalPoints / totalCredits : 0;
    },
    calculatedCredits() {
      return this.modules.reduce((acc, module) => acc + module.credits, 0);
    },
    formattedModules() {
      return this.test_modules.map(module => ({
        label: module.moduleCode,
        value: module.moduleCode,
        credits: module.moduleCredit
      }));
    }
  }
}
</script>

