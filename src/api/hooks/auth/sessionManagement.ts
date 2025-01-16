import { useChainlitContext } from '@/index';
import { useAuthState } from './state';

export const useSessionManagement = () => {
  const apiClient = useChainlitContext();
  const { user, threadHistory } = useAuthState();

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
