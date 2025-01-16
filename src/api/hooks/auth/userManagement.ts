import { watch } from 'vue';
import type { IUser } from '@/types';

import { useApi } from '../api';
// import { useAuthStateStore } from './state';
import { storeToRefs, type Store } from 'pinia';
import { useChainlitContext, type ChainlitAPI, type State } from '@/index';

export const useUserManagement = (store: Store<"state", State>) => {
  const clinet = useChainlitContext();
  // const store = useAuthStateStore();
  // const { user } = storeToRefs(store);
  const { userState: user } = storeToRefs(store);

  const {
    data: userData,
    error,
    isValidating: isLoading,
    mutate: setUserFromAPI
  } = useApi<IUser>(store, '/user');

  watch(userData, (newVal) => {
    if (newVal) {
      user.value = newVal;
    } else if (isLoading.value) {
      user.value = undefined;
    }
  });

  watch(error, (newVal) => {
    if (newVal) {
      user.value = null;
    }
  });

  return { user, setUserFromAPI };
};
