import { storeToRefs } from 'pinia';
import { useStateStore } from '@/state';

export const useAuthState = () => {
  const store = useStateStore();
  const {
    authState: authConfig,
    userState: user,
    threadHistoryState: threadHistory,
  } = storeToRefs(store);

  return {
    authConfig,
    user,
    threadHistory
  }
}
