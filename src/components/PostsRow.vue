<!-- PostsRow.vue -->
<template>
    <div class="container">
      <div class="row">
        <div class="col" v-for="(post, index) in posts" :key="index">
          <!-- You can use Bootstrap's card component for each post -->
          <PostCard :post="post" />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import PostCard from './PostCard.vue'; // Assume you have a PostCard component for individual posts
  
  export default {
    props: {
      posts: Array,
    },
    components: {
      PostCard,
    },
  };
  </script>
  