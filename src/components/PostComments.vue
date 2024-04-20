<template>
  <div class="comments-section">
    <h3 class="comments-title">
      Comments
      <button @click="toggleVisibility" class="toggle-comments-btn">
        <font-awesome-icon :icon="commentsVisible ? 'chevron-up' : 'chevron-down'" class="icon"/>
      </button>
    </h3>
    <div v-if="commentsVisible" class="comments-list">
      <div v-for="comment in comments" :key="comment.id" class="comment">
        <div class="comment-content">
          <div class="comment-header">
            <span class="comment-author">{{ comment.authorName }}</span>
            <span class="comment-date">{{ formatDate(comment.timestamp) }}</span>
          </div>
          <div class="comment-body">
            <template v-if="editingCommentId === comment.id">
              <textarea v-model="editableCommentText" class="comment-edit-textarea"></textarea>
              <div class="comment-edit-actions">
                <button @click="updateComment(comment.id, editableCommentText)" class="btn-icon">
                  <font-awesome-icon icon="save" class="icon-save"/> Save
                </button>
                <button @click="cancelEdit" class="btn-icon">
                  <font-awesome-icon icon="times" class="icon-cancel"/> Cancel
                </button>
              </div>
            </template>
            <template v-else>
              {{ comment.text }}
            </template>
          </div>
        </div>
        <div class="comment-actions">
          <font-awesome-icon icon="ellipsis-v" class="action-icon" @click="toggleDropdown(comment.id)" />
          <div v-if="dropdownCommentId === comment.id" class="action-dropdown">
            <div class="dropdown-item" @click="() => editComment(comment)">
              <font-awesome-icon icon="edit" class="fa-icon"/>
               Edit
            </div>
            <div class="dropdown-item" @click="() => deleteComment(comment.id)">
              <font-awesome-icon icon="trash" class="fa-icon"/>
               Delete
            </div>
          </div>
        </div>
      </div>
    </div>

    <form v-if="commentsVisible" @submit.prevent="submitComment" class="comment-form">
      <textarea v-model="newCommentText" placeholder="Write a comment..." class="comment-textarea"></textarea>
      <button type="submit" class="comment-submit-btn">Post Comment</button>
    </form>
  </div>
</template>

  
  
<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { db, auth } from '../firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEllipsisV, faTrash, faEdit, faChevronUp, faChevronDown, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
library.add(faEllipsisV, faTrash, faEdit, faChevronUp, faChevronDown, faSave, faTimes);


export default {
  components: {
    FontAwesomeIcon,
  },

  props: ['postId'],
  setup(props) {
    const newCommentText = ref('');
    const comments = ref([]);
    const currentUser = ref(null);
    const userDetails = ref({});
    const editingCommentId = ref('');
    const editableCommentText = ref('');
    const commentsVisible = ref(false);
    const dropdownCommentId = ref(null);

    // Fetch user details from Firestore based on current user ID
    const fetchUserDetails = async (userId) => {
      const userRef = doc(db, "users", userId);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        userDetails.value = docSnap.data();
      } else {
        console.error("No such user!");
      }
    };

    onAuthStateChanged(auth, (user) => {
      if (user) {
        currentUser.value = user;
        fetchUserDetails(user.uid);
      }
    });

    const toggleVisibility = () => {
      commentsVisible.value = !commentsVisible.value;
    };

    const toggleDropdown = (id) => {
      dropdownCommentId.value = dropdownCommentId.value === id ? null : id;
    };

    const submitComment = async () => {
      if (newCommentText.value.trim() && currentUser.value && userDetails.value.username) {
        const commentData = {
          postId: props.postId,
          authorName: userDetails.value.username, // Using username fetched from Firestore
          userId: currentUser.value.uid,
          text: newCommentText.value,
          timestamp: new Date()
        };

        try {
          await addDoc(collection(db, 'comments'), commentData);
          newCommentText.value = '';
        } catch (error) {
          console.error("Error posting comment: ", error);
        }
      } else {
        console.error("Cannot post comment without an authenticated user with a username.");
      }
    };

    const formatDate = (timestamp) => {
      const date = timestamp && timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleString("en-US", {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true // If you want 12-hour format with AM/PM
      });
    };

    // Fetch comments for the post
    const commentsRef = collection(db, 'comments');
    const q = query(commentsRef, where('postId', '==', props.postId), orderBy('timestamp', 'desc'));

    const editComment = (comment) => {
      editingCommentId.value = comment.id;
      editableCommentText.value = comment.text;
      dropdownCommentId.value = null;
    };

    const updateComment = async (commentId, updatedText) => {
      try {
        const commentRef = doc(db, 'comments', commentId);
        await updateDoc(commentRef, { text: updatedText });
        alert('Comment updated successfully!');
        editingCommentId.value = null;
        editableCommentText.value = '';
      } catch (error) {
        console.error("Error updating comment: ", error);
        alert('Failed to update comment!');
      }
    };

    const deleteComment = async (commentId) => {
      dropdownCommentId.value = null;
      if (window.confirm("Are you sure you want to delete this comment?")) {
        try {
          const commentRef = doc(db, 'comments', commentId);
          await deleteDoc(commentRef);
          alert('Comment deleted successfully!');
        } catch (error) {
          console.error("Error deleting comment: ", error);
          alert('Failed to delete comment!');
        }
      }
    };

    const cancelEdit = () => {
      editingCommentId.value = '';
      editableCommentText.value = '';
    };

    onSnapshot(q, (snapshot) => {
        comments.value = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
            id: doc.id,
            ...data,
            timestamp: data.timestamp ? (data.timestamp.toDate ? data.timestamp.toDate() : new Date(data.timestamp)) : null
            };
        });
    });


    return {
      newCommentText,
      comments,
      submitComment,
      userDetails,
      formatDate,
      editingCommentId,
      editableCommentText,
      editComment,
      updateComment,
      deleteComment,
      cancelEdit,
      currentUser,
      toggleVisibility,
      commentsVisible,
      toggleDropdown,
      dropdownCommentId,
    };
  }
};
</script>


  
<style scoped>
.comments-section {
  margin-top: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.comments-title {
  margin-bottom: 5px;
  color: #333;
  font-size: 1.0rem;
  display: flex;
  align-items: center;
  gap: 11px;
}

.comments-list {
  max-height: 300px; 
  overflow-y: auto;
  margin-bottom: 20px;
  padding-right: 4px; /* For scrollbar space */
}

.comment {
  padding: 10px;
  border-bottom: 1px solid #e1e1e1;
  white-space: pre-wrap; 
}

.comment:last-child {
  border-bottom: none;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  margin-bottom: 8px;
}

.comment-author {
  font-weight: 600;
  color: #007bff; 
}

.comment-date {
  color: #666;
  text-align: right;
}

.comment-body {
  font-size: 1rem;
  line-height: 1.4;
  color: #333;
}

.comment-form {
  display: flex;
  flex-direction: column;
}

.comment-edit-actions {
  display: flex;
  justify-content: flex-start;
}

.comment-textarea {
  resize: vertical;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  margin-bottom: 10px;
}

.comment-submit-btn {
  align-self: flex-end;
  padding: 10px 20px;
  font-size: 0.875rem;
  color: #fff;
  background-color: #007bff; 
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.comment-submit-btn:hover {
  background-color: #0056b3; /* Darker shade for hover state */
}

.toggle-comments-btn {
  background-color: #e7e7e7;
  color: black;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px; /* Adjust font-size as necessary */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px; /* Creates a little space between icon and text */
}

.toggle-comments-btn:hover {
  background-color: #bfbfbf;
  transition: background-color 0.3s ease;
}

/* Style for Font Awesome icons */
.action-icon {
  cursor: pointer;
  color: var(--secondary-color, #007bff); 
}

.action-dropdown {
  position: absolute;
  right: 10px; 
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  border-radius: 4px;
  overflow: hidden;
  z-index: 5;
}

.dropdown-item {
  padding: 10px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.dropdown-item:hover {
  background-color: #f0f0f0;
}
.fa-icon {
  margin-right: 8px; 
}

.comment-actions {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.comment-edit-textarea {
  width: 100%; 
  height: 100px; 
  margin-bottom: 10px;
}

.btn-icon {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #007bff; /* Adjust the color to fit your design */
  padding: 5px 10px;
  font-size: 1rem; /* Adjust the size as needed */
  display: flex;
  align-items: center;
}

.btn-icon:hover {
  color: #0056b3; /* Darker shade on hover */
}

.icon-save {
  margin-right: 5px;
}

.icon-cancel {
  margin-right: 5px;
}

/* Mobile responsive adjustments */
@media (max-width: 768px) {
  .comments-section {
    padding: 15px;
  }

  .comments-title {
    font-size: 1.25rem;
  }

  .comment-form {
    flex-direction: column-reverse;
  }

  .comment-textarea {
    margin-bottom: 8px;
  }

  .comment-submit-btn {
    width: 100%;
    margin-bottom: 8px;
  }
}
</style>
