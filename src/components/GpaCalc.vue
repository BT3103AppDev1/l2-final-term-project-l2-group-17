<template>
  <div class="container mt-3">
    <div class="d-flex align-items-center">
      <h1 class="mb-3 d-inline-flex align-items-center">
        GPA Calculator
        <font-awesome-icon icon="calculator" class="ms-3" />
      </h1>
    </div>

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
        {{ editingIndex !== null ? 'Edit Module' : 'Add Module' }}
      </button>
      <button v-if="editingIndex !== null" @click="cancelEdit" type="button" class="btn btn-secondary mt-3 me-3">
        Cancel Edit
      </button>
    </form>
  
    <div v-if="modules.length > 0" class="mt-4">
      <h3>Your Modules <font-awesome-icon icon="book" class="me-2" /></h3>
      <ul class="list-group">
        <li v-for="(module, index) in modules" :key="index" class="list-group-item d-flex justify-content-between align-items-center">
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
      <h4 class="mt-3">Your GPA: {{ calculatedGPA.toFixed(2) }}</h4>
      <h4>Total MCs taken: {{ calculatedCredits }}</h4>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCalculator, faTrash, faEdit, faBook } from '@fortawesome/free-solid-svg-icons';
library.add(faCalculator, faTrash, faEdit, faBook);
import VueSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

export default {
  components: {
    FontAwesomeIcon,
    'v-select': VueSelect
  },
  data() {
    return {
      selectedModule: null,
      modules: [],
      test_modules: [],
      newModule: {
        name: '',
        grade: '',
        credits: ''
      },
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
      modularCredits: [2, 4, 8],
      editingIndex: null,
    };
  },
  async mounted() {
    await this.fetchModules();
  },
  methods: {
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
      let trueTotalCredits = 0;
      this.modules.forEach(module => {
        trueTotalCredits += module.credits;
      });
      return trueTotalCredits;
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

