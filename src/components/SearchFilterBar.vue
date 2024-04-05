<template>
    <div class="input-group mb-4">
      <input type="text" class="form-control" placeholder="Search post titles or tags..." aria-label="Search">
      <select class="form-select" aria-label="Sort by">
        <option selected>Sort By</option>
        <option value="latest">Latest</option>
        <option value="popular">Most Popular</option>
      </select>
      <select class="form-select" aria-label="Filter by">
        <option selected>Filter By</option>
        <option value="study-guide">Study Guide</option>
        <option value="module-review">Module Review</option>
      </select>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SearchFilterBar'
  }
  </script>
  