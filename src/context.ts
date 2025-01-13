import { provide, inject, type InjectionKey } from 'vue';
import { ChainlitAPI } from './api';

const defaultChainlitContext: ChainlitAPI | undefined = undefined;

const ChainlitContextSymbol: InjectionKey<ChainlitAPI> = Symbol('ChainlitContext');

export function provideChainlitContext() {
  const chainlitContext = new ChainlitAPI('http://localhost:8000', 'webapp');
  provide(ChainlitContextSymbol, chainlitContext);
}

export function useChainlitContext() {
  const context = inject(ChainlitContextSymbol, defaultChainlitContext);
  if (!context) {
    throw new Error('useChainlitContext must be used within a provideChainlitContext');
  }
  return context;
}

export { defaultChainlitContext };