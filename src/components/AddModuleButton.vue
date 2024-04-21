<template>
  <button class="add-module-btn">
    <span class="plus-symbol">+</span>
    Add Module
  </button>
</template>

<script>
export default {
  name: "AddModuleButton",
};
</script>

<style scoped>
.add-module-btn {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  width: 350px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  margin-bottom: 20px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.plus-symbol {
  font-size: 20px;
  margin-right: 5px;
}

.add-module-btn:hover {
  background-color: #f0f0f0;
}
</style>
