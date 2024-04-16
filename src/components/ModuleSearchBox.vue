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
        filteredModules: [],
      }
    },
    methods: {
      filterModules() {
        if (!this.moduleSearch.trim()) {
          this.filteredModules = [];
          return;
        }
        this.filteredModules = this.allModules.filter(module =>
          module.moduleCode.startsWith(this.prefix) &&
          (module.moduleCode.toLowerCase().includes(this.moduleSearch.toLowerCase()) ||
           module.title.toLowerCase().includes(this.moduleSearch.toLowerCase()))
        );
      },
      selectModule(module) {
        this.moduleSearch = `${module.moduleCode} ${module.title}`;
        this.filteredModules = [];
        this.$emit('module-selected', { module, prefix: this.prefix });
      },
      startDrag(event) {
        const moduleData = {
          type: this.prefix,
          title: this.moduleSearch,
          id: 'module-box-' + this.moduleSearch
        };
        event.dataTransfer.setData('application/json', JSON.stringify(moduleData));
      }
    }
  }
  </script>
  