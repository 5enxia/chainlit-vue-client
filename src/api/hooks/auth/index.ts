import type { IAuthConfig, IUser } from '@/types';

import { useAuthConfig } from './config';
import { useSessionManagement } from './sessionManagement';
import { useUserManagement } from './userManagement';
import { computed } from 'vue';

export const useAuth = () => {
  const { authConfig } = useAuthConfig();
  const { logout } = useSessionManagement();
  const { user, setUserFromAPI } = useUserManagement();

  const isReady = computed(() => {
    return !!authConfig.value && (!authConfig.value?.requireLogin || user.value !== undefined);
  })

  if (authConfig.value && !authConfig.value?.requireLogin) {
    return {
      data: authConfig,
      user: null,
      isReady,
      isAuthenticated: computed(() => true),
      logout: () => Promise.resolve(),
      setUserFromAPI: () => Promise.resolve()
    };
  }

  return {
    data: authConfig,
    user,
    isReady,
    isAuthenticated: computed(() => !!user.value), 
    logout,
    setUserFromAPI
  };
};

export type { IAuthConfig, IUser };
