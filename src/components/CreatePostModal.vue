<template>
    <div class="modal" tabindex="-1" id="createPostModalRef" ref="createPostModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">New Post</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="postTitle" class="form-label">Post Title</label>
              <input type="text" class="form-control" id="postTitle" v-model="postTitle">
            </div>
            <!-- Add more form fields here -->
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="submitPost">Create Post</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <!-- <script>
  import { ref } from 'vue';
  import axios from 'axios';
  
  export default {
    name: 'CreatePostModal',
    setup() {
      const postTitle = ref('');
      // Other form fields like postCategory, formContent, selectedMajor etc. will be declared here
      // ...
  
      const submitPost = async () => {
        if (!validateForm()) {
          alert('Please fill in all required fields.');
          return;
        }
        
        // Construct the form data
        const formData = {
          title: postTitle.value,
          // Include other data fields similar to the React component
        };
  
        try {
          const response = await axios.post('/your-post-api-endpoint', formData);
          console.log(response.data);
          // Handle the success response, close modal, and refresh page or redirect
        } catch (error) {
          console.error('There was an error uploading the post:', error);
          // Handle errors here
        }
      };
  
      const validateForm = () => {
        // Perform validation checks here
        // Return true if form is valid, false otherwise
      };
  
      const closeModal = () => {
        const modalEl = this.$refs.createPostModal;
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();
      };
  
      return {
        postTitle,
        submitPost,
        closeModal
      };
    }
  };
  </script> -->

  <script>
  import { ref, onMounted } from 'vue';
  import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min';
  
  export default {
    name: 'CreatePostModal',
    setup() {
      const postTitle = ref('');
  
      // It's better to define showModal and hideModal methods to manage modal visibility
      let modalInstance = null;
      
      const showModal = () => {
        if (modalInstance) {
          modalInstance.show();
        }
      };
  
      const hideModal = () => {
        if (modalInstance) {
          modalInstance.hide();
        }
      };
  
      onMounted(() => {
        const modalEl = document.getElementById('createPostModalRef'); // Make sure the ID matches
        modalInstance = new bootstrap.Modal(modalEl);
      });
  
      return {
        postTitle,
        showModal,
        hideModal
      };
    },
  };
  </script>
  