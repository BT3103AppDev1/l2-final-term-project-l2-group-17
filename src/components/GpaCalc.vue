<template>
  <div class="container mt-3">
    <div class="text-center mb-4">
      <img src="@/assets/modunus_logo.jpg" alt="Modunus Logo" class="logo" />
    </div>
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
              <th scope="col"> S/U Reccomendations</th>
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
              <td style="text-align: left;"><button @click="prepareSURRecommendations(semester)" class="btn btn-primary me-2">Show</button> </td>
            </tr>
            <tr v-else>
              <td colspan="4" class="text-center"><em>No semesters added yet</em></td>
            </tr>
          </tbody>
        </table>
        <h4>Overall GPA: {{ totalCalculations.totalGPA.toFixed(2) }}</h4>
        <h4>Total MCs taken: {{ totalCalculations.totalWorkload }}</h4>
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
            <strong>{{ module.name }}</strong> - Original Grade: {{ module.grade }}
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
        <button v-if="editingIndex === null" @click="saveSemesterDetails" class="btn btn-success mt-3 me-3">
          Save / Return
        </button>
        <button type="submit" class="btn btn-primary mt-3 me-3">
          {{ editingIndex !== null ? 'Save edit' : 'Add Module' }}
        </button>
        <button v-if="editingIndex !== null" @click="cancelEdit" type="button" class="btn btn-secondary mt-3 me-3">
          Cancel Edit
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



library.add(faCalculator, faTrash, faEdit, faBook, faPlus);

export default {
  components: {
    FontAwesomeIcon,
    'v-select': VueSelect
  },
  data() {
    return {
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
        su:''
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
        console.log(user);
      } else {
        console.log('No user is signed in.');
      }
    });
    console.log(this.formattedModules)
  },
  methods: {
    prepareSURRecommendations(semester) {
    const overallGPA = this.totalCalculations.totalGPA;
    console.log(semester.modules)
    this.currentSURRecommendations = semester.modules.filter(module => {
      return module.su && this.gradeToGpa[module.grade] < overallGPA && module.grade !== 'S';
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
    async saveSemesterDetails() {
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
      await this.saveUserData();
    },
    addSemester() {
      const modalElement = document.getElementById('addSemesterModal');
      const modal = new Modal(modalElement);
      modal.show();
    },
    confirmAddSemester() {
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
        this.newModule.su = this.selectedModule.su;
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
        credits: module.moduleCredit,
        su: module.attributes ? module.attributes.su : false
      }));
    },
    totalCalculations() {
    let totalWorkload = 0;
    let totalGradePoints = 0;
    let totalCreditsForGPA = 0;

    this.semesters.forEach(semester => {
      semester.modules.forEach(module => {
        const credits = module.credits;
        const grade = module.grade;
        totalWorkload += credits;
        if (grade !== 'S') {
          const gradePoint = this.gradeToGpa[grade] || 0; 
          totalGradePoints += gradePoint * credits;
          totalCreditsForGPA += credits;
        }
      });
    });
    const totalGPA = totalCreditsForGPA > 0 ? totalGradePoints / totalCreditsForGPA : 0;

    return { totalWorkload, totalGPA };
  }
  }
}
</script>

<style scoped>
.logo {
  max-width: 200px; 
  display: block; 
  margin-top: 15px;  
}
</style>