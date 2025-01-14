import { watch } from 'vue';
import type { ChainlitAPI, IAuthConfig, State } from '@/index';

import { useApi } from '../api';
// import { useAuthStateStore } from './state';
import { storeToRefs, type Store } from 'pinia';

export const useAuthConfig = (client: ChainlitAPI, store: Store<"state", State>) => {
  // const store = useAuthStateStore();
  const { authState: authConfig } =  storeToRefs(store)
  const { data: authConfigData, isValidating: isLoading } = useApi<IAuthConfig>(
    client,
    store,
    authConfig.value ? null : '/auth/config'
  );

  watch(authConfigData, (newVal) => {
    if (newVal) {
      authConfig.value = newVal;
    }
  });

  return { authConfig, isLoading };
};
