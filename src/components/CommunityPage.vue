<template>
  <div>
    <CommunityHeader @open-modal-event="openCreatePostModal"/>
    <CreatePostModal ref="createPostModal" />
    <SearchFilterBar />
    <div class="container">
      <h2>Posts</h2>
      <div class="row">
        <PostCard
          v-for="post in allPosts"
          :key="post.id"
          :post="post"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '../firebase'; 
import { collection, query, orderBy, getDocs } from "firebase/firestore";
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
  methods: {
    openCreatePostModal() {
      this.$refs.createPostModal.showModal();
    },
    async fetchPosts() {
      const querySnapshot = await getDocs(query(collection(db, "posts"), orderBy("timestamp", "desc")));
      this.allPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  },

  data() {
    return {
      allPosts: [],
    }
  },
  mounted() {
    this.fetchPosts();
  }
}
</script>
