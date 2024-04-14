<template>
  <div class="page-container">
    <div class="module-searches">
      <!-- Communities and Engagement -->
      <div class="module-box">
        <label for="module-search-gen">Communities and Engagement</label>
        <div class="module-search-container">
          <input type="text" id="module-search-gen" v-model="moduleSearchGEN" @input="filterModulesGEN" placeholder="Search for a module...">
          <ul v-if="filteredModulesGEN.length > 0" class="module-suggestions">
            <li v-for="module in filteredModulesGEN" :key="module.moduleCode" @click="selectModuleGEN(module)">
              {{ module.moduleCode }} {{ module.title }}
            </li>
          </ul>
        </div> 
      </div>

      <!-- Cultures and Connections -->
      <div class="module-box">
        <label for="module-search-gec">Cultures and Connections</label>
        <div class="module-search-container">
          <input type="text" id="module-search-gec" v-model="moduleSearchGEC" @input="filterModulesGEC" placeholder="Search for a module...">
          <ul v-if="filteredModulesGEC.length > 0" class="module-suggestions">
            <li v-for="module in filteredModulesGEC" :key="module.moduleCode" @click="selectModuleGEC(module)">
              {{ module.moduleCode }} {{ module.title }}
            </li>
          </ul>
        </div> 
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModuleSearch',
  data() {
    return {
      moduleSearchGEN: '',
      filteredModulesGEN: [],
      moduleSearchGEC: '',
      filteredModulesGEC: [],
      allModules: [],
    }
  },
  methods: {
    async fetchModules() {
      try {
        const response = await fetch('https://api.nusmods.com/v2/2023-2024/moduleInfo.json');
        this.allModules = await response.json();
        this.filterModulesGEN();
        this.filterModulesGEC();
      } catch (error) {
        console.error(error);
      }
    },
    filterModulesGEN() {
      this.filteredModulesGEN = this.allModules.filter(module =>
        module.moduleCode.startsWith('GEN') &&
        (module.moduleCode.toLowerCase().includes(this.moduleSearchGEN.toLowerCase()) ||
         module.title.toLowerCase().includes(this.moduleSearchGEN.toLowerCase()))
      );
    },
    selectModuleGEN(module) {
      this.moduleSearchGEN = `${module.moduleCode} ${module.title}`;
      this.filteredModulesGEN = [];
    },
    filterModulesGEC() {
      this.filteredModulesGEC = this.allModules.filter(module =>
        module.moduleCode.startsWith('GEC') &&
        (module.moduleCode.toLowerCase().includes(this.moduleSearchGEC.toLowerCase()) ||
         module.title.toLowerCase().includes(this.moduleSearchGEC.toLowerCase()))
      );
    },
    selectModuleGEC(module) {
      this.moduleSearchGEC = `${module.moduleCode} ${module.title}`;
      this.filteredModulesGEC = [];
    }
  },
  watch: {
    moduleSearchGEN(newSearch) {
      if (newSearch.trim()) {
        this.filterModulesGEN();
      } else {
        this.filteredModulesGEN = [];
      }
    },
    moduleSearchGEC(newSearch) {
      if (newSearch.trim()) {
        this.filterModulesGEC();
      } else {
        this.filteredModulesGEC = [];
      }
    },
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
  min-height: 100vh;
}

.module-searches {
  display: flex;
  justify-content: space-around;
  width: 100%;
}

.module-box {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  width: calc(50% - 20px);
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
  margin-bottom: 8px;
}

.module-box input[type="text"] {
  width: 100%;
  padding: 8px;
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
}

.module-suggestions li {
  padding: 8px;
  border-bottom: 1px solid #eee;
}

.module-suggestions li:hover {
  background-color: #f9f9f9;
}
</style>
