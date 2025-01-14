import { watch } from 'vue';
import { useApi, useAuth } from '@/api';
import { useStateStore } from '@/state';
import type { IChainlitConfig } from '@/types';
import { storeToRefs } from 'pinia';

const useConfig = () => {
  const store = useStateStore();
  const { configState: config } = storeToRefs(store);
  const { isAuthenticated } = useAuth();
  const language = navigator.language || 'en-US';

  const { data, error, isValidating: isLoading } = useApi<IChainlitConfig>(
    !config && isAuthenticated ? `/project/settings?language=${language}` : null
  );

  watch(data, (newValue) => {
    if (!newValue) return;
    config.value = newValue;
  })

  return { config, error, isLoading, language };
};

export { useConfig };
