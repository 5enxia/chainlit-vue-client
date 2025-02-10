import { isEqual } from 'lodash';
import { defineStore } from 'pinia';
import { ref, computed, watch, nextTick, type Ref, type ComputedRef } from 'vue';
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
import { WavRecorder, WavStreamPlayer } from './wavtools';

export interface ISession {
  socket: Socket;
  error?: boolean;
}

export interface State {
  threadIdToResumeState: Ref<string | undefined>;
  resumeThreadErrorState: Ref<string | undefined>;
  chatProfileState: Ref<string | undefined>;
  sessionIdState: ComputedRef<string>;
  resetSessionId: () => void;
  sessionState: Ref<ISession | undefined>;
  setSession: (socket: Socket) => void;
  setSessionError: (error: boolean) => void;
  actionState: Ref<IAction[]>;
  setActionState: (callback: (actions: IAction[]) => IAction[]) => void;
  messagesState: Ref<IStep[]>;
  setMessagesState: (callback: (messages: IStep[]) => IStep[]) => void;
  tokenCountState: Ref<number>;
  setTokenCountState: (callback: (count: number) => number) => void;
  loadingState: Ref<boolean>;
  askUserState: Ref<IAsk | undefined>;
  wavRecorderState: Ref<WavRecorder>;
  wavStreamPlayerState: Ref<WavStreamPlayer>;
  audioConnectionState: Ref<'connecting' | 'on' | 'off'>;
  isAiSpeakingState: Ref<boolean>;
  callFnState: Ref<ICallFn | undefined>;
  chatSettingsInputsState: Ref<any[]>;
  resetChatSettings: () => void;
  chatSettingsDefaultValue: ComputedRef<{ [key: string]: any }>;
  chatSettingsValueState: Ref<{ [key: string]: any }>;
  resetChatSettingsValue: () => void;
  elementState: Ref<IMessageElement[]>;
  setElementState: (callback: (elements: IMessageElement[]) => IMessageElement[]) => void;
  tasklistState: Ref<ITasklistElement[]>;
  setTasklistState: (callback: (tasklists: ITasklistElement[]) => ITasklistElement[]) => void;
  firstUserInteraction: Ref<string | undefined>;
  userState: Ref<IUser | undefined | null>;
  configState: Ref<IChainlitConfig | undefined>;
  authState: Ref<IAuthConfig | undefined>;
  threadHistoryState: Ref<ThreadHistory | undefined>;
  sideViewState: Ref<IMessageElement | undefined>;
  currentThreadIdState: Ref<string | undefined>;
}

export const useStateStore = defineStore('state', (): State => {
  const threadIdToResumeState = ref<string | undefined>(undefined);

  const resumeThreadErrorState = ref<string | undefined>(undefined);

  const chatProfileState = ref<string | undefined>(undefined);

  const sessionIdAtom = ref<string>(uuidv4());

  const sessionIdState = computed({
    get: () => sessionIdAtom.value,
    set: (newValue) => {
      sessionIdAtom.value = newValue ? uuidv4() : newValue;
    }
  });
  const resetSessionId = () => {
    sessionIdState.value = uuidv4();
  }

  const sessionState = ref<ISession | undefined>(undefined);
  const setSession = (socket: Socket) => {
    sessionState.value?.socket.removeAllListeners()
    sessionState.value?.socket.close()
    sessionState.value = { socket }
  }
  const setSessionError = (error: boolean) => {
    if (sessionState.value) {
      sessionState.value.error = error;
    }
  }

  const actionState = ref<IAction[]>([]);
  const setActionState = (callback: (actions: IAction[]) => IAction[]) => {
    actionState.value = callback(actionState.value);
  }

  const messagesState = ref<IStep[]>([]);
  const setMessagesState = (callback: (messages: IStep[]) => IStep[]) => {
    messagesState.value = callback(messagesState.value);
  }

  const tokenCountState = ref<number>(0);
  const setTokenCountState = (callback: (count: number) => number) => {
    tokenCountState.value = callback(tokenCountState.value);
  }

  const loadingState = ref<boolean>(false);

  const askUserState = ref<IAsk | undefined>(undefined);

  const wavRecorderState = ref<WavRecorder>(new WavRecorder());

  const wavStreamPlayerState = ref<WavStreamPlayer>(new WavStreamPlayer());

  const audioConnectionState = ref<'connecting' | 'on' | 'off'>('off');

  const isAiSpeakingState = ref<boolean>(false);

  const callFnState = ref<ICallFn | undefined>(undefined);
  const chatSettingsInputsState = ref<any[]>([]);
  const resetChatSettings = () => {
    chatSettingsValueState.value = chatSettingsDefaultValueSelector.value;
  }

  const chatSettingsDefaultValueSelector = computed(() => {
    const chatSettings = chatSettingsInputsState.value;
    return chatSettings.reduce(
      (form: { [key: string]: any }, input: any) => (
        (form[input.id] = input.initial), form
      ),
      {}
    );
  });

  const chatSettingsValueState = ref(chatSettingsDefaultValueSelector.value);
  const resetChatSettingsValue = () => {
    chatSettingsValueState.value = chatSettingsDefaultValueSelector.value;
  }

  const elementState = ref<IMessageElement[]>([]);
  const setElementState = (callback: (elements: IMessageElement[]) => IMessageElement[]) => {
    elementState.value = callback(elementState.value);
  }

  const tasklistState = ref<ITasklistElement[]>([]);
  const setTasklistState = (callback: (tasklists: ITasklistElement[]) => ITasklistElement[]) => {
    tasklistState.value = callback(tasklistState.value);
  }

  const firstUserInteraction = ref<string | undefined>(undefined);

  const userState = ref<IUser | undefined | null>(undefined);

  const configState = ref<IChainlitConfig | undefined>(undefined);

  const authState = ref<IAuthConfig | undefined>(undefined);

  const threadHistoryState = ref<ThreadHistory | undefined>({
    threads: undefined,
    currentThreadId: undefined,
    timeGroupedThreads: undefined,
    pageInfo: undefined
  });

  watch(threadHistoryState, (newValue, oldValue) => {
    if (isEqual(newValue, oldValue)) return;
    if (newValue?.threads && !isEqual(newValue.threads, oldValue?.timeGroupedThreads)) {
      if (threadHistoryState.value) {
        threadHistoryState.value = {
          ...threadHistoryState.value,
          timeGroupedThreads: groupByDate(newValue.threads)
        }
      }
    }
  });

  const sideViewState = ref<IMessageElement | undefined>(undefined);

  const currentThreadIdState = ref<string | undefined>(undefined);

  return {
    threadIdToResumeState,
    resumeThreadErrorState,
    chatProfileState,
    sessionIdState,
    resetSessionId,
    // @ts-ignore
    sessionState,
    setSession,
    setSessionError,
    actionState,
    setActionState,
    messagesState,
    setMessagesState,
    tokenCountState,
    setTokenCountState,
    loadingState,
    askUserState,
    wavRecorderState,
    wavStreamPlayerState,
    audioConnectionState,
    isAiSpeakingState,
    callFnState,
    chatSettingsInputsState,
    resetChatSettings,
    chatSettingsDefaultValueSelector,
    chatSettingsValueState,
    resetChatSettingsValue,
    elementState,
    setElementState,
    tasklistState,
    setTasklistState,
    firstUserInteraction,
    userState,
    configState,
    authState,
    threadHistoryState,
    sideViewState,
    currentThreadIdState,
  };
})
