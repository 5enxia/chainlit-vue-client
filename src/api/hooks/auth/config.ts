import { watch } from 'vue';
import type { ChainlitAPI, IAuthConfig } from '@/index';

import { useApi } from '../api';
import { useAuthStateStore } from './state';
import { storeToRefs } from 'pinia';

export const useAuthConfig = (client: ChainlitAPI) => {
  const store = useAuthStateStore();
  const { authConfig } =  storeToRefs(store)
  const { data: authConfigData, isValidating: isLoading } = useApi<IAuthConfig>(
    client,
    authConfig ? null : '/auth/config'
  );

  watch(authConfigData, (newVal) => {
    if (newVal) {
      authConfig.value = newVal;
    }
  });

  return { authConfig, isLoading };
};
