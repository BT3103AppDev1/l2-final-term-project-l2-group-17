<template>
  <div class="module-box" :id="'module-box-' + prefix" draggable="true" @dragstart="startDrag">
    <label :for="'module-search-' + prefix">{{ label }}</label>
    <div class="module-search-container">
      <input :id="'module-search-' + prefix" v-model="moduleSearch" @input="filterModules" placeholder="Search for a module...">
      <ul v-if="filteredModules.length > 0" class="module-suggestions">
        <li v-for="module in filteredModules" :key="module.moduleCode" @click="selectModule(module)">
          {{ module.moduleCode }} {{ module.title }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
props: ['prefix', 'label', 'allModules'],
data() {
  return {
    moduleSearch: '',
    selectedModule: null, // Holds the currently selected module object
    filteredModules: [],
  };
},
methods: {
  filterModules() {
    if (this.moduleSearch.trim()) {
      const searchLower = this.moduleSearch.toLowerCase();
      this.filteredModules = this.allModules.filter(module => 
        module.moduleCode.startsWith(this.prefix) &&
        (module.moduleCode.toLowerCase().includes(searchLower) ||
         module.title.toLowerCase().includes(searchLower))
      );
    } else {
      this.filteredModules = [];
    }
  },
  selectModule(module) {
    this.selectedModule = module;
    this.moduleSearch = `${module.moduleCode} ${module.title}`; // Display the selected module in the input field
    this.filteredModules = [];
    this.$emit('module-selected', module); // Emit the selected module for any parent component handling
  },
  startDrag(event) {
    if (this.selectedModule) {
      event.dataTransfer.setData('application/json', JSON.stringify(this.selectedModule)); // Drag the entire module object
    } else {
      // If no module is selected, prevent dragging
      event.preventDefault();
    }
  }
}
}
</script> 


  <style scoped>
.module-box {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  position: relative;
  margin-bottom: 20px;  
}

.module-search-container {
  position: relative;
}

.module-suggestions {
  list-style-type: none;
  padding: 0;
  margin: 0;
  border-top: 1px solid #eee;
  max-height: 200px;
  overflow-y: auto;
  background: #fff;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  position: absolute;
  width: 100%;
  z-index: 10;  
}

.module-suggestions li {
  padding: 8px;
  border-bottom: 1px solid #eee;
  cursor: pointer; 
}

.module-suggestions li:hover {
  background-color: #f9f9f9; 
}

input[type="text"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box; 
}
</style> 