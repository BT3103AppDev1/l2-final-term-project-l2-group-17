<template>
  <div class="module-dialog">
    <div class="module-search-container">
      <div class="title-container">
        <span class="title">Add Module</span>
        <button class="btn btn-danger" @click="$emit('close')">Close</button>
      </div>
      <input
        class="module-searchbar"
        v-model="moduleSearch"
        @input="filterModules"
        placeholder="Search for a module..."
      />
      <ul v-if="filteredModules.length > 0" class="module-suggestions">
        <li
          v-for="module in filteredModules"
          :key="module.moduleCode"
          @click="selectModule(module)"
        >
          {{ module.moduleCode }} {{ module.title }}
        </li>
      </ul>
    </div>
    <div class="button-container">
      <button class="btn btn-success" @click="addModule">Add Module</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ["prefix", "allModules"],
  data() {
    return {
      moduleSearch: "",
      filteredModules: [],
      selectedModule: null,
    };
  },
  methods: {
    filterModules() {
      if (this.moduleSearch.trim()) {
        const searchLower = this.moduleSearch.toLowerCase();
        this.filteredModules = this.allModules.filter((module) =>
          this.prefix.some(
            (prefix) =>
              module.moduleCode.startsWith(prefix) &&
              (module.moduleCode.toLowerCase().includes(searchLower) ||
                module.title.toLowerCase().includes(searchLower))
          )
        );
      } else {
        this.filteredModules = [];
      }
    },
    selectModule(module) {
      this.selectedModule = module; // Store the selected module
      this.moduleSearch = `${module.moduleCode} ${module.title}`; // Show module code and title in search bar
      this.filteredModules = []; // Optionally clear the suggestions
    },
    addModule() {
      if (this.selectedModule) {
        this.$emit("module-selected", this.selectedModule); // Emit with the selected module data
        this.$emit("close"); // Optionally close the dialog
      }
    },
  },
};
</script>

<style scoped>
.title {
  font-weight: bold;
  font-size: 30px;
}

.title-container {
  display: flex;
  justify-content: space-between; /* Aligns children to opposite ends */
  align-items: center; /* Centers children vertically in the container */
}

.button-container {
  display: flex;
  justify-content: flex-end; /* Aligns children (the button) to the right */
}

.module-dialog {
  position: fixed;
  top: 20%;
  left: 20%;
  width: 60%;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.module-searchbar {
  width: 100%;
  padding: 8px 15px;
  margin-top: 20px;
  margin-bottom: 30px;
}
.module-suggestions {
  list-style: none;
  padding: 0;
}
.module-suggestions li {
  padding: 10px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
}
.module-suggestions li:hover {
  background-color: #f0f0f0;
}
</style>
