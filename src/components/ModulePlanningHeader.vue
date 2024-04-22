<template>
  <div class="planner-header">
    <div class="container text-center text-md-start">
      <div class="row align-items-center">
        <div class="col-md-7">
          <h1 class="display-5 fw-bold">Module Planner
              <font-awesome-icon icon="clipboard-list" class="ms-3" />
            </h1>
            <p class="lead">Organise your modules.</p>
        </div>
        <div class="col-md-5 d-none d-md-block">
          <img src="../../assets/planner.svg" alt="Planner" class="img-fluid">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faClipboardList);

export default {
  components: { FontAwesomeIcon},
  name: 'ModulePlanningHeader' 
}
</script>

<style scoped>
.planner-header {
  background-color: #e7f2ff;
  padding: 2rem 0;
  border-radius: 10px;
  margin: 1rem 0;
  margin-top: 0;
}
</style>
