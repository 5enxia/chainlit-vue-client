import { inject, type InjectionKey, type App } from "vue";

import { ChainlitAPI } from "./api";
import type { Pinia } from "pinia";
import { useStateStore } from "./state";

const defaultChainlitContext: ChainlitAPI | undefined = undefined;

const ChainlitContextSymbol: InjectionKey<ChainlitAPI> =
  Symbol("ChainlitContext");

interface Options{
  pinia: Pinia;
}
export interface Chainlit {
  install: (app: App, options: Options) => void;
}

// https://stackoverflow.com/questions/71691842/how-to-use-pinia-inside-of-an-npm-package
export const createChainlit = (api: ChainlitAPI): Chainlit => {
  return {
    install(app: App, options: Options) {
      app.provide(ChainlitContextSymbol, api);

      const { pinia } = options;

      if (!pinia) {
        throw new Error("Pinia instance is required");
      }

      useStateStore(pinia);
    },
  };
};

export const useChainlitContext = () => {
  const context = inject(ChainlitContextSymbol, defaultChainlitContext);
  if (!context) {
    throw new Error(
      "useChainlitContext must be used within a provideChainlitContext"
    );
  }
  return context;
};

export { ChainlitContextSymbol };
