import { debounce } from 'lodash';
import { watch } from 'vue';
import io from 'socket.io-client';
import { storeToRefs } from 'pinia';
import { useStateStore } from '@/state';
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

import type { OutputAudioChunk } from './types/audio';

import type { IToken } from '@/useChatData';

import { useChainlitContext } from '.';
import type { ICommand } from './types/command';

const useChatSession = () => {
  const client = useChainlitContext();
  const store = useStateStore();
  const {
    sessionIdState: sessionId,

    sessionState: session,
    isAiSpeakingState: isAiSpeaking,
    audioConnectionState: audioConnection,

    firstUserInteraction,
    loadingState: loading,
    wavStreamPlayerState: wavStreamPlayer,
    wavRecorderState: wavRecorder,
    messagesState: messages,
    askUserState: askUser,
    callFnState: callFn,

    elementState: elements,
    tasklistState: tasklists,
    actionState: actions,
    chatSettingsInputsState: chatSettingsInputs,
    commandsState,
    tokenCountState: tokenCount,
    chatProfileState: chatProfile,
    threadIdToResumeState: idToResume,
    resumeThreadErrorState: threadResumeError,

    currentThreadIdState: currentThreadId,
  } = storeToRefs(store)

  const {
    resetChatSettingsValue,

    setSession,
    setSessionError,
    setTasklistState,
    setElementState,
    // setActionState,
    setTokenCountState,
  } = store

  // Use currentThreadId as thread id in websocket header
  watch(currentThreadId, () => {
    if (session.value?.socket) {
      session.value.socket.auth['threadId'] = currentThreadId || '';
    }
  })

  const _connect =  ({
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
        sessionId: sessionId.value,
        threadId: idToResume.value || '',
        userEnv: JSON.stringify(userEnv),
        chatProfile: chatProfile.value ? encodeURIComponent(chatProfile.value) : ''
      }
    });
    setSession(socket);

    socket.on('connect', () => {
      socket.emit('connection_successful');
      setSessionError(false);
    });

    socket.on('connect_error', (_) => {
      setSessionError(true);
    });

    socket.on('task_start', () => {
      loading.value = true;
    });

    socket.on('task_end', () => {
      loading.value = false;
    });

    socket.on('reload', () => {
      socket.emit('clear_session');
      window.location.reload();
    });

    socket.on('audio_connection', async (state: 'on' | 'off') => {
      if (state === 'on') {
        let isFirstChunk = true;
        const startTime = Date.now();
        const mimeType = 'pcm16';
        // Connect to microphone
        await wavRecorder.value.begin();
        await wavStreamPlayer.value.connect();
        await wavRecorder.value.record(async (data) => {
          const elapsedTime = Date.now() - startTime;
          socket.emit('audio_chunk', {
            isStart: isFirstChunk,
            mimeType,
            elapsedTime,
            data: data.mono
          });
          isFirstChunk = false;
        });
        wavStreamPlayer.value.onStop = () => isAiSpeaking.value = false;
      } else {
        await wavRecorder.value.end();
        await wavStreamPlayer.value.interrupt();
      }
      audioConnection.value = state;
    });

    socket.on('audio_chunk', (chunk: OutputAudioChunk) => {
      wavStreamPlayer.value.add16BitPCM(chunk.data, chunk.track);
      isAiSpeaking.value = true;
    });

    socket.on('audio_interrupt', () => {
      wavStreamPlayer.value.interrupt();
    });

    socket.on('resume_thread', (thread: IThread) => {
      let _messages: IStep[] = [];
      for (const step of thread.steps) {
        _messages = addMessage(_messages, step);
      }
      if (thread.metadata?.chat_profile) {
        chatProfile.value = thread.metadata?.chat_profile;
      }
      messages.value = _messages;
      const _elements = thread.elements || [];
      tasklists.value = (_elements as ITasklistElement[]).filter((e) => e.type === 'tasklist')
      elements.value = (_elements as IMessageElement[]).filter((e) => ['avatar', 'tasklist'].indexOf(e.type) === -1)
    });

    socket.on('resume_thread_error', (error?: string) => {
      threadResumeError.value = error;
    });

    socket.on('new_message', (message: IStep) => {
      messages.value = addMessage(messages.value, message);
    });

    socket.on(
      'first_interaction',
      (event: { interaction: string; thread_id: string }) => {
        firstUserInteraction.value = event.interaction;
        currentThreadId.value = event.thread_id;
      }
    );

    socket.on('update_message', (message: IStep) => {
      messages.value = updateMessageById(messages.value, message.id, message);
    });

    socket.on('delete_message', (message: IStep) => {
      messages.value = deleteMessageById(messages.value, message.id);
    });

    socket.on('stream_start', (message: IStep) => {
      messages.value = addMessage(messages.value, message);
    });

    socket.on(
      'stream_token',
      ({ id, token, isSequence, isInput }: IToken) => {
        messages.value = updateMessageContentById(
          messages.value,
          id,
          token,
          isSequence,
          isInput
        )
      }
    );

    socket.on('ask', ({ msg, spec }, callback) => {
      askUser.value = { spec, callback, parentId: msg.parentId };
      messages.value = addMessage(messages.value, msg)

      loading.value = false;
    });

    socket.on('ask_timeout', () => {
      askUser.value = undefined;
      loading.value = false;
    });

    socket.on('clear_ask', () => {
      askUser.value = undefined;
    });

    socket.on('call_fn', ({ name, args }, callback) => {
      callFn.value = { name, args, callback };
    });

    socket.on('clear_call_fn', () => {
      callFn.value = undefined;
    });

    socket.on('call_fn_timeout', () => {
      callFn.value = undefined;
    });

    socket.on('chat_settings', (inputs: any) => {
      chatSettingsInputs.value = inputs;
      resetChatSettingsValue();
    });

    socket.on('set_commands', (commands: ICommand[]) => {
      commandsState.value = commands
    });

    socket.on('element', (element: IElement) => {
      if (!element.url && element.chainlitKey) {
        element.url = client.getElementUrl(element.chainlitKey, sessionId.value);
      }

      if (element.type === 'tasklist') {
        setTasklistState((old) => {
          const index = old.findIndex((e) => e.id === element.id);
          if (index === -1) {
            return [...old, element];
          } else {
            return [...old.slice(0, index), element, ...old.slice(index + 1)];
          }
        });
      } else {
        setElementState((old) => {
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
      setElementState((old) => {
        return old.filter((e) => e.id !== remove.id);
      });
      setTasklistState((old) => {
        return old.filter((e) => e.id !== remove.id);
      });
    });

    socket.on('action', (action: IAction) => {
      actions.value = [...actions.value, action];
    });

    socket.on('remove_action', (action: IAction) => {
      const index = actions.value.findIndex((a) => a.id === action.id);
      if (index === -1) return actions.value;
      actions.value = [...actions.value.slice(0, index), ...actions.value.slice(index + 1)];
    });

    socket.on('token_usage', (count: number) => {
      setTokenCountState((old) => old + count);
    });

    socket.on('window_message', (data: any) => {
      if (window.parent) {
        window.parent.postMessage(data, '*');
      }
    });
  }

  const connect = debounce(_connect, 200)

  const disconnect = () => {
    if (session.value?.socket) {
      session.value.socket.removeAllListeners();
      session.value.socket.close();
    }
  }

  return {
    connect,
    disconnect,
    session,
    sessionId,
    chatProfile,
    idToResume
  };
};

export { useChatSession };
