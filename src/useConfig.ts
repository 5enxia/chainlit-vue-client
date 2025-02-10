import { watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useStateStore } from '@/state';

import { useApi, useAuth } from '@/api';
import type { IChainlitConfig } from '@/types';

const useConfig = () => {
  const store = useStateStore();
  const { configState: config } = storeToRefs(store);
  const { isAuthenticated } = useAuth();
  const language = navigator.language || 'en-US';

  const { data, error, isValidating: isLoading } = useApi<IChainlitConfig>(
    !config.value && isAuthenticated ? `/project/settings?language=${language}` : null
  );

  watch(data, (newValue) => {
    if (!newValue) return;
    config.value = newValue;
  })

  return { config, error, isLoading, language };
};

export { useConfig };
