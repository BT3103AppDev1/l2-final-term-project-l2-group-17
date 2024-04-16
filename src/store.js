import { ref } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const useAuthStore = () => {
  const isAuthenticated = ref(false);

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    isAuthenticated.value = !!user;
  });

  return { isAuthenticated };
};
