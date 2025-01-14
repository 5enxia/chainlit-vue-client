import { useStateStore, type State } from "@/state";
import { storeToRefs, type Store } from "pinia";

const useChatMessages = (store: Store<"state", State>) => {
  // const store = useStateStore();
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
