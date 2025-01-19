import { useStateStore } from './state';
import { useChatInteract } from './useChatInteract';
import { storeToRefs } from 'pinia';

const useAudio = () => {
    const store = useStateStore();
    const {
        audioConnectionState: audioConnection,
        wavRecorderState: wavRecorder,
        wavStreamPlayerState: wavStreamPlayer,
        isAiSpeakingState: isAiSpeaking
    } = storeToRefs(store);

  const { startAudioStream, endAudioStream } = useChatInteract();

  const startConversation = async () => {
    audioConnection.value = 'connecting';
    await startAudioStream();
  }

  const endConversation = async () => {
    audioConnection.value = 'off';
    await wavRecorder.value.end();
    await wavStreamPlayer.value.interrupt();
    await endAudioStream();
  }

  return {
    startConversation,
    endConversation,
    audioConnection,
    isAiSpeaking,
    wavRecorder,
    wavStreamPlayer
  };
};

export { useAudio };
