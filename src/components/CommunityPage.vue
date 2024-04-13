<template>
  <div>
    <CommunityHeader @open-modal-event="openCreatePostModal"/>
    <CreatePostModal ref="createPostModal" />
    <SearchFilterBar 
      @update-search="handleSearch" 
      @update-sort="handleSort" 
      @update-category="handleCategory" />
    <div class="container">
      <h2>Posts</h2>
      <div class="row">
        <PostCard
          v-for="post in filteredPosts"
          :key="post.id"
          :post="post"
          :currentUser="currentUser"
          @update-post="handleUpdate"
          @delete-post="handleDelete"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { db } from '../firebase'; 
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';
import CommunityHeader from './CommunityHeader.vue';
import SearchFilterBar from './SearchFilterBar.vue';
import PostCard from './PostCard.vue';
import CreatePostModal from './CreatePostModal.vue';

export default {
  name: 'CommunityPage',
  components: {
    CommunityHeader,
    SearchFilterBar,
    PostCard,
    CreatePostModal,
  },
  data() {
    return {
      allPosts: [],
      currentUser: null,
      searchQuery: '',
      sortOption: 'latest',
      filterCategory: ''
    };
  },
  computed: {
    filteredPosts() {
      let posts = [...this.allPosts];
      if (this.searchQuery) {
        posts = posts.filter(post => post.title.toLowerCase().includes(this.searchQuery.toLowerCase()));
      }
      
      if (this.filterCategory) {
        posts = posts.filter(post => post.category === this.filterCategory);
      }

      switch (this.sortOption) {
        case 'popular':
          posts.sort((a, b) => Object.keys(b.likes || {}).length - Object.keys(a.likes || {}).length);
          break;
        case 'mine':
          posts = posts.filter(post => post.userId === this.currentUser.uid);
          break;
        case 'latest':
        default:
          posts.sort((a, b) => b.timestamp.toDate() - a.timestamp.toDate()); // Ensure timestamps are compared correctly
          break;
      }
      return posts;
    }
  },
  methods: {
    openCreatePostModal() {
      this.$refs.createPostModal.showModal();
    },
    async fetchPosts() {
      const querySnapshot = await getDocs(query(collection(db, "posts"), orderBy("timestamp", "desc")));
      this.allPosts = querySnapshot.docs.map(doc => {
        const data = doc.data();
        data.id = doc.id; 
        data.timestamp = data.timestamp || new Date();
        return data;
      });
    },
    handleSearch(query) {
      this.searchQuery = query;
    },
    handleSort(sortOption) {
      this.sortOption = sortOption;
    },
    handleCategory(category) {
      this.filterCategory = category;
    },
    handleUpdate(updatedPost) {
      const index = this.allPosts.findIndex(post => post.id === updatedPost.id);
      if (index !== -1) {
        this.allPosts[index] = updatedPost;
        this.allPosts = [...this.allPosts]; 
      }
    },
    handleDelete(postId) {
      this.allPosts = this.allPosts.filter(post => post.id !== postId);
    }
  },
  mounted() {
    this.fetchPosts();
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
    });
  }
}
</script>

<style>
</style>
