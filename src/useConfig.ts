import { watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useStateStore } from '@/state';

import { useApiWithRef, useAuth } from '@/api';
import type { IChainlitConfig } from '@/types';

const useConfig = () => {
  const store = useStateStore();
  const { configState: config } = storeToRefs(store);
  const { isAuthenticated } = useAuth();
  const language = navigator.language || 'en-US';

  const { data, error, isValidating: isLoading } = useApiWithRef<IChainlitConfig>(() => !config.value && isAuthenticated.value ? `/project/settings?language=${language}` : null);

  watch(data, (newValue) => {
    if (!newValue) return;
    config.value = newValue;
  })

  return { config, error, isLoading, language };
};

export { useConfig };
