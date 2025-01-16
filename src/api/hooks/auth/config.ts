import { watch } from 'vue';
import { useChainlitContext, type ChainlitAPI, type IAuthConfig, type State } from '@/index';

import { useApi } from '../api';
// import { useAuthStateStore } from './state';
import { storeToRefs, type Store } from 'pinia';

export const useAuthConfig = (store: Store<"state", State>) => {
  const client = useChainlitContext();
  // const store = useAuthStateStore();
  const { authState: authConfig } =  storeToRefs(store)
  const { data: authConfigData, isValidating: isLoading } = useApi<IAuthConfig>(
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
