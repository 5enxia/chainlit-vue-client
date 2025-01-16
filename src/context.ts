import { inject, type InjectionKey, type App } from "vue";
import { ChainlitAPI } from "./api";

const defaultChainlitContext: ChainlitAPI | undefined = undefined;

const ChainlitContextSymbol: InjectionKey<ChainlitAPI> =
  Symbol("ChainlitContext");
export interface Chainlit {
  install: (app: App) => void;
}

export function createChainlit(api: ChainlitAPI): Chainlit {
  return {
    install(app: App) {
      app.provide(ChainlitContextSymbol, api);
    },
  };
}

export function useChainlitContext() {
  const context = inject(ChainlitContextSymbol, defaultChainlitContext);
  if (!context) {
    throw new Error(
      "useChainlitContext must be used within a provideChainlitContext"
    );
  }
  return context;
}

export { ChainlitContextSymbol };
