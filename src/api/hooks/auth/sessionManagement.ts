// import { useChainlitContext } from '@/index';
import type { ChainlitAPI, State } from '@/index';
// import { useAuthStateStore } from './state';
import { storeToRefs, type Store } from 'pinia';

// export const useSessionManagement = () => {
  // const apiClient = useChainlitContext();
export const useSessionManagement = (apiClient: ChainlitAPI, store: Store<"state", State>) => {
  // const store = useAuthStateStore();
  // const { user, threadHistory } = storeToRefs(store);
  const { userState: user, threadHistoryState: threadHistory } = storeToRefs(store);

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
