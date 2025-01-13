import { watch } from 'vue';
import type { IUser } from '@/types';

import { useApi } from '../api';
import { useAuthStateStore } from './state';

export const useUserManagement = () => {
  const { user, setUser } = useAuthStateStore();

  const {
    data: userData,
    error,
    isValidating: isLoading,
    mutate: setUserFromAPI
  } = useApi<IUser>('/user');

  watch(userData, (newVal) => {
    if (newVal) {
      setUser(newVal);
    } else if (isLoading.value) {
      setUser(undefined);
    }
  });

  watch(error, (newVal) => {
    if (newVal) {
      setUser(null);
    }
  });

  return { user, setUserFromAPI };
};
