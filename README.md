## Overview

The `chainlit-vue-client` package provides a set of Vue plugin as well as an API client to connect to your [Chainlit](https://github.com/Chainlit/chainlit) application from any Vue application. The package includes composables for managing chat sessions, messages, data, and interactions.

## Installation

To install the package, run the following command in your project directory:

```sh
npm install chainlit-vue-client
```

This package use [Pinia](https://pinia.vuejs.org/) to manage its state. This means you will have to use your application with Pinia:

```ts
import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import { ChainlitAPI, createChainlit } from "chainlit-vue-client";

const CHAINLIT_SERVER = "http://localhost:80/chainlit";
const apiClient = new ChainlitAPI(CHAINLIT_SERVER, "webapp");

const app = createApp(App);
const pinia = createPinia();
const chainlit = createChainlit(apiClient);

app.use(pinia)
app.use(chainlit, { pinia })
app.mount("#app");
```

You can also try it out on a [example project](https://github.com/5enxia/chainlit-vue-frontend-example).

## Usage

### `useChatSession`

This composable is responsible for managing the chat session's connection to the WebSocket server.

#### Methods

- `connect`: Establishes a connection to the WebSocket server.
- `disconnect`: Disconnects from the WebSocket server.
- `setChatProfile`: Sets the chat profile state.

#### Example

```vue
<script setup lang="ts">
import { useChatSession, useStateStore } from "chainlit-vue-client";
import { storeToRefs } from "pinia";

const { connect } = useChatSession();
const store = useStateStore();
const { sessionState: session } = storeToRefs(store);

const userEnv = {};

(() => {
  if (session.value?.socket.connected) {
    return;
  }
  fetch("http://localhost:80/custom-auth", { credentials: "include" }).then(
    (res) => {
      console.log(res);
      connect({
        userEnv,
      });
    }
  );
})();

// Rest of your component logic
</script>
```

### `useChatMessages`

This composable provides access to the chat messages and the first user message.

#### Properties

- `messages`: An array of chat messages.
- `firstUserMessage`: The first message from the user.

#### Example

```vue
<script setup lang="ts">
// Rest of your component logic

import { useChatMessages } from "chainlit-vue-client"
const { messages, firstUserMessage } = useChatMessages();
</script>

<template>
  <div v-for="message in messages" :key="message.id">
    <p key={message.id}>{{message.output}}</p>
  </div>
</template>
```

### `useChatData`

This composable provides access to various chat-related data and states.

#### Properties

- `actions`: An array of actions.
- `askUser`: The current ask user state.
- `avatars`: An array of avatar elements.
- `chatSettingsDefaultValue`: The default value for chat settings.
- `chatSettingsInputs`: The current chat settings inputs.
- `chatSettingsValue`: The current value of chat settings.
- `connected`: A boolean indicating if the WebSocket connection is established.
- `disabled`: A boolean indicating if the chat is disabled.
- `elements`: An array of chat elements.
- `error`: A boolean indicating if there is an error in the session.
- `loading`: A boolean indicating if the chat is in a loading state.
- `tasklists`: An array of tasklist elements.

#### Example

```vue
<script setup lang="ts">
// Rest of your component logic

import { useChatData } from "chainlit-vue-client"
const { loading, connected, error } = useChatData();
</script>

<template>
  <div>
    <p v-if="loading">Loading...</p>
    <p v-if="error">Error connecting to chat...</p>
    <p v-if="!connected">Disconnected...</p>
  </div>
</template>
```

### `useChatInteract`

This composable provides methods to interact with the chat, such as sending messages, replying, and updating settings.

#### Methods

- `callAction`: Calls an action.
- `clear`: Clears the chat session.
- `replyMessage`: Replies to a message.
- `sendMessage`: Sends a message.
- `stopTask`: Stops the current task.
- `setIdToResume`: Sets the ID to resume a thread.
- `updateChatSettings`: Updates the chat settings.

#### Example

```vue
<script setup lang="ts">
// Rest of your component logic
import { useChatInteract } from "chainlit-vue-client";
const { sendMessage, replyMessage } = useChatInteract();

const handleSendMessage = () => {
  const message = {
    name: "user",
    type: "user_message" as const,
    output: "Hello, World!",
  };
  sendMessage(message, []);
};

const handleReplyMessage = () => {
  const message = {
    id: "1",
    name: "user",
    type: "user_message" as const,
    output: "Reply message",
    createdAt: new Date().toISOString(),
  };
  replyMessage(message);
};
</script>

<template>
  <div>
    <button @click="handleSendMessage">Send Message</button>
    <button @click="handleReplyMessage">Reply to Message</button>
  </div>
</template>
```
