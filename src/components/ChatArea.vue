<template>
  <div class="chat-area">
    <div class="chat-header">
      <!-- <h3>您好，請問有什麼可以幫忙的嗎</h3> -->
    </div>
    <div class="chat-messages">
      <!-- <div class="message user-message">
        <span>請幫我寫簡報文</span>
      </div>
      <div class="message ai-message">
        <span>好的，請稍等...</span>
      </div> -->
    </div>
    <div class="chat-input">
      <input type="text" placeholder="請輸入文字..." />
      <button class="send-button">送出</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChatArea",
};
</script>

<style scoped>
.chat-area {
  width: 60%;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.chat-header {
  background-color: #f5f5f5;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.message {
  margin: 5px 0;
  padding: 10px;
  border-radius: 5px;
}

.user-message {
  background-color: #d1e7dd;
  align-self: flex-end;
}

.ai-message {
  background-color: #f8d7da;
  align-self: flex-start;
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
