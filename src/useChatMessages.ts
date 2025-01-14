// import { useRecoilValue } from 'recoil';

// import {
//   currentThreadIdState,
//   firstUserInteraction,
//   messagesState
// } from './state';
import { useStateStore } from "./state";

const useChatMessages = () => {
  // const messages = useRecoilValue(messagesState);
  // const firstInteraction = useRecoilValue(firstUserInteraction);
  // const threadId = useRecoilValue(currentThreadIdState);
  const { messagesState: messages } = useStateStore();
  const { firstUserInteraction: firstInteraction } = useStateStore();
  const { currentThreadIdState: threadId } = useStateStore();

  return {
    threadId,
    messages,
    firstInteraction
  };
};

export { useChatMessages };
