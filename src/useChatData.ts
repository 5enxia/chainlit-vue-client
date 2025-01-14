import { storeToRefs, type Store } from "pinia";
import { useStateStore, type State } from "./state";

export interface IToken {
  id: number | string;
  token: string;
  isSequence: boolean;
  isInput: boolean;
}

const useChatData = (store: Store<"state", State>) => {
  // const store = useStateStore();
  const {
    loadingState: loading,
    elementState: elements,
    tasklistState: tasklists,
    actionState: actions,
    sessionState: session,
    askUserState: askUser,
    callFnState: callFn,
    chatSettingsInputsState: chatSettingsInputs,
    chatSettingsValueState: chatSettingsValue,
    chatSettingsDefaultValue
  } = storeToRefs(store);


  const connected = session.value?.socket.connected && !session.value?.error;
  const disabled =
    !connected ||
    loading ||
    askUser.value?.spec.type === 'file' ||
    askUser.value?.spec.type === 'action';

  return {
    actions,
    askUser,
    callFn,
    chatSettingsDefaultValue,
    chatSettingsInputs,
    chatSettingsValue,
    connected,
    disabled,
    elements,
    error: session.value?.error,
    loading,
    tasklists
  };
};

export { useChatData };
