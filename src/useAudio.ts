// import { useCallback } from 'react';
// import { useRecoilState, useRecoilValue } from 'recoil';

// import {
//   audioConnectionState,
//   isAiSpeakingState,
//   wavRecorderState,
//   wavStreamPlayerState
// } from './state';
import { ref } from 'vue';
import { useStateStore } from './state';
import { useChatInteract } from './useChatInteract';

const useAudio = () => {
  // const [audioConnection, setAudioConnection] =
  //   useRecoilState(audioConnectionState);
  // const wavRecorder = useRecoilValue(wavRecorderState);
  // const wavStreamPlayer = useRecoilValue(wavStreamPlayerState);
  // const isAiSpeaking = useRecoilValue(isAiSpeakingState);
  const { audioConnectionState: audioConnection , setAudioConnectionState: setAudioConnection } = useStateStore();
  // const { wavRecorderState: wavRecorder } = useStateStore();
  // const { wavStreamPlayerState: wavStreamPlayer } = useStateStore();
  const { isAiSpeakingState: isAiSpeaking } = useStateStore();

  const { startAudioStream, endAudioStream } = useChatInteract();

  // const startConversation = useCallback(async () => {
  //   setAudioConnection('connecting');
  //   await startAudioStream();
  // }, [startAudioStream]);

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
