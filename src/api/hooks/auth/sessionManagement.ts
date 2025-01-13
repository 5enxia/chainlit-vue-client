import { useChainlitContext } from '@/index';
import { useAuthStateStore } from './state';

export const useSessionManagement = () => {
  const apiClient = useChainlitContext();
  const { setUser, setThreadHistory } = useAuthStateStore();

  const logout = async (reload = false): Promise<void> => {
    await apiClient.logout();
    setUser(undefined);
    setThreadHistory(undefined);

    if (reload) {
      window.location.reload();
    }
  };

  return { logout };
};
