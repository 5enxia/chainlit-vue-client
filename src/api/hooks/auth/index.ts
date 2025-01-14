import type { IAuthConfig, IUser } from '@/types';

import { useAuthConfig } from './config';
import { useSessionManagement } from './sessionManagement';
import { useUserManagement } from './userManagement';
import type { ChainlitAPI } from '@/index';

export const useAuth = (client: ChainlitAPI) => {
  const { authConfig } = useAuthConfig(client);
  const { logout } = useSessionManagement(client);
  const { user, setUserFromAPI } = useUserManagement(client);

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
