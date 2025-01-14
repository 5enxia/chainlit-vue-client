import type { IAuthConfig, IUser } from '@/types';

import { useAuthConfig } from './config';
import { useSessionManagement } from './sessionManagement';
import { useUserManagement } from './userManagement';
import type { ChainlitAPI, State } from '@/index';
import type { Store } from 'pinia';

export const useAuth = (client: ChainlitAPI, store: Store<"state", State>) => {
  const { authConfig } = useAuthConfig(client, store);
  const { logout } = useSessionManagement(client, store);
  const { user, setUserFromAPI } = useUserManagement(client, store);

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
