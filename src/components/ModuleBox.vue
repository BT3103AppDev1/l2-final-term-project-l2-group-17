<template>
  <div class="drop-zones-container">
    <div class="drop-zone" @drop="onDrop($event,1)" @dragenter.prevent @dragover.prevent>
      <div class="zone-title">Required Modules</div>
      <div v-for="item in getList(1)" :key="item.id" class="drag-el" draggable="true" @dragstart="startDrag($event,item)">
        <span> {{ item.title }}</span>
      </div>
    </div>
    <div class="drop-zone" @drop="onDrop($event, 2)" @dragenter.prevent @dragover.prevent>
      <div class="zone-title">Study Plan</div>
      <div v-for="item in getList(2)" :key="item.id" class="drag-el" draggable="true" @dragstart="startDrag($event,item)">
        <span> {{ item.title }}</span>
        <span class="remove-icon" @click="removeModule(item)">❌</span>
      </div>
 

    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const items = ref([
      { id: 0, title: 'Module A', list: 1 },
      { id: 1, title: 'Module B', list: 1 },
      { id: 2, title: 'Module C', list: 2 },
    ])

    const getList = (list) => {
      return items.value.filter((item) => item.list === list)
    }

    const startDrag = (event, item) => {
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('itemID', item.id)
    }

    const onDrop = (event, list) => {
      const itemID = event.dataTransfer.getData('itemID')
      const item = items.value.find((item) => item.id === parseInt(itemID))
      item.list = list
    }

    const removeModule = (item) => {
      item.list = 1 // Move the item back to the first list
    }

    return {
      getList,
      onDrop,
      startDrag,
      removeModule 
    }
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.drop-zones-container {
  display: flex; 
}

.drop-zone {
  flex: 1;  
  background-color: #ecf0f1;
  padding: 10px;
  min-height: 10px;
  margin: 0 10px;  
}

.drag-el {
  position: relative; /* Add relative positioning */
  display: inline-block; /* Change to inline-block for proper layout */
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
  margin-right: 10px;
  cursor: pointer;
}

.drag-el:hover {
  background-color: #72A0C1
}
.drag-el:hover .remove-icon {
  display: inline; /* Show remove icon on hover */
}

.drag-el:last-child {
  margin-bottom: 0;
}

.zone-title {
  font-weight: bold;
  margin-bottom: 5px;
}

.remove-icon {
  font-size: 16px;
  color: #ff0000; 
  cursor: pointer; 
  display:none;
} 
</style>
