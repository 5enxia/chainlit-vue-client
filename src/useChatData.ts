import { storeToRefs } from "pinia";
import { useStateStore } from "./state";
import { computed, ref, watch } from "vue";

export interface IToken {
  id: number | string;
  token: string;
  isSequence: boolean;
  isInput: boolean;
}

const useChatData = () => {
  const store = useStateStore();
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

  const connected = ref(false)
  watch(session, () => {
    if (session.value) {
      connected.value = session.value.socket.connected && !session.value.error
    }
  }, { deep: true })

  const disabled = computed(() => {
    return !connected.value || loading.value || askUser.value?.spec.type === 'file' || askUser.value?.spec.type === 'action'
  })

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
