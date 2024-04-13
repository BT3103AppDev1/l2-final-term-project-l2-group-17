<template>
  <div id="app" class="container">
    <ModulePlanningHeader />
    <ModuleBox />
  </div>
</template>

<style>
.logo {
  max-width: 150px;
  height: auto;
}
</style>

<script>
import ModuleBox from "./components/ModuleBox.vue";
import ModulePlanningHeader from "./components/ModulePlanningHeader.vue";

export default {
  name: "App",
  components: {
    ModuleBox,
    ModulePlanningHeader,
  },
};
</script>
