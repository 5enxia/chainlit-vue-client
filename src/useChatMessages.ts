import { storeToRefs } from "pinia";
import { useStateStore } from "@/state";

const useChatMessages = () => {
  const store = useStateStore()
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
