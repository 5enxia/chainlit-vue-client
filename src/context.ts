import { inject, type InjectionKey, type App } from "vue";
import { ChainlitAPI } from "./api";
import type { Pinia } from "pinia";
import { useStateStore } from "./state";

const defaultChainlitContext: ChainlitAPI | undefined = undefined;

const ChainlitContextSymbol: InjectionKey<ChainlitAPI> =
  Symbol("ChainlitContext");
export interface Chainlit {
  install: (app: App) => void;
}

export const createChainlit = (api: ChainlitAPI, pinia: Pinia): Chainlit => {
  return {
    install(app: App) {
      app.provide(ChainlitContextSymbol, api);
      useStateStore(pinia);
    },
  };
}

export const useChainlitContext = () => {
  const context = inject(ChainlitContextSymbol, defaultChainlitContext);
  if (!context) {
    throw new Error(
      "useChainlitContext must be used within a provideChainlitContext"
    );
  }
  return context;
}

export { ChainlitContextSymbol };
