import { watch } from 'vue';
import type { IUser } from '@/types';

import { useApi } from '../api';
import { useAuthState } from './state';

export const useUserManagement = () => {
  const { user } = useAuthState()

  const {
    data: userData,
    error,
    isValidating: isLoading,
    mutate: setUserFromAPI
  } = useApi<IUser>('/user');

  watch([userData, isLoading], ([newVal]) => {
    if (newVal) {
      user.value = newVal;
    } else if (isLoading.value) {
      user.value = undefined;
    }
  });

  watch(error, () => {
    if (error.value) {
      user.value = null;
    }
  });

  return { user, setUserFromAPI };
};
