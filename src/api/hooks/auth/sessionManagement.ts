import { useChainlitContext } from '@/index';
import { useAuthStateStore } from './state';
import { storeToRefs } from 'pinia';

export const useSessionManagement = () => {
  const apiClient = useChainlitContext();
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
