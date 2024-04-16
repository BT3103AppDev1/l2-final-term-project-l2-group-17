<template>
    <div class="module-item" draggable="true" @dragstart="startDrag">
      <div class="module-details">
        {{ module.id }} {{ module.title }}
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: ['module'],
    methods: {
      startDrag(event) {
        const moduleData = {
          moduleCode: this.module.id,  
          title: this.module.title,
          id: 'module-box-' + this.module.id
        };
        event.dataTransfer.setData('application/json', JSON.stringify(moduleData));
      }
    }
  }
  </script>
  
  <style scoped>
  .module-item {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 16px;
    width: 100%;
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    position: relative;
    margin-bottom: 20px; 
  flex: 1 1 calc(50% - 10px); /* Adjust the subtraction value to account for the gap */ 
  }
  </style>
  