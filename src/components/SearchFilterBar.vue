<template>
  <div class="input-group mb-4">
    <input type="text" class="form-control" placeholder="Search by post titles..." aria-label="Search" @input="updateSearch">
    <select class="form-select" aria-label="Sort by" @change="updateSort">
      <option value="latest" selected>Latest</option>
      <option value="popular">Most Popular</option>
      <option value="mine">Posts Created by You</option>
    </select>
    <select class="form-select" aria-label="Filter by" @change="updateCategory">
      <option value="" selected>All Categories</option>
      <option value="study guide">Study Guide</option>
      <option value="module review">Module Review</option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'SearchFilterBar',
  methods: {
    updateSearch(event) {
      this.$emit('update-search', event.target.value);
    },
    updateSort(event) {
      this.$emit('update-sort', event.target.value);
    },
    updateCategory(event) {
      this.$emit('update-category', event.target.value);
    }
  }
}
</script>

<style scoped>
.input-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
  align-items: center;
}

.form-control,
.form-select {
  flex-grow: 1;
}
</style>
