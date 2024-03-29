<template>
    <button id="btn" @click="signOut" v-if="user">Logout</button>
  </template>
  
  <script>
  import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
  
  export default {
    name: 'Logout',
    data() {
      return {
        user: false,
      };
    },
    mounted() {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.user = user;
        }
      });
    },
    methods: {
      async signOut() {
        const auth = getAuth();
        try {
          await signOut(auth);
          this.$router.push({ name: 'Login' });
        } catch (error) {
          // Handle error - maybe log it or show a message to the user
        }
      }
    }
  }
  </script>
  
  <style scoped>
  #btn {
    text-align: auto;
    margin: auto;
  }
  #btn:hover {
    color: white;
    background-color: blue;
    box-shadow: 3px 3px grey;
  }
  </style>
  