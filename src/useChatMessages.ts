import { useStateStore } from "@/state";
import { storeToRefs } from "pinia";

const useChatMessages = () => {
  const store = useStateStore();
  const {
    messagesState: messages,
    firstUserInteraction: firstInteraction,
    currentThreadIdState: threadId
  } = storeToRefs(store);

  return {
    threadId,
    messages,
    firstInteraction
  };
};

export { useChatMessages };
