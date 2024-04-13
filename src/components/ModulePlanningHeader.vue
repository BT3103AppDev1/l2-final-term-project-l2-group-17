<template>
  <div class="container">
    <header class="row align-items-center" style="padding-top: 30px">
      <div class="col-auto">
        <img src="../assets/modunus_logo.jpeg" alt="Logo" class="logo" />
      </div>
      <div class="col">
        <MajorSelectDropdown />
      </div>
      <div class="col-auto">
        <button class="btn btn-primary">Load Course Requirements</button>
      </div>
    </header>
  </div>
</template>

<script>
import MajorSelectDropdown from "./MajorSelectDropdown.vue";

export default {
  name: "ModulePlanningHeader",
  components: {
    MajorSelectDropdown,
  },
};
</script>
