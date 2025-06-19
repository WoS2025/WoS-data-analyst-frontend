<template>
  <div class="chat-list">
    <button class="chat-item">聊天室1</button>
    <button class="chat-item">聊天室2</button>
    <button class="chat-item">聊天室3</button>
    <button class="chat-item new-chat">新增聊天室</button>
  </div>
</template>

<script>
export default {
  name: "ChatList",
};
</script>

<style scoped>
.chat-list {
  width: 20%;
  background-color: #ffffff;
  padding: 10px;
  display: flex;
  flex-direction: column;
  border-radius: 3em;
}

.chat-item {
  margin: 5px 0;
  padding: 10px;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 3em;
  cursor: pointer;
}

.new-chat {
  background-color: #e0e0e0;
}
</style>
