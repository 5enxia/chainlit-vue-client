import { defineStore } from 'pinia';
import { isEqual } from 'lodash';
import { ref, computed, watch } from 'vue';
// import { Socket } from 'socket.io-client';
// import type { Socket } from 'socket.io-client';
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
import type { Socket } from 'socket.io-client/build/esm/socket';
// import { WavRecorder, WavStreamPlayer } from './wavtools';

export interface ISession {
  error?: boolean;
}

export const useStateStore = defineStore('state', () => {
  const threadIdToResumeState = ref<string | undefined>(undefined);
  const resumeThreadErrorState = ref<string | undefined>(undefined);
  const chatProfileState = ref<string | undefined>(undefined);
  const sessionId = ref<string>(uuidv4());

  const sessionIdState = computed({
    get: () => sessionId.value,
    set: (newValue) => {
      sessionId.value = newValue ? uuidv4() : newValue;
    }
  });

  const sessionState = ref<ISession | undefined>(undefined);
  const actionState = ref<IAction[]>([]);
  const messagesState = ref<IStep[]>([]);
  const tokenCountState = ref<number>(0);
  const loadingState = ref<boolean>(false);
  const askUserState = ref<IAsk | undefined>(undefined);
  // const WavRecorderState = ref<WavRecorder>(new WavRecorder());
  // const WavStreamPlayerState = ref<WavStreamPlayer>(new WavStreamPlayer());
  const audioConnectionState = ref<'connecting' | 'on' | 'off'>('off');
  const isAiSpeakingState = ref<boolean>(false);
  const callFnState = ref<ICallFn | undefined>(undefined);
  const chatSettingsInputsState = ref<any[]>([]);

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
  const elementState = ref<IMessageElement[]>([]);
  const tasklistState = ref<ITasklistElement[]>([]);
  const firstUserInteraction = ref<string | undefined>(undefined);
  const userState = ref<IUser | undefined | null>(undefined);
  const setUserState = (user: IUser | undefined | null) => {
    userState.value = user;
  }
  const configState = ref<IChainlitConfig | undefined>(undefined);
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
  const currentThreadIdState = ref<string | undefined>(undefined);

  return {
    threadIdToResumeState,
    resumeThreadErrorState,
    chatProfileState,
    sessionIdState,
    sessionState,
    actionState,
    messagesState,
    tokenCountState,
    loadingState,
    askUserState,
    // WavRecorderState,
    // WavStreamPlayerState,
    audioConnectionState,
    isAiSpeakingState,
    callFnState,
    chatSettingsInputsState,
    chatSettingsDefaultValue,
    chatSettingsValueState,
    elementState,
    tasklistState,
    firstUserInteraction,
    userState,
    setUserState,
    configState,
    authState,
    setAuthState,
    threadHistoryState,
    setThreadHistoryState,
    sideViewState,
    currentThreadIdState
  };
});