<template>
    <div :id="module.code" class="mt-3 mb-4">
      <button
        :class="['btn', isSelected ? 'btn-secondary' : 'btn-primary']"
        @click="handleClickModule"
      >
        <div :style="{ width: '200px', margin: '-10px', backgroundColor: getModuleColors(requirement) }">
          <div class="d-flex justify-content-between flex-row">
            <a v-if="module && module.code" :href="`https://nusmods.com/courses/${module.code}/`" target="_blank" rel="noopener noreferrer" class="text-white" style="font-size: 20px; font-weight: 600;">
                {{ module.code }}
            </a>

            <template v-if="isSelectable">
              <div v-b-tooltip.hover title="Delete">
                <button @click.stop="handleClickDelete" class="btn btn-danger">
                  Delete
                </button>
              </div>
            </template>
            <template v-if="isRevertable">
              <div v-b-tooltip.hover title="Revert">
                <button @click.stop="handleClickRevert" class="btn btn-warning">
                  Revert
                </button>
              </div>
            </template>
          </div>
          <p class="mt-3 mb-0 text-white">{{ module.name }}</p>
        </div>
      </button>
    </div>
  </template>
  
  <script>
  // Import Bootstrap CSS for styling
  import 'bootstrap/dist/css/bootstrap.min.css';
  
  export function getModuleColors(requirement) {
    if (requirement === 'commonModules') {
      return 'text-primary';  
    } else if (requirement === 'primaryDegreeModules') {
      return 'text-danger';  
    } else if (requirement === 'secondDegreeModules' || requirement === 'secondMajorModules') {
      return 'text-success';  
    } else if (requirement === 'minorModules') {
      return 'text-muted';  
    }
  } 
  
  export default {
    props: {
      module: Object,
      requirement: String,
      selectedModules: Array,
      isSelectable: Boolean,
      isRevertable: Boolean,
    },
    methods: {
      handleClickDelete(event) {
        event.stopPropagation();
        this.$emit('delete-module', this.module);
      },
      handleClickModule() {
        if (this.isSelectable) {
          if (this.isSelected) {
            this.$emit('deselect-module', this.module);
          } else {
            this.$emit('select-module', this.module, this.requirement);
          }
        }
      },
      handleClickRevert() {
        if (this.isRevertable) {
          this.$emit('revert-module', this.module, this.requirement);
        }
      },
    },
    computed: {
      isSelected() {
        return (
          this.isSelectable &&
          this.selectedModules.some(
            (selectedModuleObject) =>
              selectedModuleObject.module.code === this.module.code &&
              selectedModuleObject.requirement === this.requirement
          )
        );
      },
    },
  };
  </script>
  
  <style scoped>
  </style>
  