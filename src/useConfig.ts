import { watch } from 'vue';
import { ChainlitAPI, useApi, useAuth } from '@/api';
import { useStateStore } from '@/state';
import type { IChainlitConfig } from '@/types';
import { storeToRefs } from 'pinia';

const useConfig = (client: ChainlitAPI) => {
  const store = useStateStore();
  const { configState: config } = storeToRefs(store);
  const { isAuthenticated } = useAuth(client);
  const language = navigator.language || 'en-US';

  const { data, error, isValidating: isLoading } = useApi<IChainlitConfig>(
    client,
    !config && isAuthenticated ? `/project/settings?language=${language}` : null
  );

  watch(data, (newValue) => {
    if (!newValue) return;
    config.value = newValue;
  })

  return { config, error, isLoading, language };
};

export { useConfig };
