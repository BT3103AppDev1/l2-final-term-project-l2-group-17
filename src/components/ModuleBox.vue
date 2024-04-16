<template>
  <div class="page-container">
    <div class="module-searches">
      <!-- Dynamic Module Search Boxes -->
      <ModuleSearchBox
        v-for="prefix in modulePrefixes"
        :key="prefix"
        :prefix="prefix"
        :label="labels[prefix]"
        :all-modules="allModules"
        @module-selected="addModuleToPlan"
      />
    </div>
    <div class="study-plan-container">
      <div class="study-plan" @drop.prevent="dropModule" @dragover.prevent="allowDrop">
        <div class="drop-zone">Drop modules here</div>
        <!-- Display dropped modules here -->
        <div v-for="(module, index) in studyPlan" :key="module.id" class="dropped-module">
          {{ module.title }}  
          <button @click="removeModule(index)" class="remove-module-btn">&#x2715;</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ModuleSearchBox from './ModuleSearchBox.vue';  // Make sure the path matches the location of your ModuleSearchBox.vue file
import { ref } from 'vue';

export default {
  name: 'ParentComponent',
  components: {
    ModuleSearchBox
  },
  data() {
    return {
      modulePrefixes: ['GEN', 'GEC', 'GEA', 'GES'], // Example prefixes, you can modify these based on your needs
      labels: {
        GEN: 'Communities and Engagement',
        GEC: 'Cultures and Connections',
        GEA: 'Art and Creativity',
        GES: 'Scientific Inquiry'
      },
      allModules: [],
      studyPlan: [],
    }
  },
  methods: {
    addModuleToPlan(data) {
      this.studyPlan.push(data.module);
    },
    removeModule(index) {
      this.studyPlan.splice(index, 1);
    },
    allowDrop(event) {
      event.preventDefault();
    },
    dropModule(event) {
      const moduleData = event.dataTransfer.getData('application/json');
      const module = JSON.parse(moduleData);
      this.studyPlan.push(module);
    },
   async fetchModules() {
      // Implementation to fetch modules, possibly from an API
      fetch('https://api.example.com/modules')
        .then(response => response.json())
        .then(data => {
          this.allModules = data;
        })
        .catch(error => console.error('Failed to fetch modules:', error));
    }
  },
  created() {
    this.fetchModules();
  }
}
</script>

<style scoped>
.page-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  gap: 20px;
}
.module-searches {
  display: flex;
  flex-direction: column;
  width: 50%;
  gap: 20px;
}
.study-plan-container {
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.study-plan {
  width: 100%;
  height: 100%;
  border: 2px dashed #ccc;
  border-radius: 4px;
  text-align: center;
  padding: 20px;
  background-color: #e0e0e0;
  border-style: dashed;
}
.drop-zone {
  transition: background-color 0.2s ease-in-out;
}
.drop-zone.drag-over {
  background-color: #f0f0f0;
}
</style>
