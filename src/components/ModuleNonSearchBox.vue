<template>
  <div class="module-item" draggable="true" @dragstart="startDrag">
    <span class="title">{{ header }}</span>
    <div class="module-details">{{ module.moduleCode }} {{ module.title }}</div>
  </div>
</template>

<script>
export default {
  props: ["module", "category", "header"],
  methods: {
    startDrag(event) {
      const moduleData = {
        moduleCode: this.module.moduleCode,
        title: this.module.title,
        category: this.category,
      };
      event.dataTransfer.setData(
        "application/json",
        JSON.stringify(moduleData)
      );
    },
  },
};
</script>

<style scoped>
.module-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  width: 350px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  margin-top: 10px;
  margin-bottom: 10px;
}

.title {
  font-weight: bold;
  font-size: 20px;
}
</style>
