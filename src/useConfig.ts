// import { useEffect } from 'react';
// import { useRecoilState } from 'recoil';

import { watch } from 'vue';
import { useApi, useAuth } from './api';
// import { configState } from './state';
import { useStateStore } from './state';
import type { IChainlitConfig } from './types';

const useConfig = () => {
  // const [config, setConfig] = useRecoilState(configState);
  const { configState: config, setConfigState: setConfig } = useStateStore();
  const { isAuthenticated } = useAuth();
  const language = navigator.language || 'en-US';

  const { data, error, isValidating: isLoading } = useApi<IChainlitConfig>(
    !config && isAuthenticated ? `/project/settings?language=${language}` : null
  );

  // useEffect(() => {
  //   if (!data) return;
  //   setConfig(data);
  // }, [data, setConfig]);
  watch(data, (newValue) => {
    if (!newValue) return;
    setConfig(newValue);
  })

  return { config, error, isLoading, language };
};

export { useConfig };
