// import { useChainlitContext } from '@/index';
import type { ChainlitAPI } from '@/index';
import { useAuthStateStore } from './state';
import { storeToRefs } from 'pinia';

// export const useSessionManagement = () => {
  // const apiClient = useChainlitContext();
export const useSessionManagement = (apiClient: ChainlitAPI) => {
  const store = useAuthStateStore();
  const { user, threadHistory } = storeToRefs(store);

  const logout = async (reload = false): Promise<void> => {
    await apiClient.logout();
    user.value = undefined;
    threadHistory.value = undefined;

    if (reload) {
      window.location.reload();
    }
  };

  return { logout };
};
