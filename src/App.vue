<template>
  <div id="app" class="container">
    <header class="row align-items-center" style="padding-top: 30px">
      <div class="col-auto">
        <img src="./assets/modunus_logo.jpeg" alt="Logo" class="logo" />
      </div>
      <div class="col">
        <MajorSelectDropdown />
      </div>
      <div class="col-auto">
        <button class="btn btn-primary">Load Course Requirements</button>
      </div>
    </header>
  </div>
  <ModuleBox />
</template>

<style>
.logo {
  max-width: 150px;
  height: auto;
}
</style>

<script>
import ModuleBox from "./components/ModuleBox.vue";
import MajorSelectDropdown from "./components/MajorSelectDropdown.vue";

export default {
  name: "App",
  components: {
    ModuleBox,
    MajorSelectDropdown,
  },
};
</script>
