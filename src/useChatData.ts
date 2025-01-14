// import { useRecoilValue } from 'recoil';

// import {
//   actionState,
//   askUserState,
//   callFnState,
//   chatSettingsDefaultValueSelector,
//   chatSettingsInputsState,
//   chatSettingsValueState,
//   elementState,
//   loadingState,
//   sessionState,
//   tasklistState
// } from './state';
import { useStateStore  } from "./state";

export interface IToken {
  id: number | string;
  token: string;
  isSequence: boolean;
  isInput: boolean;
}

const useChatData = () => {
  // const loading = useRecoilValue(loadingState);
  // const elements = useRecoilValue(elementState);
  // const tasklists = useRecoilValue(tasklistState);
  // const actions = useRecoilValue(actionState);
  // const session = useRecoilValue(sessionState);
  // const askUser = useRecoilValue(askUserState);
  // const callFn = useRecoilValue(callFnState);
  // const chatSettingsInputs = useRecoilValue(chatSettingsInputsState);
  // const chatSettingsValue = useRecoilValue(chatSettingsValueState);
  // const chatSettingsDefaultValue = useRecoilValue(
  //   chatSettingsDefaultValueSelector
  // );
  const { loadingState: loading } = useStateStore();
  const { elementState: elements } = useStateStore();
  const { tasklistState: tasklists } = useStateStore();
  const { actionState: actions } = useStateStore();
  const { sessionState: session } = useStateStore();
  const { askUserState: askUser } = useStateStore();
  const { callFnState: callFn } = useStateStore();
  const { chatSettingsInputsState: chatSettingsInputs } = useStateStore();
  const { chatSettingsValueState: chatSettingsValue } = useStateStore();
  const { chatSettingsDefaultValue } = useStateStore();


  const connected = session?.socket.connected && !session?.error;
  const disabled =
    !connected ||
    loading ||
    askUser?.spec.type === 'file' ||
    askUser?.spec.type === 'action';

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
    error: session?.error,
    loading,
    tasklists
  };
};

export { useChatData };
