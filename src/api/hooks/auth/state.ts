// import { useRecoilState, useSetRecoilState } from 'recoil';
import { defineStore } from 'pinia';
import { useStateStore } from '@/state';
import { computed } from 'vue';
import type { IAuthConfig, IUser, ThreadHistory } from '@/types';

export const useAuthStateStore = defineStore('authState', () => {

  const { authState, setAuthState } = useStateStore();
  const { userState, setUserState} = useStateStore();
  const { setThreadHistoryState } = useStateStore();

  const authConfig = computed(() => authState);
  const setAuthConfig = (config: IAuthConfig) => {
    setAuthState(config);
  }

  const user = computed(() => userState);
  const setUser = (newUser: IUser | undefined | null) => {
    setUserState(newUser);
  };

  const setThreadHistory = (history: ThreadHistory | undefined) => {
    setThreadHistoryState(history);
  };

  return {
    authConfig,
    setAuthConfig,
    user,
    setUser,
    setThreadHistory
  };
});
