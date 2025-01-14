// import { useRecoilState, useSetRecoilState } from 'recoil';
import { defineStore } from 'pinia';
import { useStateStore } from '@/state';
import { computed } from 'vue';
import type { IAuthConfig, IUser, ThreadHistory } from '@/types';

export const useAuthStateStore = defineStore('authState', () => {

  const { authState: authConfig, setAuthState: setAuthConfig } = useStateStore();
  const { userState: user, setUserState: setUser } = useStateStore();
  const { setThreadHistoryState: setThreadHistory } = useStateStore();

  return {
    authConfig,
    setAuthConfig,
    user,
    setUser,
    setThreadHistory
  };
});
