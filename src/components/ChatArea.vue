<template>
  <div class="chat-area">
    <div class="chat-messages">
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="
          message.type === 'user'
            ? 'message user-message'
            : 'message ai-message'
        "
      >
        <span>{{ message.text }}</span>
      </div>
    </div>
    <div class="chat-input">
      <input v-model="newMessage" type="text" placeholder="請輸入文字..." />
      <button class="send-button" @click="sendMessage">送出</button>
    </div>
  </div>
</template>

<script>
import { backendURL } from "../scripts/config.js";
export default {
  name: "ChatArea",
  data() {
    return {
      messages: [{ type: "ai", text: "您好，有什麼可以幫忙的嗎？" }],
      newMessage: "",
    };
  },
  methods: {
    async sendMessage() {
      if (this.newMessage.trim() !== "") {
        this.messages.push({ type: "user", text: this.newMessage });
        const userMessage = { prompt: this.newMessage };
        this.newMessage = "";
        const response = await fetch(`http://127.0.0.1:5000/llm/ask`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userMessage),
        });
        const dataa = await response.json();
        console.log(dataa.result);

        setTimeout(() => {
          this.messages.push({
            type: "ai",
            text: dataa.result,
          });
        }, 1000);
      }
    },
  },
};
</script>

<style scoped>
.chat-area {
  width: 60%;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.message {
  margin: 5px 0;
  padding: 10px;
  border-radius: 5px;
  max-width: 70%;
}

.user-message {
  background-color: #d1e7dd;
  align-self: flex-end;
  text-align: right;
}

.ai-message {
  background-color: #f8d7da;
  align-self: flex-start;
  text-align: left;
}

.chat-input {
  display: flex;
  padding: 10px;
  border-top: 1px solid #ddd;
}

.chat-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 3em;
}

.send-button {
  margin-left: 10px;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 3em;
  cursor: pointer;
}
</style>
