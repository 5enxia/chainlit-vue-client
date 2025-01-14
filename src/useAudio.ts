import { useStateStore } from './state';
import { useChatInteract } from './useChatInteract';

const useAudio = () => {
  // const [audioConnection, setAudioConnection] =
  //   useRecoilState(audioConnectionState);
  const { audioConnectionState: audioConnection , setAudioConnectionState: setAudioConnection } = useStateStore();
  // const wavRecorder = useRecoilValue(wavRecorderState);
  // const { wavRecorderState: wavRecorder } = useStateStore();
  // const wavStreamPlayer = useRecoilValue(wavStreamPlayerState);
  // const { wavStreamPlayerState: wavStreamPlayer } = useStateStore();
  // const isAiSpeaking = useRecoilValue(isAiSpeakingState);
  const { isAiSpeakingState: isAiSpeaking } = useStateStore();

  const { startAudioStream, endAudioStream } = useChatInteract();

  // const endConversation = useCallback(async () => {
  //   setAudioConnection('off');
  //   // await wavRecorder.end();
  //   // await wavStreamPlayer.interrupt();
  //   await endAudioStream();
  // }, [endAudioStream, wavRecorder, wavStreamPlayer]);

  const startConversation = async () => {
    setAudioConnection('connecting');
    await startAudioStream();
  }

  const endConversation = async () => {
    setAudioConnection('off');
    // await wavRecorder.end();
    // await wavStreamPlayer.interrupt();
    await endAudioStream();
  };

  return {
    startConversation,
    endConversation,
    audioConnection,
    isAiSpeaking,
    // wavRecorder,
    // wavStreamPlayer
  };
};

export { useAudio };
