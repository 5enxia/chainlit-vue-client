import { watch } from 'vue';
import type { IAuthConfig } from '@/index';

import { useApiWithRef } from '../api';
import { useAuthState } from './state';

export const useAuthConfig = () => {
  const { authConfig } = useAuthState();
  const { data: authConfigData, isValidating: isLoading } = useApiWithRef<IAuthConfig>(
    () => authConfig.value ? null : '/auth/config'
  );

  watch(authConfigData, () => {
    if (authConfigData.value) {
      authConfig.value = authConfigData.value;
    }
  });

  return { authConfig, isLoading };
};
