import { debounce, set } from 'lodash';
// import { useCallback, useContext, useEffect } from 'react';
// import {
//   useRecoilState,
//   useRecoilValue,
//   useResetRecoilState,
//   useSetRecoilState
// } from 'recoil';
import io from 'socket.io-client';
// import {
//   actionState,
//   askUserState,
//   audioConnectionState,
//   callFnState,
//   chatProfileState,
//   chatSettingsInputsState,
//   chatSettingsValueState,
//   currentThreadIdState,
//   elementState,
//   firstUserInteraction,
//   isAiSpeakingState,
//   loadingState,
//   messagesState,
//   resumeThreadErrorState,
//   sessionIdState,
//   sessionState,
//   tasklistState,
//   threadIdToResumeState,
//   tokenCountState,
//   wavRecorderState,
//   wavStreamPlayerState
// } from 'src/state';
import { useStateStore } from './state';
import type {
  IAction,
  IElement,
  IMessageElement,
  IStep,
  ITasklistElement,
  IThread
} from '@/types';
import {
  addMessage,
  deleteMessageById,
  updateMessageById,
  updateMessageContentById
} from '@/utils/message';

// import type { OutputAudioChunk } from './types/audio';

// import { ChainlitContext } from './context';
import { useChainlitContext } from './context';
import type { IToken } from './useChatData';

import { Socket } from 'socket.io-client';

// TODO: Add types
const useChatSession = (): any => {
  // const client = useContext(ChainlitContext);
  const client = useChainlitContext();
  // const sessionId = useRecoilValue(sessionIdState);
  const { sessionIdState: sessionId } = useStateStore();

  // const [session, setSession] = useRecoilState(sessionState);
  const { sessionState: session, setSessionState: setSession, setSessionError, setSessionSocket } = useStateStore();
  // const setIsAiSpeaking = useSetRecoilState(isAiSpeakingState);
  const { setIsAiSpeakingState: setIsAiSpeaking } = useStateStore();
  // const setAudioConnection = useSetRecoilState(audioConnectionState);
  const { setAudioConnectionState: setAudioConnection } = useStateStore();
  // const resetChatSettingsValue = useResetRecoilState(chatSettingsValueState);
  const { resetChatSettingsValueState: resetChatSettingsValue } = useStateStore();
  // const setFirstUserInteraction = useSetRecoilState(firstUserInteraction);
  const { setFirstUserInteraction } = useStateStore();
  // const setLoading = useSetRecoilState(loadingState);
  const { setLoadingState: setLoading } = useStateStore();

  // const wavStreamPlayer = useRecoilValue(wavStreamPlayerState);
  // const wavRecorder = useRecoilValue(wavRecorderState);
  // const setMessages = useSetRecoilState(messagesState);
  const { setMessagesState: setMessages, setMessagesState2: setMessages2 } = useStateStore();
  // const setAskUser = useSetRecoilState(askUserState);
  const { setAskUserState: setAskUser } = useStateStore();
  // const setCallFn = useSetRecoilState(callFnState);
  const { setCallFnState: setCallFn } = useStateStore();

  // const setElements = useSetRecoilState(elementState);
  const { setElementState: setElements, setElementState2 } = useStateStore();
  // const setTasklists = useSetRecoilState(tasklistState);
  const { setTasklistState: setTasklists, setTasklistState2 } = useStateStore(); 
  // const setActions = useSetRecoilState(actionState);
  const { setActionState: setActions, setActionState2 } = useStateStore();
  // const setChatSettingsInputs = useSetRecoilState(chatSettingsInputsState);
  const { setChatSettingsInputsState: setChatSettingsInputs } = useStateStore();
  // const setTokenCount = useSetRecoilState(tokenCountState);
  const { setTokenCountState: setTokenCount, setTokenCountState2 } = useStateStore();
  // const [chatProfile, setChatProfile] = useRecoilState(chatProfileState);
  const { chatProfileState: chatProfile, setChatProfileState: setChatProfile } = useStateStore();
  // const idToResume = useRecoilValue(threadIdToResumeState);
  const { threadIdToResumeState: idToResume } = useStateStore();
  // const setThreadResumeError = useSetRecoilState(resumeThreadErrorState);
  const { setResumeThreadErrorState: setThreadResumeError } = useStateStore();

  // const [currentThreadId, setCurrentThreadId] =
  //   useRecoilState(currentThreadIdState);
  const { currentThreadIdState: currentThreadId, setCurrentThreadIdState: setCurrentThreadId } = useStateStore();

  // Use currentThreadId as thread id in websocket header
  // useEffect(() => {
  //   if (session?.socket) {
  //     session.socket.auth['threadId'] = currentThreadId || '';
  //   }
  // }, [currentThreadId]);

  // const _connect = useCallback(
  const _connect = 
    ({
      transports,
      userEnv
    }: {
      transports?: string[];
      userEnv: Record<string, string>;
    }) => {
      const { protocol, host, pathname } = new URL(client.httpEndpoint);
      const uri = `${protocol}//${host}`;
      const path =
        pathname && pathname !== '/'
          ? `${pathname}/ws/socket.io`
          : '/ws/socket.io';

      const socket = io(uri, {
        path,
        withCredentials: true,
        transports,
        auth: {
          clientType: client.type,
          sessionId,
          threadId: idToResume || '',
          userEnv: JSON.stringify(userEnv),
          chatProfile: chatProfile ? encodeURIComponent(chatProfile) : ''
        }
      });
      // setSession((old) => {
      //   old?.socket?.removeAllListeners();
      //   old?.socket?.close();
      //   return {
      //     socket
      //   };
      // });
      setSessionSocket(socket)

      socket.on('connect', () => {
        socket.emit('connection_successful');
        // setSession((s) => ({ ...s!, error: false }));
        setSessionError(false);
      });

      socket.on('connect_error', (_) => {
        // setSession((s) => ({ ...s!, error: true }));
        setSessionError(true);
      });

      socket.on('task_start', () => {
        setLoading(true);
      });

      socket.on('task_end', () => {
        setLoading(false);
      });

      socket.on('reload', () => {
        socket.emit('clear_session');
        window.location.reload();
      });

      // socket.on('audio_connection', async (state: 'on' | 'off') => {
      //   if (state === 'on') {
      //     let isFirstChunk = true;
      //     const startTime = Date.now();
      //     const mimeType = 'pcm16';
      //     // Connect to microphone
      //     await wavRecorder.begin();
      //     await wavStreamPlayer.connect();
      //     await wavRecorder.record(async (data) => {
      //       const elapsedTime = Date.now() - startTime;
      //       socket.emit('audio_chunk', {
      //         isStart: isFirstChunk,
      //         mimeType,
      //         elapsedTime,
      //         data: data.mono
      //       });
      //       isFirstChunk = false;
      //     });
      //     wavStreamPlayer.onStop = () => setIsAiSpeaking(false);
      //   } else {
      //     await wavRecorder.end();
      //     await wavStreamPlayer.interrupt();
      //   }
      //   setAudioConnection(state);
      // });

      // socket.on('audio_chunk', (chunk: OutputAudioChunk) => {
      //   wavStreamPlayer.add16BitPCM(chunk.data, chunk.track);
      //   setIsAiSpeaking(true);
      // });

      // socket.on('audio_interrupt', () => {
      //   wavStreamPlayer.interrupt();
      // });

      socket.on('resume_thread', (thread: IThread) => {
        let messages: IStep[] = [];
        for (const step of thread.steps) {
          messages = addMessage(messages, step);
        }
        if (thread.metadata?.chat_profile) {
          setChatProfile(thread.metadata?.chat_profile);
        }
        setMessages(messages);
        const elements = thread.elements || [];
        setTasklists(
          (elements as ITasklistElement[]).filter((e) => e.type === 'tasklist')
        );
        setElements(
          (elements as IMessageElement[]).filter(
            (e) => ['avatar', 'tasklist'].indexOf(e.type) === -1
          )
        );
      });

      socket.on('resume_thread_error', (error?: string) => {
        setThreadResumeError(error);
      });

      socket.on('new_message', (message: IStep) => {
        // setMessages((oldMessages: Istep[]) => addMessage(oldMessages, message));
        setMessages2((oldMessages: IStep[]) => addMessage(oldMessages, message));
      });

      socket.on(
        'first_interaction',
        (event: { interaction: string; thread_id: string }) => {
          setFirstUserInteraction(event.interaction);
          setCurrentThreadId(event.thread_id);
        }
      );

      socket.on('update_message', (message: IStep) => {
        // setMessages((oldMessages) =>
        setMessages2((oldMessages) =>
          updateMessageById(oldMessages, message.id, message)
        );
      });

      socket.on('delete_message', (message: IStep) => {
        // setMessages((oldMessages) =>
        setMessages2((oldMessages) =>
          deleteMessageById(oldMessages, message.id)
        );
      });

      socket.on('stream_start', (message: IStep) => {
        // setMessages((oldMessages) => addMessage(oldMessages, message));
        setMessages2((oldMessages) => addMessage(oldMessages, message));
      });

      socket.on(
        'stream_token',
        ({ id, token, isSequence, isInput }: IToken) => {
          // setMessages((oldMessages) =>
          setMessages2((oldMessages) =>
            updateMessageContentById(
              oldMessages,
              id,
              token,
              isSequence,
              isInput
            )
          )
        }
      );

      socket.on('ask', ({ msg, spec }, callback) => {
        setAskUser({ spec, callback, parentId: msg.parentId });
        // setMessages((oldMessages) => addMessage(oldMessages, msg));
        setMessages2((oldMessages) => addMessage(oldMessages, msg));

        setLoading(false);
      });

      socket.on('ask_timeout', () => {
        setAskUser(undefined);
        setLoading(false);
      });

      socket.on('clear_ask', () => {
        setAskUser(undefined);
      });

      socket.on('call_fn', ({ name, args }, callback) => {
        setCallFn({ name, args, callback });
      });

      socket.on('clear_call_fn', () => {
        setCallFn(undefined);
      });

      socket.on('call_fn_timeout', () => {
        setCallFn(undefined);
      });

      socket.on('chat_settings', (inputs: any) => {
        setChatSettingsInputs(inputs);
        resetChatSettingsValue();
      });

      socket.on('element', (element: IElement) => {
        if (!element.url && element.chainlitKey) {
          element.url = client.getElementUrl(element.chainlitKey, sessionId);
        }

        if (element.type === 'tasklist') {
          // setTasklists((old) => {
          setTasklistState2((old) => {
            const index = old.findIndex((e) => e.id === element.id);
            if (index === -1) {
              return [...old, element];
            } else {
              return [...old.slice(0, index), element, ...old.slice(index + 1)];
            }
          });
        } else {
          // setElements((old) => {
          setElementState2((old) => {
            const index = old.findIndex((e) => e.id === element.id);
            if (index === -1) {
              return [...old, element];
            } else {
              return [...old.slice(0, index), element, ...old.slice(index + 1)];
            }
          });
        }
      });

      socket.on('remove_element', (remove: { id: string }) => {
        // setElements((old) => {
        setElementState2((old) => {
          return old.filter((e) => e.id !== remove.id);
        });
        // setTasklists((old) => {
        setTasklistState2((old) => {
          return old.filter((e) => e.id !== remove.id);
        });
      });

      socket.on('action', (action: IAction) => {
        // setActions((old) => [...old, action]);
        setActionState2((old) => [...old, action]);
      });

      socket.on('remove_action', (action: IAction) => {
        // setActions((old) => {
        setActionState2((old) => {
          const index = old.findIndex((a) => a.id === action.id);
          if (index === -1) return old;
          return [...old.slice(0, index), ...old.slice(index + 1)];
        });
      });

      socket.on('token_usage', (count: number) => {
        // setTokenCount((old) => old + count);
        setTokenCountState2((old) => old + count);
      });

      socket.on('window_message', (data: any) => {
        if (window.parent) {
          window.parent.postMessage(data, '*');
        }
      });
  //   },
  //   [setSession, sessionId, idToResume, chatProfile]
  // );
    }

  // const connect = useCallback(debounce(_connect, 200), [_connect]);
  const connect = debounce(_connect, 200)

  // const disconnect = useCallback(() => {
  const disconnect = () => {
    if (session?.socket) {
      session.socket.removeAllListeners();
      session.socket.close();
    }
  } // , [session]);

  return {
    connect,
    disconnect,
    session,
    sessionId,
    chatProfile,
    idToResume,
    setChatProfile
  };
};

export { useChatSession };
