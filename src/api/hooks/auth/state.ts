// import { useRecoilState, useSetRecoilState } from 'recoil';
import { defineStore } from 'pinia';
import { useStateStore } from '@/state';

// export const useAuthStateStore = defineStore('authState', () => {
export const useAuthStateStore = () => {
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
// });
}
