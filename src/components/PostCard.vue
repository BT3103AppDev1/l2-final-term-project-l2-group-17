<template>
  <div class="post-card">
    <h3>{{ post.title }}</h3>
    <!-- Apply badge styling with dynamic color and positioning -->
    <span :class="['badge', categoryClass(post.category)]" class="category-badge">{{ post.category }}</span>
    <p>
      {{ isExpanded || !needsTruncation ? post.content : truncatedContent }}
      <span v-if="needsTruncation" @click.stop="toggleExpand" class="toggle-read">
        {{ isExpanded ? ' (Read Less)' : '... (Read More)' }}
      </span>
    </p>
    <footer>
      Posted by: {{ post.userName }} | Date: {{ formatDate(post.timestamp) }}
    </footer>
  </div>
</template>

<script>
export default {
  name: 'PostCard',
  props: {
    post: Object
  },
  data() {
    return {
      isExpanded: false,
    };
  },
  computed: {
    truncatedContent() {
      return this.post.content.substring(0, 100);
    },
    needsTruncation() {
      return this.post.content.length > 100;
    }
  },
  methods: {
    toggleExpand() {
      this.isExpanded = !this.isExpanded;
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
    }
  }
}
</script>

<style scoped>
.post-card {
  cursor: pointer;
  border: 1px solid #ccc;
  padding: 20px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.toggle-read {
  color: blue;
  cursor: pointer;
  text-decoration: underline;
}

.category-badge {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  padding: 0.25em 0.4em; /* Adjust padding to make the badge snug around the text */
  font-size: 75%; /* Adjust font size as per design needs */
  align-self: flex-start; /* Aligns the badge to the left */
}

.bg-purple {
  background-color: #6f42c1 !important; /* Example purple color, adjust as needed */
}

.bg-green {
  background-color: green;
}

p {
  word-break: break-word;
}
</style>
