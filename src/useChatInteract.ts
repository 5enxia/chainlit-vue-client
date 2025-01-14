import { useStateStore } from '@/state';
import type { IFileRef, IStep } from 'src/types';
import { addMessage } from '@/utils/message';
import { v4 as uuidv4 } from 'uuid';

import { useChainlitContext } from '@/context';

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

const useChatInteract = () => {
  // const client = useContext(ChainlitContext);
  const client = useChainlitContext();
  // const session = useRecoilValue(sessionState);
  const { sessionState: session } = useStateStore();
  // const askUser = useRecoilValue(askUserState);
  const { askUserState: askUser } = useStateStore();
  // const sessionId = useRecoilValue(sessionIdState);
  const { sessionIdState: sessionId } = useStateStore();

  // const resetChatSettings = useResetRecoilState(chatSettingsInputsState);
  const { resetChatSettingsInputState: resetChatSettings } = useStateStore();
  // const resetSessionId = useResetRecoilState(sessionIdState);
  const { resetSessionIdState: resetSessionId } = useStateStore();
  // const resetChatSettingsValue = useResetRecoilState(chatSettingsValueState);
  const { resetChatSettingsValueState: resetChatSettingsValue } = useStateStore();

  // const setFirstUserInteraction = useSetRecoilState(firstUserInteraction);
  const { setFirstUserInteraction } = useStateStore();
  // const setLoading = useSetRecoilState(loadingState);
  const { setLoadingState: setLoading } = useStateStore();
  // const setMessages = useSetRecoilState(messagesState);
  const { setMessagesState: setMessages, setMessagesState2 } = useStateStore();
  // const setElements = useSetRecoilState(elementState);
  const { setElementState: setElements } = useStateStore();
  // const setTasklists = useSetRecoilState(tasklistState);
  const { setTasklistState: setTasklists } = useStateStore()
  // const setActions = useSetRecoilState(actionState);
  const { setActionState: setActions } = useStateStore();
  // const setTokenCount = useSetRecoilState(tokenCountState);
  const { setTokenCountState: setTokenCount } = useStateStore();
  // const setIdToResume = useSetRecoilState(threadIdToResumeState);
  const { setThreadIdToResumeState: setIdToResume } = useStateStore();
  // const setSideView = useSetRecoilState(sideViewState);
  const { setSideViewState: setSideView } = useStateStore();
  // const setCurrentThreadId = useSetRecoilState(currentThreadIdState);
  const { setCurrentThreadIdState: setCurrentThreadId } = useStateStore();

  // const clear = useCallback(() => {
  const clear = () => {
    session?.socket.emit('clear_session');
    session?.socket.disconnect();
    setIdToResume(undefined);
    resetSessionId();
    setFirstUserInteraction(undefined);
    setMessages([]);
    setElements([]);
    setTasklists([]);
    setActions([]);
    setTokenCount(0);
    resetChatSettings();
    resetChatSettingsValue();
    setSideView(undefined);
    setCurrentThreadId(undefined);
  } // , [session]);

  const sendMessage = // useCallback(
    (
      message: PartialBy<IStep, 'createdAt' | 'id'>,
      fileReferences: IFileRef[] = []
    ) => {
      if (!message.id) {
        message.id = uuidv4();
      }
      if (!message.createdAt) {
        message.createdAt = new Date().toISOString();
      }
      // setMessages((oldMessages) => addMessage(oldMessages, message as IStep));
      setMessagesState2((oldMessages) => addMessage(oldMessages, message as IStep));

      session?.socket.emit('client_message', { message, fileReferences });
    } // ,
  //   [session?.socket]
  // );

  const editMessage = // useCallback(
    (message: IStep) => {
      session?.socket.emit('edit_message', { message });
    } // ,
  //   [session?.socket]
  // );

  const windowMessage = // useCallback(
    (data: any) => {
      session?.socket.emit('window_message', data);
    } //,
  //   [session?.socket]
  // );

  // const startAudioStream = useCallback(() => {
  const startAudioStream = () => {
    session?.socket.emit('audio_start');
  } //, [session?.socket]);

  const sendAudioChunk = // useCallback(
    (
      isStart: boolean,
      mimeType: string,
      elapsedTime: number,
      data: Int16Array
    ) => {
      session?.socket.emit('audio_chunk', {
        isStart,
        mimeType,
        elapsedTime,
        data
      });
    } // ,
  //   [session?.socket]
  // );

  // const endAudioStream = useCallback(() => {
  const endAudioStream = () => {
    session?.socket.emit('audio_end');
  } // , [session?.socket]);

  const replyMessage = // useCallback(
    (message: IStep) => {
      if (askUser) {
        if (askUser.parentId) message.parentId = askUser.parentId;
        // setMessages((oldMessages) => addMessage(oldMessages, message));
        setMessagesState2((oldMessages) => addMessage(oldMessages, message));
        askUser.callback(message);
      }
    } // ,
  //   [askUser]
  // );

  const updateChatSettings = // useCallback(
    (values: object) => {
      session?.socket.emit('chat_settings_change', values);
    } // ,
  //   [session?.socket]
  // );

  // const stopTask = useCallback(() => {
  const stopTask = () => {
    // setMessages((oldMessages) =>
    setMessagesState2((oldMessages) =>
      oldMessages.map((m) => {
        m.streaming = false;
        return m;
      })
    );

    setLoading(false);

    session?.socket.emit('stop');
  } // , [session?.socket]);

  const uploadFile = // useCallback(
    (file: File, onProgress: (progress: number) => void) => {
      return client.uploadFile(file, onProgress, sessionId);
    } // ,
  //   [sessionId]
  // );

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
    setIdToResume,
    updateChatSettings
  };
};

export { useChatInteract };
