import { useStateStore } from '@/state';
import type { IFileRef, IStep } from 'src/types';
import { addMessage } from '@/utils/message';
import { v4 as uuidv4 } from 'uuid';

// import { useChainlitContext } from '@/context';
import { storeToRefs, type Store } from 'pinia';
import { useChainlitContext, type ChainlitAPI, type State } from '.';

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// const useChatInteract = () => {
const useChatInteract = (store: Store<"state", State>) => {
  const client = useChainlitContext();
  // const store = useStateStore();
  const {
    sessionState: session,
    askUserState: askUser,
    sessionIdState: sessionId,

    firstUserInteraction,
    loadingState: loading,
    messagesState: messages,
    elementState: elements,
    tasklistState: tasklists,
    actionState: actions,
    tokenCountState: tokenCount,
    threadIdToResumeState: idToResume,
    sideViewState: sideView,
    currentThreadIdState: currentThreadId,
  } = storeToRefs(store);

  const {
    resetChatSettings,
    resetSessionId,
    resetChatSettingsValue,
    setMessagesState
  } = store

  const clear = () => {
    session.value?.socket.emit('clear_session');
    session.value?.socket.disconnect();
    idToResume.value = undefined
    resetSessionId();
    firstUserInteraction.value = undefined;
    messages.value = [];
    elements.value = [];
    tasklists.value = [];
    actions.value = [];
    tokenCount.value = 0;
    resetChatSettings();
    resetChatSettingsValue();
    sideView.value = undefined;
    currentThreadId.value = undefined;
  }

  const sendMessage = (
    message: PartialBy<IStep, 'createdAt' | 'id'>,
    fileReferences: IFileRef[] = []
  ) => {
    if (!message.id) {
      message.id = uuidv4();
    }
    if (!message.createdAt) {
      message.createdAt = new Date().toISOString();
    }
    setMessagesState((oldMessages) => addMessage(oldMessages, message as IStep));

    session.value?.socket.emit('client_message', { message, fileReferences });
  }

  const editMessage =  (message: IStep) => {
    session.value?.socket.emit('edit_message', { message });
  }

  const windowMessage = (data: any) => {
    session.value?.socket.emit('window_message', data);
  }

  const startAudioStream = () => {
    session.value?.socket.emit('audio_start');
  }

  const sendAudioChunk = (
    isStart: boolean,
    mimeType: string,
    elapsedTime: number,
    data: Int16Array
  ) => {
    session.value?.socket.emit('audio_chunk', {
      isStart,
      mimeType,
      elapsedTime,
      data
    });
  }

  const endAudioStream = () => {
    session.value?.socket.emit('audio_end');
  }

  const replyMessage = (message: IStep) => {
    if (askUser.value) {
      if (askUser.value.parentId) message.parentId = askUser.value.parentId;
      setMessagesState((oldMessages) => addMessage(oldMessages, message));
      askUser.value.callback(message);
    }
  }

  const updateChatSettings = (values: object) => {
    session.value?.socket.emit('chat_settings_change', values);
  }

  const stopTask = () => {
    setMessagesState((oldMessages) =>
      oldMessages.map((m) => {
        m.streaming = false;
        return m;
      })
    );

    loading.value = false;

    session.value?.socket.emit('stop');
  }

  const uploadFile = (file: File, onProgress: (progress: number) => void) => {
    return client.uploadFile(file, onProgress, sessionId.value);
  }

  return {
    uploadFile,
    clear,
    replyMessage,
    sendMessage,
    editMessage,
    windowMessage,
    startAudioStream,
    sendAudioChunk,
    endAudioStream,
    stopTask,
    idToResume,
    updateChatSettings
  };
};

export { useChatInteract };
