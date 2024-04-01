<template>
    <div>
      <CommunityHeader @open-modal-event="openCreatePostModal"/>
      <CreatePostModal ref="createPostModal" />
      <SearchFilterBar />
      <div class="container">
        <h2>Top Posts</h2>
        <div class="row">
          <!-- Use v-for to render PostCard components for top posts -->
        </div>
        <h2>All Posts</h2>
        <div class="row">
          <!-- Use v-for to render PostCard components for all posts -->
        </div>
      </div>
      <!-- Include Back to Top Button -->
    </div>
  </template>
  
  <script>
  import CommunityHeader from './CommunityHeader.vue';
  import SearchFilterBar from './SearchFilterBar.vue';
  import CommunityDefaultPost from './CommunityDefaultPost.vue';
  import CreatePostModal from './CreatePostModal.vue';
  
  export default {
    name: 'CommunityPage',
    components: {
      CommunityHeader,
      SearchFilterBar,
      CommunityDefaultPost,
      CreatePostModal
    },
    methods: {
        openCreatePostModal() {
        // Use Bootstrap's JavaScript to open the modal
            this.$refs.createPostModal.showModal();
        },
    },
    data() {
      return {
        // Define data properties for top posts and all posts
      };
    }
  }
  </script>
  