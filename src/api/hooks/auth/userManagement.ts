import { watch } from 'vue';
import type { IUser } from '@/types';

import { useApi } from '../api';
// import { useAuthStateStore } from './state';
import { storeToRefs, type Store } from 'pinia';
import type { ChainlitAPI, State } from '@/index';

export const useUserManagement = (client: ChainlitAPI, store: Store<"state", State>) => {
  // const store = useAuthStateStore();
  // const { user } = storeToRefs(store);
  const { userState: user } = storeToRefs(store);

  const {
    data: userData,
    error,
    isValidating: isLoading,
    mutate: setUserFromAPI
  } = useApi<IUser>(client, store, '/user');

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
