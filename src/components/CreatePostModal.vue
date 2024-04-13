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
import { ref, onMounted } from 'vue';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min';
import { db, auth } from '../firebase';
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default {
  name: 'CreatePostModal',
  setup() {
    const postTitle = ref('');
    const postCategory = ref('study guide');
    const postContent = ref('');
    const currentUser = ref(null);
    const userDetails = ref({});

    let modalInstance = null;

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        currentUser.value = user;
        await fetchUserDetails(user.uid); 
      } else {
      }
    });

    const fetchUserDetails = async (userId) => {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        userDetails.value = userSnap.data();
      } else {
        console.error("No such user!");
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
      if (!currentUser.value) {
        console.error("No authenticated user");
        return;
      }
      const postData = {
        title: postTitle.value,
        category: postCategory.value,
        content: postContent.value,
        userId: currentUser.value.uid,
        userName: userDetails.value.username,  
        timestamp: new Date(),
        likes: {}
      };

      try {
        const docRef = await addDoc(collection(db, "posts"), postData);
        console.log("Document written with ID: ", docRef.id);
        hideModal();  
      } catch (e) {
        console.error("Error adding document: ", e);
      };

      hideModal();
    };

    onMounted(() => {
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
