import type { IAuthConfig, IUser } from '@/types';

import { useAuthConfig } from './config';
import { useSessionManagement } from './sessionManagement';
import { useUserManagement } from './userManagement';

export const useAuth = () => {
  const { authConfig } = useAuthConfig();
  const { logout } = useSessionManagement();
  const { user, setUserFromAPI } = useUserManagement();

  const isReady =
    !!authConfig && (!authConfig.value?.requireLogin || user !== undefined);

  if (authConfig && !authConfig.value?.requireLogin) {
    return {
      data: authConfig,
      user: null,
      isReady,
      isAuthenticated: true,
      logout: () => Promise.resolve(),
      setUserFromAPI: () => Promise.resolve()
    };
  }

  return {
    data: authConfig,
    user,
    isReady,
    isAuthenticated: !!user,
    logout,
    setUserFromAPI
  };
};

export type { IAuthConfig, IUser };
