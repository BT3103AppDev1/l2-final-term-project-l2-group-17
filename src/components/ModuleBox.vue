
<template>
  <div class="req-modules">
    <div class="box" @drop="onDrop($event, 1)" @dragenter.prevent @dragover.prevent>
      <div class="title">Required Modules</div>
      <div v-for="item in getList(1)" :key="item.id" class="module" draggable="true" @dragstart="startDrag($event,item)">
        <span> {{ item.title }}</span>
      </div>
    </div>
    
    <div class="year-container">
      <div class="title">Study Plan</div>
      <div class="year-box">
        <div class="box semester-box" @drop="onDrop($event, 2)" @dragenter.prevent @dragover.prevent>
          <div class="mc-count">MCs: {{ mcCount(2) }}</div>
          <div class="title">Semester 1</div>  
           <div v-for="item in getList(2)" :key="item.id" class="module" draggable="true" @dragstart="startDrag($event,item)">
            <span> {{ item.title }}</span>
            <span class="remove-icon" @click="removeModule(item)">❌</span>
            <span class="mc-indicator">4 MCs</span>  
          </div>
        </div>

        <div class="box semester-box" @drop="onDrop($event, 3)" @dragenter.prevent @dragover.prevent>
          <div class="mc-count">MCs: {{ mcCount(3) }}</div>
          <div class="title">Semester 2</div>  
          <div v-for="item in getList(3)" :key="item.id" class="module" draggable="true" @dragstart="startDrag($event,item)">
            <span> {{ item.title }}</span>
            <span class="remove-icon" @click="removeModule(item)">❌</span>
            <span class="mc-indicator">4 MCs</span>  
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const items = ref([
      { id: 0, title: 'Module A', list: 1, MCs: 4 },
      { id: 1, title: 'Module B', list: 1, MCs: 4 },
      { id: 2, title: 'Module C', list: 2, MCs: 4 },
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
      if (item.list !== list) {
        item.list = list
      }
    }

    const removeModule = (item) => {
      item.list = 1 // Move the item back to the first list
    }

    const mcCount = (list) => {
      return getList(list).reduce((total, item) => total + item.MCs, 0)
    }

    return {
      getList,
      onDrop,
      startDrag,
      removeModule,
      mcCount
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

.req-modules {
  display: flex;
}

.box {
  background-color: #ecf0f1;
  padding: 10px;
  min-height: 10px;
  margin: 0 10px;
  width: calc(50% - 20px);  
}
.module {
  position: relative;
  display: inline-block;
  background-color:  #89CFF0;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 60px 80px; 
  margin-bottom: 20px;  
  margin-right: 20px;  
  cursor: pointer;
  font-size: 20px;  
  font-weight:bold;
  top:5px;

}
.module:hover {
  background-color: #72A0C1;
}
.module:hover .remove-icon {
  display: inline;
}

.module:last-child {
  margin-bottom: 0;
}
 

.remove-icon {
  font-size: 20px;
  color: #ff0000;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
}

.year-container {
  width: 50%;  
  background-color: #e0e0e0;
  padding: 10px;
}

.year-box {
  display: flex;
}


.semester-box {
  margin: 0 10px; 
  padding: 80px;
}

.mc-indicator {
  position: absolute;
  bottom: 5px;
  right: 5px;
  font-size: 12px;  
}

.title {
  text-align: center;  
  font-size: 50px; 
  font-weight: bold; 
  margin-bottom: 10px;  
}

</style>
