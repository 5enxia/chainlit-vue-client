import { watch } from 'vue';
import type { IAuthConfig } from '@/index';

import { useApi } from '../api';
import { useAuthStateStore } from './state';

export const useAuthConfig = () => {
  const { authConfig, setAuthConfig } = useAuthStateStore();
  // const { data: authConfigData, isLoading } = useApi<IAuthConfig>(
  const { data: authConfigData, isValidating: isLoading } = useApi<IAuthConfig>(
    authConfig ? null : '/auth/config'
  );

  watch(authConfigData, (newVal) => {
    if (newVal) {
      setAuthConfig(newVal);
    }
  });

  return { authConfig, isLoading };
};
