<template>
  <div>
    <select class="form-select">
      <option disabled selected>Select your major</option>
      <optgroup label="Arts and Social Sciences">
        <option value="Economics">Economics</option>
      </optgroup>
      <optgroup label="Computing">
        <option value="Computer Science">Computer Science</option>
        <option value="Business Analytics">Business Analytics</option>
        <option value="Information Systems">Information Systems</option>
      </optgroup>
      <optgroup label="Science">
        <option value="Mathematics">Mathematics</option>
      </optgroup>
    </select>
  </div>
</template>

<script>
export default {
  name: "<MajorSelectDropdown>",
};
</script>
