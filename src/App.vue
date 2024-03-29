<template>
  <div id="app">
    <Login/>
    <Logout/>
    <SignUp/>
    <ResetPassword/>
    <ForgotPassword/>
  </div>
</template>


<script setup>
  import Login from './components/Login.vue';
  import Logout from './components/Logout.vue';
  import SignUp from './components/SignUp.vue';
  import ResetPassword from './views/ResetPassword.vue';
  import ForgotPassword from './views/ForgotPassword.vue';


  const name = 'App';
  const components = {
    Login,
    Logout,
    SignUp,
  };

  const views = {
    ForgotPassword,
    ResetPassword,
  };
  
</script>



