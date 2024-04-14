<template>
  <div class="gpa-header">
      <div class="container text-center text-md-start">
        <div class="row align-items-center">
          <div class="col-md-7">
            <h1 class="display-5 fw-bold">GPA Calculator
              <font-awesome-icon icon="calculator" class="ms-3" />
            </h1>
            <p class="lead">Calculation made Easy.</p>
            <div v-if="!selectedSemesterId">
        <button @click="addSemester" class="btn btn-primary lg-3">
          <font-awesome-icon :icon="['fas', 'plus']" /> Add Semester
        </button>
        </div>
          </div>
         
          <div class="col-md-5 d-none d-md-block">
            <img src="/assets/calculator.svg" alt="calculator" class="img-fluid">
          </div>
        </div>
      </div>
    </div>
    <div class="container mt-3">
      <div v-if="!selectedSemesterId">
        <div class="mt-3">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Semester</th>
                <th scope="col">GPA</th>
                <th scope="col">Credits</th>
                <th scope="col">Options</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="semesters.length" v-for="(semester, index) in semesters" :key="semester.id">
                <td>{{ semester.name }}</td>
                <td>{{ semester.grade }}</td>
                <td>{{ semester.workload }}</td>
                <td>
                  <div class="dropdown custom-dropdown">
                    <span id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false" style="cursor: pointer;">
                      <font-awesome-icon icon="caret-down"/>
                    </span>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                      <li>
                        <button class="dropdown-item" @click="viewSemester(semester.id)">
                          <font-awesome-icon icon="eye" class="me-2"></font-awesome-icon> View / Edit Semester
                        </button>
                      </li>
                      <li>
                        <button class="dropdown-item" @click="deleteSemester(semester.id)">
                          <font-awesome-icon icon="trash" class="me-2"></font-awesome-icon> Delete Semester
                        </button>
                      </li>
                      <li>
                        <button class="dropdown-item" @click="prepareSURRecommendations(semester)">
                          <font-awesome-icon icon="chart-bar" class="me-2"></font-awesome-icon> Show S/U Recommendations
                        </button>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
              <tr v-else>
                <td colspan="4" class="text-center"><em>No semesters added yet</em></td>
              </tr>
            </tbody>
          </table>
          <h4>Overall GPA: {{ totalCalculations.totalGPA.toFixed(2) }}</h4>
          <h4>Total MCs taken: {{ totalCalculations.totalWorkload }}</h4>
          <h4>Total S/U used: {{ totalCalculations.totalSU }}</h4>
        </div>
      </div>
      <div class="modal fade" id="addSemesterModal" tabindex="-1" aria-labelledby="addSemesterModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="addSemesterModalLabel">Add New Semester</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <input type="text" v-model="newSemesterName" class="form-control" placeholder="e.g. Y1S1" @keyup.enter="confirmAddSemester">
            </div>
            <div class="modal-footer">
              <button type="button" id="closeModalButton" data-bs-dismiss="modal" hidden></button>
              <button type="button" class="btn btn-primary" @click="confirmAddSemester">Add Semester</button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal fade" id="suRecommendationsModal" tabindex="-1" aria-labelledby="suRecommendationsModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="suRecommendationsModalLabel">S/U Recommendations</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <ul v-if="currentSURRecommendations.length > 0">
                <li v-for="module in currentSURRecommendations" :key="module.id">
                  <strong>{{ module.name }}</strong> - Original Grade: {{ module.grade.value }}
                </li>
              </ul>
              <div v-else>
                Nothing to Recommend
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="selectedSemesterId">
        <form @submit.prevent="addModule">
          <div class="form-group">
            <v-select 
              :options="paginatedModules"
              v-model="selectedModule"
              :disabled="editingIndex !== null"
              :filterable="false"
              @search="onSearch"
              placeholder="Search Module Code">
              <template #no-options>
                <div v-if="searchInitiated && noResultsFound" class="dropdown-item">
                  No modules found. Try a different search.
                </div>
                <div v-else class="dropdown-item">
                  Start typing to search for modules...
                </div>
              </template>
            </v-select>
          </div>
          <div class="form-group mt-3">
            <v-select v-model="newModule.grade"
                      :options="gradeOptions"
                      placeholder="Select Grade"
                      :disabled="selectedModule === null"
            </v-select>
          </div>
          <button type="submit" class="btn btn-primary mt-3 me-3">
            {{ editingIndex !== null ? 'Save edit' : 'Add Module' }}
          </button>
          <button v-if="editingIndex === null" 
                  @click="clearForm" 
                  type="button" 
                  class="btn btn-warning mt-3 me-3">
            Clear All
          </button>
          <button v-if="editingIndex !== null" @click="cancelEdit" type="button" class="btn btn-secondary mt-3 me-3">
            Cancel Edit
          </button>
        </form>
        <div class="mt-4">
          <h3>Your Modules <font-awesome-icon icon="book" class="me-2" /></h3>
          <h6 style="color: grey;">** For modules that are pass/fail choose "Pass" for the grade **</h6>
          <ul class="list-group">
            <li v-if="modules.length === 0" class="list-group-item">
              No modules added yet.
            </li>
            <li v-else v-for="(module, index) in modules" :key="index" class="list-group-item d-flex justify-content-between align-items-center">
              <span>
                <strong>{{ module.name }}</strong> - Grade: {{ module.grade.value }}, GPA: {{ parseFloat(gradeToGpa[module.grade.value]).toFixed(1) }}, Credits: {{ module.credits }}
              </span>
              <div class="dropdown">
                <span id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false" style="cursor: pointer;">
                  <font-awesome-icon icon="caret-down"/>
                </span>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <li>
                    <button class="dropdown-item" @click="editModule(index)">
                      <font-awesome-icon icon="edit" /> Edit Module Grade
                    </button>
                  </li>
                  <li>
                    <button class="dropdown-item" @click="deleteModule(index)">
                      <font-awesome-icon icon="trash" /> Delete Module
                    </button>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
          <div class="d-flex justify-content-center">
            <button v-if="editingIndex === null" 
                    :disabled="selectedModule !== null"
                    @click="saveSemesterDetails(true)" 
                    class="btn btn-success mt-3 me-3">
              Save / Return
            </button>
          </div>
          <h4 class="mt-4"><strong>Semester: {{ getSelectedSemesterName }}</strong></h4>
          <h4>Your GPA: {{ calculatedGPA.toFixed(2) }}</h4>
          <h4>Total MCs taken: {{ calculatedCredits }}</h4>
        </div>
      </div>
    </div>
</template>

<script>
import Error from './Error.vue'; 
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCalculator, faTrash, faEdit, faBook, faPlus, faChartBar, faEye, faEllipsisV, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import VueSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import { Modal } from 'bootstrap';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

library.add(faCalculator, faTrash, faEdit, faBook, faPlus, faChartBar, faEye, faEllipsisV, faCaretDown);

export default {
  components: {
    FontAwesomeIcon,
    'v-select': VueSelect,
    Error
  },
  data() {
    return {
      userFound: false, 
      noResultsFound: false,
      searchInitiated: false,
      offset: 0,
      limit: 10,
      searchQuery: '',
      currentSURRecommendations: [],
      selectedSemesterId: null,
      selectedModule: null,
      modules: [],
      test_modules: [],
      semesters: [],
      newModule: {
        name: '',
        grade: '',
        credits: '',
        su: ''
      },
      newSemesterName: '', 
      gradeToGpa: {
        'Pass': 0,
        'S': 0.0,
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
      },
      editingIndex: null,
    };
  },
  created() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      this.userFound = !!user;
      this.loadUserData();
    });
  },
  async mounted() {
    await this.fetchModules();
  },
  methods: {
    onSearch(query) {
      this.searchQuery = query;
      this.offset = 0;
      this.searchInitiated = true;
      this.noResultsFound = this.filteredModules.length === 0;
    },
    clearForm() {
      this.selectedModule = null;
      this.newModule = { name: '', grade: '', credits: '' };
    },
    prepareSURRecommendations(semester) {
      const overallGPA = this.totalCalculations.totalGPA;
      this.currentSURRecommendations = semester.modules.filter(module => {
        return module.su && parseFloat(this.gradeToGpa[module.grade.value]) < overallGPA && module.grade.value !== 'S';
      });
      this.showSURRecommendationsModal();
    },
    showSURRecommendationsModal() {
      const recommendationsModalElement = document.getElementById('suRecommendationsModal');
      const recommendationsModal = new Modal(recommendationsModalElement);
      recommendationsModal.show();
    },
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
    async deleteSemester(semesterId) {
      const userConfirmed = confirm("Are you sure you want to delete this semester?");
      if (userConfirmed) {
        this.semesters = this.semesters.filter(semester => semester.id !== semesterId);
        if (this.selectedSemesterId === semesterId) {
          this.selectedSemesterId = null;
        }
        await this.saveUserData();
      }
    },
    async saveSemesterDetails(resetSelectedSemester = true) {
      const semesterIndex = this.semesters.findIndex(s => s.id === this.selectedSemesterId);
      if (semesterIndex === -1) return;
      let totalCredits = 0;
      let totalPoints = 0;
      this.modules.forEach(module => {
        const gradePoint = parseFloat(this.gradeToGpa[module.grade.value]);
        totalCredits += module.credits;
        totalPoints += gradePoint * module.credits;
      });
      this.semesters[semesterIndex] = {
        ...this.semesters[semesterIndex],
        grade: this.calculatedGPA.toFixed(2),
        workload: this.calculatedCredits,
        modules: this.modules
      };
      if (resetSelectedSemester) {
        this.selectedSemesterId = null;
        this.modules = [];
        this.editingIndex = null;
      }
      await this.saveUserData();
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
          workload: 0,
          grade: 0.00
        };
        this.semesters.push(newSemester);
        this.newSemesterName = '';
        await this.saveUserData();
      } else {
        alert("Please enter a semester name.");
      }
      this.$nextTick(() => {
        document.getElementById('closeModalButton').click();
      });
    },
    viewSemester(semesterId) {
      this.selectedSemesterId = semesterId;
      this.modules = this.semesters.find(s => s.id === semesterId)?.modules || [];
    },
    addModule() {
      let duplicateSemesterName = '';
      const isModuleAdded = this.semesters.some(semester => {
        const isModuleInSemester = semester.modules.some(module => module.name === this.selectedModule.label);
        if (isModuleInSemester) {
          duplicateSemesterName = semester.name;
          return true;
        }
        return false;
      });
      
      if (this.editingIndex !== null) {
        if (confirm("Are you sure you want to edit this module?")) {
          this.modules[this.editingIndex] = { ...this.newModule };
          this.selectedModule = null;
          this.editingIndex = null;
          this.saveSemesterDetails(false);
        }
      } else {
        if (isModuleAdded) {
        alert(`This module has already been added in ${duplicateSemesterName} and cannot be added again.`);
        return;
      }
        this.newModule.credits = parseInt(this.selectedModule.credits, 10) || 0;
        this.newModule.name = this.selectedModule.label;
        this.newModule.su = this.selectedModule.su;
        this.modules.push({ ...this.newModule });
        this.selectedModule = null;
        this.saveSemesterDetails(false);
      }
    },
    deleteModule(index) {
      if (confirm("Are you sure you want to delete this module?")) {
        this.modules.splice(index, 1);
        this.saveSemesterDetails(false);
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
    gradeOptions() {
      return Object.keys(this.gradeToGpa).map(grade => ({
        label: grade,
        value: grade
      }));
    },
    getSelectedSemesterName() {
      const selectedSemester = this.semesters.find(semester => semester.id === this.selectedSemesterId);
      return selectedSemester ? selectedSemester.name : 'No semester selected';
    },
    calculatedGPA() {
      let totalPoints = 0;
      let totalCredits = 0;
      this.modules.forEach(module => {
        const gradeValue = parseFloat(this.gradeToGpa[module.grade.value]);
        if (module.grade.value !== 'S' && module.grade.value !== 'Pass') {
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
        credits: module.moduleCredit,
        su: module.attributes && module.attributes.su ? true : false
      }));
    },
    totalCalculations() {
      let totalWorkload = 0;
      let totalGradePoints = 0;
      let totalCreditsForGPA = 0;
      let totalSU = 0;
      this.semesters.forEach(semester => {
        semester.modules.forEach(module => {
          const credits = module.credits;
          const grade = module.grade.value;
          totalWorkload += credits;
          if (grade !== 'S' && grade !== 'Pass') {
            const gradePoint = parseFloat(this.gradeToGpa[grade]) || 0; 
            totalGradePoints += gradePoint * credits;
            totalCreditsForGPA += credits;
          } else if (grade !== 'Pass') {
            totalSU += 1;
          }
        });
      });
      const totalGPA = totalCreditsForGPA > 0 ? totalGradePoints / totalCreditsForGPA : 0;
      return { totalWorkload, totalGPA, totalSU };
    },
    filteredModules() {
      return this.searchQuery.length > 0
        ? this.formattedModules.filter(module => module.label.toLowerCase().includes(this.searchQuery.toLowerCase()))
        : this.formattedModules;
    },
    paginatedModules() {
      if (this.searchQuery.length > 0) {
        const start = this.offset * this.limit;
        return this.filteredModules.slice(start, start + this.limit);
      }
      return [];
    },
  }
}
</script>

<style scoped>
.logo {
  max-width: 200px;
  display: block;
  margin-top: 15px;
}
.custom-dropdown .dropdown-item:hover {
  background-color: #e9ecef;
  color: #495057;
}

.gpa-header {
    background-color: #e7f2ff;
    padding: 2rem 0;
    border-radius: 10px;
    margin: 1rem 0;
    margin-top: 0;
  }
</style>
