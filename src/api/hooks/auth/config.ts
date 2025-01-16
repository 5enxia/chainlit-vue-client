import { watch } from 'vue';
import type { IAuthConfig } from '@/index';

import { useApi } from '../api';
import { useAuthState } from './state';

export const useAuthConfig = () => {
  const { authConfig } = useAuthState();
  const { data: authConfigData, isValidating: isLoading } = useApi<IAuthConfig>(
    authConfig.value ? null : '/auth/config'
  );

  watch(authConfigData, (newVal) => {
    if (newVal) {
      authConfig.value = newVal;
    }
  });

  return { authConfig, isLoading };
};
