<template>
  <div class="modal" tabindex="-1" id="createPostModalRef" ref="createPostModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">New Post</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="hideModal"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="postTitle" class="form-label">Post Title</label>
            <input type="text" class="form-control" id="postTitle" v-model="postTitle">
          </div>
          <div class="mb-3">
            <label for="postCategory" class="form-label">Category</label>
            <select id="postCategory" class="form-select" v-model="postCategory">
              <option value="study guide">Study Guide</option>
              <option value="module review">Module Review</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="postContent" class="form-label">Content</label>
            <textarea id="postContent" class="form-control" v-model="postContent" rows="4"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="submitPost">Create Post</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toRefs, ref, onMounted } from 'vue';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min';
import { db } from '../firebase';
import { collection, addDoc, doc, getDoc, Timestamp } from "firebase/firestore";

export default {
  name: 'CreatePostModal',
  props: {
    currentUser: Object,
  },
  setup(props, { emit }) {
    const postTitle = ref('');
    const postCategory = ref('study guide');
    const postContent = ref('');
    const userDetails = ref({});
    const { currentUser } = toRefs(props);

    let modalInstance = null;

    const fetchUserDetails = async () => {
      if (currentUser.value && currentUser.value.uid) {
        const userRef = doc(db, "users", currentUser.value.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          userDetails.value = userSnap.data();
          console.log("Fetched user details:", userDetails.value);
        } else {
          console.error("No such user!");
        }
      }
    };

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

    const submitPost = async () => {
      if (!currentUser.value || !userDetails.value.username) {
        console.error("No authenticated user or username is missing");
        return;
      }
      const postData = {
        title: postTitle.value,
        category: postCategory.value,
        content: postContent.value,
        userId: currentUser.value.uid,
        userName: userDetails.value.username, 
        timestamp: Timestamp.fromDate(new Date()),
        likes: {}
      };

      try {
        const docRef = await addDoc(collection(db, "posts"), postData);
        console.log("Document written with ID: ", docRef.id);
        emit('post-created', { id: docRef.id, ...postData });
        postTitle.value = '';
        postCategory.value = 'study guide'; 
        postContent.value = '';
        hideModal();  
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    };

    onMounted(() => {
      fetchUserDetails();
      const modalEl = document.getElementById('createPostModalRef');
      modalInstance = new bootstrap.Modal(modalEl);
    });

    return {
      postTitle,
      postCategory,
      postContent,
      showModal,
      hideModal,
      submitPost
    };
  },
};
</script>
