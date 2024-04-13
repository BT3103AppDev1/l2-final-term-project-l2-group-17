<template>
    <div class="error-container">
      <h1>Error: No user logged in</h1>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Error'
  }
  </script>
  
  <style scoped>
  .error-container {
    padding: 20px;
    background-color: #ffdddd;
    border-left: 6px solid #f44336;
    margin: 20px 0;
    text-align: center;
  }
  
  h1 {
    margin: 0;
    font-size: 18px;
    color: #d8000c;
  }
  </style>
  