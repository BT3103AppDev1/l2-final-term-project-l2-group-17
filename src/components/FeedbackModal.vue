<template>
    <div class="feedback-modal-overlay" @click.self="closeModal">
      <div class="feedback-modal">
        <header class="modal-header">
          <h3>Share your feedback</h3>
        </header>
        <form @submit.prevent="submitFeedback">
          <h4 class="feedback-question">What do you think of our app?</h4>
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" v-model="feedback.name" required>
          </div>
          <div class="form-group">
            <label for="feedback">Feedback *</label>
            <textarea id="feedback" v-model="feedback.content" required></textarea>
          </div>
          <div class="form-actions">
            <button type="submit" class="submit-btn">Submit</button>
            <button type="button" @click="closeModal" class="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Success Message Overlay -->
    <div v-if="isSuccessMessageVisible" class="success-message-overlay" @click.self="closeSuccessMessage">
      <div class="success-message">
        <p>Your feedback has been successfully submitted. Thank you!</p>
        <button @click="closeSuccessMessage" class="btn btn-success">OK</button>
      </div>
    </div>
</template>
    
<script>
// Import the necessary Firebase functions
import { getFirestore, doc, setDoc, collection, arrayUnion } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default {
    name: 'FeedbackModal',
    data() {
    return {
        feedback: {
        name: '',
        content: '',
        },
        isSuccessMessageVisible: false, 
    };
    },
    methods: {
    closeModal() {
        this.$emit('close');
    },
    async submitFeedback() {
        const auth = getAuth();
        const db = getFirestore();

        if (auth.currentUser) {
            const userId = auth.currentUser.uid;
            const userFeedbackDocRef = doc(db, "feedback", userId);

            try {
                await setDoc(userFeedbackDocRef, {
                    responses: arrayUnion({
                    name: this.feedback.name,
                    content: this.feedback.content,
                    timestamp: new Date()
                })
                }, { merge: true });

            this.isSuccessMessageVisible = true; // Show success message
            this.feedback.name = '';
            this.feedback.content = '';
            // Do not close the modal here, so the user can see the success message
        } catch (error) {
            console.error('Failed to submit feedback:', error);
        }
        } else {
        console.error('User is not logged in');
        }
    },
    closeSuccessMessage() {
        this.isSuccessMessageVisible = false;
        this.closeModal(); // Emit the close event to parent component
    },
    },
};
</script>
  
<style scoped>
.feedback-question {
  font-size: 1rem;
  margin-bottom: 1rem;
  color: #333; 
}
.feedback-modal-overlay {
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background-color: rgba(0, 0, 0, 0.5);
display: flex;
align-items: center;
justify-content: center;
}

.feedback-modal {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h3 {
  font-size: 1.25rem;
  color: #333;
  margin: 0;
}

.close-btn {
  font-size: 1.5rem;
  color: #333;
  cursor: pointer;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.form-group label {
  margin-bottom: .5rem;
  color: #666;
}

.form-group input,
.form-group textarea {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

.form-group textarea {
  min-height: 120px; /* Adjust the height of the textarea */
  resize: vertical; /* Allow only vertical resizing */
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.submit-btn,
.cancel-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  margin-left: 10px;
  font-size: 0.9rem;
  cursor: pointer;
}

.submit-btn {
  background-color: #007bff;
  color: white;
}

.cancel-btn {
  background-color: #6c757d;
  color: white;
}

/* Success Message Overlay */
.success-message-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.6); /* Darker overlay for better contrast */
  z-index: 1500; /* Ensure it's above other elements */
}

/* Success Message Box */
.success-message {
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 400px; /* Adjust the width as necessary */
  text-align: center; /* Center the text for better readability */
}

/* Success Message Text */
.success-message p {
  font-size: 1.125rem; /* Slightly larger text for emphasis */
  color: #2e2e2e; /* Dark grey color for the text */
  margin: 0 0 1.5rem 0; /* Space below the paragraph */
  line-height: 1.6; /* Improved line spacing */
}

/* Success Message Button */
.btn-success {
  color: #fff;
  background-color: #007bff;
  border: none;
  padding: 0.625rem 1.25rem;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  outline: none; /* Remove outline to maintain style consistency */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow for the button */
  transition: background-color 0.2s; /* Smooth background color transition */
}

/* Button hover effect */
.btn-success:hover {
  background-color: #003268; /* Slightly darker on hover for visual feedback */
}
.close-btn, .submit-btn, .cancel-btn {
  cursor: pointer;
}
</style>
  