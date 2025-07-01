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
export default {
  name: "ChatArea",
  data() {
    return {
      messages: [
        { type: "user", text: "我要睡覺" },
        { type: "ai", text: "你去睡啊" },
        { type: "user", text: "我要吃東西" },
        { type: "ai", text: "已幫您搜尋附近寺廟" },
        { type: "user", text: "簡報需要包含市場分析" },
        { type: "ai", text: "不要" },
        { type: "user", text: "iphone 15 pro max現在市價多少" },
        { type: "ai", text: "我哪知道" },
        { type: "user", text: "睡不著怎麼辦" },
        {
          type: "ai",
          text: "可以聽聽看lemon中文版：\n那一天的忧郁  忧郁起来 那一天的寂寞  寂寞起来 连同着迷这个 炎炎夏日万般滋味 那个你 都化作了烙印 在我心底 挥之不去柠檬的香气",
        },
      ],
      newMessage: "",
    };
  },
  methods: {
    sendMessage() {
      if (this.newMessage.trim() !== "") {
        this.messages.push({ type: "user", text: this.newMessage });
        this.newMessage = "";

        setTimeout(() => {
          this.messages.push({
            type: "ai",
            text: "收到您的訊息，我正在處理。",
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
  align-self: flex-start; /* AI 訊息置左 */
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
