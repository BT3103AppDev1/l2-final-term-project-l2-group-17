<template>
  <div class="app-container">  
    <div class="left-column"> 
      <div class="title">Required Modules</div>
      <div
        class="box"
        @drop="onDrop($event, 1)"
        @dragenter.prevent
        @dragover.prevent
      > 
        <div
          v-for="item in getList(1)"
          :key="item.id"
          class="module"
          draggable="true"
          @dragstart="startDrag($event, item)"
        >
          <span> {{ item.title }}</span>
        </div>
      </div> 
      <div class="list-group">
        <div
          v-for="(requirement, index) in requirements"
          :key="index"
          class="list-group-item"
        > 
          <button
            type="button"
            class="list-group-item list-group-item-action"
            @click="toggleContent(index)"
          >
            {{ requirement.name }} 
            <span class="arrow-icon" :class="{ 'rotate': requirement.showContent }"></span>
          </button> 
          <div v-if="requirement.showContent" class="dropdown-content"> 
            {{ getContent(requirement.name) }}
          </div>
        </div>
      </div>
    </div>  
    <div class="right-column"> 
      <div class="year-container">
        <div class="title">Study Plan</div> 
        <div class="year-box"> 
          <div class="subtitle">Year 1</div>
          <div
            class="box semester-box"
            @drop="onDrop($event, 2)"
            @dragenter.prevent
            @dragover.prevent
          >
            <div class="mc-count">MCs: {{ mcCount(2) }}</div>
            <div class="subtitle">Semester 1</div>
            <div
              v-for="item in getList(2)"
              :key="item.id"
              class="module"
              draggable="true"
              @dragstart="startDrag($event, item)"
            >
              <span> {{ item.title }}</span>
              <span class="remove-icon" @click="removeModule(item)">❌</span>
              <span class="mc-indicator">4 MCs</span>
            </div>
          </div>
 
          <div
            class="box semester-box"
            @drop="onDrop($event, 3)"
            @dragenter.prevent
            @dragover.prevent
          >
            <div class="mc-count">MCs: {{ mcCount(3) }}</div>
            <div class="subtitle">Semester 2</div>
            <div
              v-for="item in getList(3)"
              :key="item.id"
              class="module"
              draggable="true"
              @dragstart="startDrag($event, item)"
            >
              <span> {{ item.title }}</span>
              <span class="remove-icon" @click="removeModule(item)">❌</span>
              <span class="mc-indicator">4 MCs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { ref, reactive } from "vue";

export default {
  setup() {
    const items = ref([
      { id: 0, title: "Module A", list: 1, MCs: 4 },
      { id: 1, title: "Module B", list: 1, MCs: 4 },
      { id: 2, title: "Module C", list: 2, MCs: 4 },
    ]);

    const requirements = reactive([
      { name: "Common Curriculum", content: "Content for Common Curriculum", showContent: false },
      { name: "Unrestricted Electives", content: "Content for Unrestricted Electives", showContent: false },
      { name: "Core Major Modules", content: "Content for Core Major Modules", showContent: false },
    ]);

    const getList = (list) => items.value.filter((item) => item.list === list);

    const startDrag = (event, item) => {
      event.dataTransfer.setData("itemID", item.id.toString());
    };

    const onDrop = (event, list) => {
      event.preventDefault();
      const itemID = parseInt(event.dataTransfer.getData("itemID"));
      const item = items.value.find((item) => item.id === itemID);
      if (item && item.list !== list) {
        item.list = list;
      }
    };

    const removeModule = (item) => {
      item.list = 1;  
    };

    const mcCount = (list) => getList(list).reduce((total, item) => total + item.MCs, 0);

    const toggleContent = (index) => {
      requirements[index].showContent = !requirements[index].showContent;
    };

    const getContent = (requirementName) => {
      switch (requirementName) {
        case 'Common Curriculum':
          return 'Content for Common Curriculum';
        case 'Unrestricted Electives':
          return 'Content for Unrestricted Electives';
        case 'Core Major Modules':
          return 'Content for Core Major Modules';
        default:
          return '';
      }
    };

    return { getList, startDrag, onDrop, removeModule, mcCount, toggleContent, getContent, requirements };
  },
};
</script>


<style>
.req-modules {
  display: flex;
}

.box {
  padding: 10px;
  min-height: 10px;
  margin: 0 10px;
  width: calc(50% - 20px);
}
.module {
  position: relative;
  display: inline-block;
  background-color: #89cff0;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 30px 40px;
  margin-bottom: 20px;
  margin-right: 20px;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
  top: 5px;
  

}
.module:hover {
  background-color: #72a0c1;
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
  top: 5px;
  right: 5px;
}

.year-container {
  width: 50%;
  padding: 10px;
}

.year-box {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border: 2px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
}

.semester-box {
  flex: 1;
  margin: 0 10px;
  padding: 80px;
  border: 2px dashed #ccc;  
  min-height: 200px;  
}

.mc-indicator { 
  position: absolute;
  bottom: 5px;
  right: 5px;
  font-size: 12px;
}

.mc-count {
  text-align: center;
}

.title {
  text-align: center;
  font-size: 30px;
  padding-left: 90px;
  padding-top: 30px;
  font-weight: bold;
  margin-bottom: 10px;
}

.expanded {
  height: auto !important;
}

.app-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;  
  width: 100%;  
}

.left-column, .right-column {
  flex: 1; 
} 
.year-container {
  width: 100%;
  padding: 10px;
}
.subtitle {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.arrow-icon {

    display: inline-block;
    width: 0;
    height: 0;
    margin-left: 5px;  
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid black;  
    transition: transform 0.3s;
  }
 
  .rotate {
    transform: rotate(180deg);
  }
</style>