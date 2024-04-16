<template>
  <div class="page-container">
    <div class="accordion-container">
      <!-- Accordion Toggle for University Level Requirements -->

      <button class="accordion" @click="toggleAccordionCS">
        CS Foundation
        <span class="arrow">{{ isAccordionCSOpen ? '▲' : '▼' }}</span>
      </button>

    <!-- Accordion Content for CS Foundation -->
    <div v-show="isAccordionCSOpen" class="accordion-content">
      <div v-for="module in csFoundationModules" :key="module.id" class="module-item">
        {{ module.id }} {{ module.title }}
        <!-- Add any additional markup for displaying the module, such as buttons or icons -->
      </div>
    </div> 

      <button class="accordion" @click="toggleAccordion">
        University Level Requirements
        <span class="arrow">{{ isAccordionOpen ? '▲' : '▼' }}</span>
      </button>
      <!-- Accordion Content -->
      <div v-show="isAccordionOpen" class="accordion-content">
        <ModuleSearchBox
          v-for="prefix in modulePrefixes"
          :key="prefix"
          :prefix="prefix"
          :label="labels[prefix]"
          :all-modules="allModules"
        />
      </div> 
    </div>
    <div class="study-plan-container">
      <!-- Study Plan Drop Zone, same as before -->
      <div class="study-plan" @drop.prevent="dropModule" @dragover.prevent="allowDrop">
        <div class="drop-zone">Drop modules here</div>
        <div v-for="(module, index) in studyPlan" :key="module.id" class="dropped-module">
          {{ module.title }}  
          <button @click="removeModule(index)" class="remove-module-btn">&#x2715;</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import ModuleSearchBox from './ModuleSearchBox.vue';  


export default {
  name: 'ModuleBox',
  components: {
    ModuleSearchBox
  },
  data() {
    return {
      csFoundationModules: [
      // Populate this array with your CS Foundation modules
      { id: 'CS1010X', title: 'Programming Methodology'},
      { id: 'CS1101S', title: 'Programming Methodology' },
      { id: 'CS2030S', title: 'Programming Methodology II' },
      { id: 'CS2040S', title: 'Data Structures and Algorithms' },
      { id: 'CS2100', title: 'Computer Organisation' },
    ],
    isAccordionCSOpen: false, // This will control if the CS accordion content is displayed
      modulePrefixes: ['GEN', 'GEC', 'GEA', 'GESS'],
      labels: {
        GEN: 'Communities and Engagement',
        GEC: 'Cultures and Connections',
        GEA: 'Data Literacy',
        GESS: 'Singapore Studies'
      },
      allModules: [],
      studyPlan: [],
      isAccordionOpen: false // This will control if the accordion content is displayed
    }
  },
  methods: { 
    toggleAccordion() {
      this.isAccordionOpen = !this.isAccordionOpen;
    }, 
    toggleAccordionCS() {
      this.isAccordionCSOpen = !this.isAccordionCSOpen;
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
      if (!this.studyPlan.some(m => m.moduleCode === module.moduleCode)) {
        this.studyPlan.push(module);
      }
    },
    async fetchModules() {
      try {
        const response = await fetch('https://api.nusmods.com/v2/2023-2024/moduleInfo.json');
        this.allModules = await response.json();
      } catch (error) {
        console.error('Failed to fetch modules:', error);
      }
    },
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
  width: 50%; /* Right side takes up the other half */
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
.dropped-module {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  margin: 5px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.dropped-module .remove-module-btn {
  margin-left: 10px;
  border: none;
  background: none;
  cursor: pointer;
  color: #333;
  font-size: 1.5rem;
}

.accordion {
  background-color: lightblue;
  color: #000;
  cursor: pointer;
  padding: 18px; 
  width: 100%;
  text-align: left;
  border: none;
  outline: none;
  font-size: 15px;
  transition: 0.4s;
  border-radius: 4px;
  margin-bottom: 10px;  
}

.accordion-content {
  padding: 0 18px;
  background: #fff;
  overflow: hidden;
  transition: max-height 0.2s ease-out;
}

.arrow {
  float: right;
}

.module-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  position: relative;
  margin-bottom: 20px; /* Add spacing between boxes */
}

 
</style>