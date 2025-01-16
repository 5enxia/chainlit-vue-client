import { watch } from 'vue';
import { ChainlitAPI, useApi, useAuth } from '@/api';
import { useStateStore, type State } from '@/state';
import type { IChainlitConfig } from '@/types';
import { storeToRefs, type Store } from 'pinia';
import { useChainlitContext } from '.';

const useConfig = (store: Store<"state", State>) => {
  const client = useChainlitContext();
  // const store = useStateStore();
  const { configState: config } = storeToRefs(store);
  const { isAuthenticated } = useAuth(store);
  const language = navigator.language || 'en-US';

  const { data, error, isValidating: isLoading } = useApi<IChainlitConfig>(
    store,
    !config && isAuthenticated ? `/project/settings?language=${language}` : null
  );

  watch(data, (newValue) => {
    if (!newValue) return;
    config.value = newValue;
  })

  return { config, error, isLoading, language };
};

export { useConfig };
