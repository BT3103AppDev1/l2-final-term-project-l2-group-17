<template>
  <div class="page-container">
    <div class="module-box">
      <label for="module-search">Common Core - AI</label>
      <div class="module-search-container">
        <input 
          type="text"
          id="module-search"
          v-model="moduleSearch"
          @input="filterModules"
          @focus="inputFocused"
          placeholder="Search for a module..."
        >
        <ul v-if="filteredModules.length > 0" class="module-suggestions">
          <li v-for="module in filteredModules" :key="module.moduleCode" @click="selectModule(module)">
            {{ module.moduleCode }} {{ module.title }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
  
  <script>
  export default {
    name: 'ModuleSearch',
    data() {
      return {
        moduleSearch: '',
        allModules: [],
        filteredModules: [],
        selectedModule: ''
      }
    },
    methods: {
      inputFocused() {
      // Clear the selected module to allow for a new search
      this.moduleSearch = '';
    },
      async fetchModules() {
        try {
          const response = await fetch('https://api.nusmods.com/v2/2023-2024/moduleInfo.json');
          if (!response.ok) {
            throw new Error('Failed to fetch modules');
          }
          this.allModules = await response.json();
          this.filterModules();
        } catch (error) {
          console.error(error);
        }
      },
      filterModules() {
        this.filteredModules = this.allModules.filter(module =>
          module.moduleCode.toLowerCase().includes(this.moduleSearch.toLowerCase()) ||
          module.title.toLowerCase().includes(this.moduleSearch.toLowerCase())
        );
      },
      selectModule(module) {
      // Update moduleSearch to reflect the selected module's full title
      // Now it will also be displayed in the input field
      this.moduleSearch = `${module.moduleCode} ${module.title}`;
      // Optionally update selectedModule if you want to store the selected module separately
      this.selectedModule = module;
      this.filteredModules = []; // Close the suggestions dropdown
    }
  },
    watch: {
      // Watcher to filter modules whenever the search input changes
      moduleSearch(newSearch) {
        if (newSearch.trim()) {
          this.filterModules();
        } else {
          this.filteredModules = [];
        }
      }
    },
    created() {
      this.fetchModules();
    }
  }
  </script>
  
  <style>
  .page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* This will make sure the container takes at least the height of the viewport */
  flex-direction: column;
}
  .module-box {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 16px;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    position: relative;
  }
  
  .module-search-container {
    position: relative;
  }
  
  .module-box label {
    font-size: 16px;
    color: #333;
    display: block;
    margin-bottom: 8px;
  }
  
  .module-box input[type="text"] {
    width: 100%;
    padding: 8px;
    margin-bottom: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
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
    box-sizing: border-box;
  }
  
  .module-suggestions li {
    padding: 8px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
  }
  
  .module-suggestions li:hover {
    background-color: #f9f9f9;
  }
  </style>