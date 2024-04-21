<template>
  <div class="post-card">
    <div class="header">
      <h3>{{ post.title }}</h3>
      <button @click="toggleLike" class="like-button" :class="{ liked:liked }">
        <font-awesome-icon :icon="['fas', 'thumbs-up']" /> <span>{{ likeCount }}</span>
      </button>
    </div>
    <div v-if="isEditing">
      <input v-model="editablePost.title" placeholder="Post Title" class="form-control mb-2"/>
      <select v-model="editablePost.category" class="form-control mb-2">
        <option value="study guide">Study Guide</option>
        <option value="module review">Module Review</option>
      </select>
      <textarea v-model="editablePost.content" placeholder="Post Content" class="form-control mb-2"></textarea>
      <button @click="savePost" class="btn-icon">
        <font-awesome-icon icon="save" class="icon-save"/> Save
      </button>
      <button @click="cancelEdit" class="btn-icon">
        <font-awesome-icon icon="times" class="icon-cancel"/> Cancel
      </button>
    </div>
    <div v-else>
      <span :class="['badge', categoryClass(post.category)]" class="category-badge">{{ post.category }}</span>
      <p class="post-content">
        {{ isExpanded || !needsTruncation ? post.content : truncatedContent }}
        <span v-if="needsTruncation" @click.stop="toggleExpand" class="toggle-read">
          {{ isExpanded ? ' (Read Less)' : '... (Read More)' }}
        </span>
      </p>
      <footer class="post-footer">
        Posted by: {{ post.userName }} | Date: {{ formatDate(post.timestamp) }}
        <div v-if="canEdit" class="post-actions">
          <button class="icon-button" @click="toggleActionsDropdown">
            <font-awesome-icon icon="ellipsis-v" class="action-icon" />
          </button>
            <div v-if="showActionsDropdown" class="actions-dropdown">
              <div class="dropdown-item" @click="editPost">
                <font-awesome-icon icon="edit" class="fa-icon" />
                Edit
              </div>
              <div class="dropdown-item" @click="deletePost">
                <font-awesome-icon icon="trash" class="fa-icon" />
                  Delete
              </div>
            </div>
        </div>
      </footer>
    </div>
    <PostComments :postId="post.id" />
  </div>
</template>

<script>
import { db } from '../firebase';
import { doc, updateDoc, deleteDoc, deleteField } from "firebase/firestore";
import PostComments from './PostComments.vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faEllipsisV, faEdit, faTrash, faThumbsUp } from '@fortawesome/free-solid-svg-icons';

library.add(faEllipsisV, faEdit, faTrash, faThumbsUp);

export default {
  components: {
    PostComments,
    FontAwesomeIcon,
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
      liked: this.post.likes && this.currentUser && this.post.likes[this.currentUser.uid],
      showActionsDropdown: false,
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
      this.showActionsDropdown = false;
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
      this.showActionsDropdown = false;
      if (window.confirm("Are you sure you want to delete this comment?")) {
        const postRef = doc(db, "posts", this.post.id);
        deleteDoc(postRef)
          .then(() => {
            this.$emit('delete-post', this.post.id);
          })
          .catch(error => {
            console.error("Error deleting post: ", error);
          });
      }
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
    },
    toggleActionsDropdown() {
      this.showActionsDropdown = !this.showActionsDropdown;
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
  cursor: pointer;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 5px;
  color: #686868;
}

.like-button:hover {
  color: #007bff
}

.like-button.liked {
  color: #007bff; 
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

.post-content {
  white-space: pre-wrap; 
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

.btn-icon {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #007bff; 
  padding: 5px 10px;
  font-size: 1rem; 
  align-items: center;
}

.btn-icon:hover {
  color: #0056b3;
}

.post-footer {
  display: flex;
  justify-content: space-between; 
  align-items: center; 
}

.post-actions {
  position: relative; 
}

.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px; 
  height: 30px; 
  border-radius: 50%; 
  border: none; 
  background-color: #eee; 
  cursor: pointer;
}

.icon-button:hover, .icon-button:focus {
  background-color: #ccc; 
}

.action-icon {
  cursor: pointer;
  color: #007bff;
}

.actions-dropdown {
  position: absolute;
  top: 100%; 
  right: 0; 
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  z-index: 10; 
}

.dropdown-item {
  padding: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.dropdown-item:hover {
  background-color: #f8f8f8;
}

.fa-icon {
  margin-right: 5px;
}

</style>
