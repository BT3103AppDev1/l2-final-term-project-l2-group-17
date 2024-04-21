<template>
    <div class="community-header">
      <div class="container text-center text-md-start">
        <div class="row align-items-center">
          <div class="col-md-7">
            <h1 class="display-5 fw-bold">The best study resources.</h1>
            <p class="lead">By you, for you.</p>
            <button @click="openModal" class="btn btn-primary lg-3">
              <font-awesome-icon :icon="['fas', 'plus']" /> Make your post today
              <!-- <i class="bi bi-plus-lg"></i> Make your post today -->
            </button>
          </div>
          <div class="col-md-5 d-none d-md-block">
            <img src="../../assets/learning_icon.png" alt="Learning Icon" class="img-fluid" style="max-width: 84%;">
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
  import { library } from '@fortawesome/fontawesome-svg-core';
  import { faPlus } from '@fortawesome/free-solid-svg-icons';

  library.add(faPlus);

  export default {
    components: {
    FontAwesomeIcon,
  },
    name: 'CommunityHeader',
    methods: {
        openModal() {
            this.$emit('open-modal-event');
        }
    }
  }
  </script>
  
  <style scoped>
  .community-header {
    background-color: #e7f2ff;
    padding: 2rem 0;
    margin: 1rem 0;
    border-radius: 10px;
    margin-top: 0;
  }
  </style>
  