<template>
    <div class="card mb-3">
      <div class="card-body">
        <h5 class="card-title">Post Title</h5>
        <p class="card-text">Post excerpt or content...</p>
        <div class="d-flex justify-content-between align-items-center">
          <small class="text-muted">3 days ago</small>
          <div>
            <button class="btn btn-outline-primary" type="button">
              <i class="bi bi-hand-thumbs-up"></i> Like
            </button>
            <button class="btn btn-outline-secondary" type="button">
              <i class="bi bi-chat"></i> Comment
            </button>
          </div>
        </div>
        <!-- Tags and other details here -->
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CommunityDefaultPost',
  }
  </script>
  