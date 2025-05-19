import {defineStore} from 'pinia';
import {ref} from "vue";

export const useAuthStore = defineStore('auth', () => {
  const user = ref(sessionStorage.getItem('A_user'));

  function setUser(_user: string) {
    sessionStorage.setItem('A_user', _user);
    user.value = _user;
  }

  return {user, setUser}
})

