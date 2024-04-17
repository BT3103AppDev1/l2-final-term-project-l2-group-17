<template>
  <div class="post-card">
    <div class="header">
      <h3>{{ post.title }}</h3>
      <button @click="toggleLike" class="like-button">
        👍 <span>{{ likeCount }}</span>
      </button>
    </div>
    <div v-if="isEditing">
      <input v-model="editablePost.title" placeholder="Post Title" class="form-control mb-2"/>
      <select v-model="editablePost.category" class="form-control mb-2">
        <option value="study guide">Study Guide</option>
        <option value="module review">Module Review</option>
      </select>
      <textarea v-model="editablePost.content" placeholder="Post Content" class="form-control mb-2"></textarea>
      <button @click="savePost" class="btn btn-success mr-2">Save</button>
      <button @click="cancelEdit" class="btn btn-secondary">Cancel</button>
    </div>
    <div v-else>
      <span :class="['badge', categoryClass(post.category)]" class="category-badge">{{ post.category }}</span>
      <p>
        {{ isExpanded || !needsTruncation ? post.content : truncatedContent }}
        <span v-if="needsTruncation" @click.stop="toggleExpand" class="toggle-read">
          {{ isExpanded ? ' (Read Less)' : '... (Read More)' }}
        </span>
      </p>
      <footer>
        Posted by: {{ post.userName }} | Date: {{ formatDate(post.timestamp) }}
        <span v-if="canEdit">
          <button @click="editPost" class="btn btn-outline-primary mr-2">Edit</button>
          <button @click="deletePost" class="btn btn-outline-danger">Delete</button>
        </span>
      </footer>
    </div>
  </div>
  <PostComments :postId="post.id" />
</template>

<script>
import { db } from '../firebase';
import { doc, updateDoc, deleteDoc, arrayRemove, arrayUnion, deleteField } from "firebase/firestore";
import PostComments from './PostComments.vue';

export default {
  components: {
    PostComments
  },
  emits: ['update-post', 'delete-post'],
  name: 'Post',
  props: {
    post: Object,
    currentUser: Object
  },
  data() {
    return {
      isExpanded: false,
      isEditing: false,
      editablePost: null,
      likeCount: this.post.likes ? Object.keys(this.post.likes).length : 0,
      liked: this.post.likes && this.currentUser && this.post.likes[this.currentUser.uid]
    };
  },
  computed: {
    truncatedContent() {
      return this.post.content.substring(0, 100);
    },
    needsTruncation() {
      return this.post.content.length > 100;
    },
    canEdit() {
      return this.currentUser && this.post.userId === this.currentUser.uid;
    }
  },
  methods: {
    toggleExpand() {
      this.isExpanded = !this.isExpanded;
    },
    editPost() {
      this.isEditing = true;
      this.editablePost = { ...this.post };
    },
    savePost() {
      const postRef = doc(db, "posts", this.post.id);
      updateDoc(postRef, {
        title: this.editablePost.title,
        content: this.editablePost.content,
        category: this.editablePost.category  
      }).then(() => {
        this.$emit('update-post', this.editablePost);
        this.isEditing = false;
        this.editablePost = null;
      }).catch(error => {
        console.error("Error updating document: ", error);
      });
    },
    deletePost() {
      const postRef = doc(db, "posts", this.post.id);
      deleteDoc(postRef)
        .then(() => {
          this.$emit('delete-post', this.post.id);
        })
        .catch(error => {
          console.error("Error deleting post: ", error);
        });
    },
    cancelEdit() {
      this.isEditing = false;
      this.editablePost = null;
    },
    formatDate(timestamp) {
      if (!timestamp) return '';
      const date = new Date(timestamp.seconds * 1000);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      }).format(date);
    },
    categoryClass(category) {
      return {
        'bg-green': category === 'study guide',
        'bg-purple': category === 'module review'
      };
    },
    toggleLike() {
      if (!this.currentUser) {
        alert("You must be logged in to like a post.");
        return;
      }
      const postRef = doc(db, "posts", this.post.id);
      if (this.liked) {
        updateDoc(postRef, {
          [`likes.${this.currentUser.uid}`]: deleteField()  
        }).then(() => {
          this.liked = false;
          this.likeCount--;
        }).catch(error => {
          console.error("Error updating like status: ", error);
        });
    } else {
        updateDoc(postRef, {
          [`likes.${this.currentUser.uid}`]: true
        }).then(() => {
          this.liked = true;
          this.likeCount++;
        }).catch(error => {
          console.error("Error updating like status: ", error);
        });
      }
    }

  }
}
</script>

<style scoped>
.post-card {
  border: 1px solid #ccc;
  padding: 20px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.like-button {
  background: none;
  border: none;
  color: blue;
  cursor: pointer;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
}

.toggle-read, .btn {
  color: blue;
  cursor: pointer;
  text-decoration: underline;
}

.category-badge {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  padding: 0.25em 0.4em;
  font-size: 75%;
  align-self: flex-start;
}

.bg-purple {
  background-color: #6f42c1 !important;
}

.bg-green {
  background-color: green;
}

p, .form-control, .btn {
  word-break: break-word;
}

.form-control {
  width: 100%;
  margin-bottom: 10px;
}

.btn-outline-primary, .btn-outline-danger {
  margin-right: 5px;
}
</style>
