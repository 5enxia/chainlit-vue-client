import { defineStore } from 'pinia';
import { isEqual, set } from 'lodash';
import { ref, computed, watch } from 'vue';
// import { Socket } from 'socket.io-client';
// import type { Socket } from 'socket.io-client';
import { Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

import type {
  IAction,
  IAsk,
  IAuthConfig,
  ICallFn,
  IChainlitConfig,
  IMessageElement,
  IStep,
  ITasklistElement,
  IUser,
  ThreadHistory
} from '@/types';
import { groupByDate } from '@/utils/group';
// import { WavRecorder, WavStreamPlayer } from './wavtools';

export interface ISession {
  socket: Socket;
  error?: boolean;
}

// TODO: Add types
export const useStateStore: any = defineStore('state', () => {
  const threadIdToResumeState = ref<string | undefined>(undefined);
  const setThreadIdToResumeState = (threadId: string | undefined) => {
    threadIdToResumeState.value = threadId;
  }

  const resumeThreadErrorState = ref<string | undefined>(undefined);
  const setResumeThreadErrorState = (error: string | undefined) => {
    resumeThreadErrorState.value = error;
  }

  const chatProfileState = ref<string | undefined>(undefined);
  const setChatProfileState = (profile: string | undefined) => {
    chatProfileState.value = profile
  }

  const sessionId = ref<string>(uuidv4());

  const sessionIdState = computed({
    get: () => sessionId.value,
    set: (newValue) => {
      sessionId.value = newValue ? uuidv4() : newValue;
    }
  });
  const resetSessionIdState = () => {
    sessionIdState.value = uuidv4();
  }

  const sessionState = ref<ISession | undefined>(undefined);
  const setSessionState = (session: ISession | undefined) => {
    sessionState.value = session;
  }
  const setSessionSocket = (socket: Socket) => {
    sessionState.value?.socket.removeAllListeners()
    sessionState.value?.socket.removeAllListeners()
    if (sessionState.value) {
      sessionState.value.socket = socket;
    }
  }
  const setSessionError = (error: boolean) => {
    if (sessionState.value) {
      sessionState.value.error = error;
    }
  }

  const actionState = ref<IAction[]>([]);
  const setActionState = (actions: IAction[]) => {
    actionState.value = actions;
  }
  const setActionState2 = (callback: (actions: IAction[]) => IAction[]) => {
    actionState.value = callback(actionState.value);
  }

  const messagesState = ref<IStep[]>([]);
  const setMessagesState = (messages: IStep[]) => {
    messagesState.value = messages;
  }
  const setMessagesState2 = (callback: (messages: IStep[]) => IStep[]) => {
    messagesState.value = callback(messagesState.value);
  }

  const tokenCountState = ref<number>(0);
  const setTokenCountState = (count: number) => {
    tokenCountState.value = count;
  }
  const setTokenCountState2 = (callback: (count: number) => number) => {
    tokenCountState.value = callback(tokenCountState.value);
  }

  const loadingState = ref<boolean>(false);
  const setLoadingState = (status: boolean) => {
    loadingState.value = status;
  }

  const askUserState = ref<IAsk | undefined>(undefined);
  const setAskUserState = (ask: IAsk | undefined) => {
    askUserState.value = ask;
  }

  // const WavRecorderState = ref<WavRecorder>(new WavRecorder());
  // const WavStreamPlayerState = ref<WavStreamPlayer>(new WavStreamPlayer());
  const audioConnectionState = ref<'connecting' | 'on' | 'off'>('off');
  const setAudioConnectionState = (status: 'connecting' | 'on' | 'off') => {
    audioConnectionState.value = status;
  }

  const isAiSpeakingState = ref<boolean>(false);
  const setIsAiSpeakingState = (status: boolean) => {
    isAiSpeakingState.value = status
  }

  const callFnState = ref<ICallFn | undefined>(undefined);
  const setCallFnState = (callFn: ICallFn | undefined) => {
    callFnState.value = callFn;
  }

  const chatSettingsInputsState = ref<any[]>([]);
  const setChatSettingsInputsState = (inputs: any[]) => {
    chatSettingsInputsState.value = inputs;
  }
  const resetChatSettingsInputState = () => {
    chatSettingsValueState.value = chatSettingsDefaultValue.value;
  }

  const chatSettingsDefaultValue = computed(() => {
    const chatSettings = chatSettingsInputsState.value;
    return chatSettings.reduce(
      (form: { [key: string]: any }, input: any) => (
        (form[input.id] = input.initial), form
      ),
      {}
    );
  });

  const chatSettingsValueState = ref(chatSettingsDefaultValue.value);
  const setChatSettingsValueState = (value: any) => {
    chatSettingsValueState.value = value;
  };
  const resetChatSettingsValueState  = () => {
    chatSettingsValueState.value = chatSettingsDefaultValue.value;
  }

  const elementState = ref<IMessageElement[]>([]);
  const setElementState = (elements: IMessageElement[]) => {
    elementState.value = elements;
  }
  const setElementState2 = (callback: (elements: IMessageElement[]) => IMessageElement[]) => {
    elementState.value = callback(elementState.value);
  }

  const tasklistState = ref<ITasklistElement[]>([]);
  const setTasklistState = (tasklists: ITasklistElement[]) => {
    tasklistState.value = tasklists;
  }
  const setTasklistState2 = (callback: (tasklists: ITasklistElement[]) => ITasklistElement[]) => {
    tasklistState.value = callback(tasklistState.value);
  }

  const firstUserInteraction = ref<string | undefined>(undefined);
  const setFirstUserInteraction = (threadId: string | undefined) => {
    firstUserInteraction.value = threadId;
  }

  const userState = ref<IUser | undefined | null>(undefined);
  const setUserState = (user: IUser | undefined | null) => {
    userState.value = user;
  }

  const configState = ref<IChainlitConfig | undefined>(undefined);
  const setConfigState = (config: IChainlitConfig | undefined) => {
    configState.value = config;
  }

  const authState = ref<IAuthConfig | undefined>(undefined);
  const setAuthState = (config: IAuthConfig) => {
    authState.value = config;
  }

  const threadHistoryState = ref<ThreadHistory | undefined>({
    threads: undefined,
    currentThreadId: undefined,
    timeGroupedThreads: undefined,
    pageInfo: undefined
  });
  const setThreadHistoryState = (history: ThreadHistory | undefined) => {
    threadHistoryState.value = history;
  }

  watch(threadHistoryState, (newValue, oldValue) => {
    if (newValue?.threads && !isEqual(newValue.threads, oldValue?.timeGroupedThreads)) {
      threadHistoryState.value = {
        ...newValue,
        timeGroupedThreads: groupByDate(newValue.threads),
      };
    }
  }, { deep: true });

  const sideViewState = ref<IMessageElement | undefined>(undefined);
  const setSideViewState = (element: IMessageElement | undefined) => {
    sideViewState.value = element;
  };
  const currentThreadIdState = ref<string | undefined>(undefined);
  const setCurrentThreadIdState = (threadId: string | undefined) => {
    currentThreadIdState.value = threadId;
  };
  watch(currentThreadIdState, (newValue, oldValue) => {
    if (newValue && newValue !== oldValue) {
      setThreadHistoryState({
        ...threadHistoryState.value,
        currentThreadId: newValue
      });
    }
  })

  return {
    threadIdToResumeState,
    setThreadIdToResumeState,
    resumeThreadErrorState,
    setResumeThreadErrorState,
    chatProfileState,
    setChatProfileState,
    sessionIdState,
    resetSessionIdState,
    sessionState,
    setSessionState,
    setSessionSocket,
    setSessionError,
    actionState,
    setActionState,
    setActionState2,
    messagesState,
    setMessagesState,
    setMessagesState2,
    tokenCountState,
    setTokenCountState,
    setTokenCountState2,
    loadingState,
    setLoadingState,
    askUserState,
    setAskUserState,
    // WavRecorderState,
    // WavStreamPlayerState,
    audioConnectionState,
    setAudioConnectionState,
    isAiSpeakingState,
    setIsAiSpeakingState,
    callFnState,
    setCallFnState,
    chatSettingsInputsState,
    setChatSettingsInputsState,
    resetChatSettingsInputState,
    chatSettingsDefaultValue,
    chatSettingsValueState,
    resetChatSettingsValueState,
    elementState,
    setElementState,
    setElementState2,
    tasklistState,
    setTasklistState,
    setTasklistState2,
    firstUserInteraction,
    setFirstUserInteraction,
    userState,
    setUserState,
    configState,
    setConfigState,
    authState,
    setAuthState,
    threadHistoryState,
    setThreadHistoryState,
    sideViewState,
    setSideViewState,
    currentThreadIdState,
    setCurrentThreadIdState
  };
});