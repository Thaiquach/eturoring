<template>
    <div class="chat-dialog">
      <h2>Chatting with: {{ receiverName }}</h2>
      <div class="chat-window" ref="chatWindow">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="['message', msg.senderId === currentUserId ? 'me' : 'them']"
        >
          <div class="timestamp">
            {{ formatTime(msg.timestamp) }}
          </div>
          <div class="content">
            {{ msg.content }}
          </div>
        </div>
  
        <div v-if="isTyping" class="typing-indicator">Typing...</div>
      </div>
  
      <div class="chat-input">
        <input
          v-model="newMessage"
          @input="emitTyping"
          @keyup.enter="sendMessage"
          placeholder="Typing..."
        />
        <button @click="sendMessage">Send</button>
      </div>
    </div>
  </template>
  
<script>
//import * as signalR from "@microsoft/signalr";
import jwtDecode from "jwt-decode";
import messageService from "../../api/messageService";
import { connectToMessageHub, stopSignalR } from "../../api/signalr";

export default {
  name: "ChatDialog",
  data() {
    return {
      receiverId: this.$route.params.receiverId,
      receiverName: this.$route.params.receiverName || "Người dùng",
      currentUserId: null,
      messages: [],
      newMessage: "",
      connection: null,
      isTyping: false,
      typingTimeout: null,
    };
  },
  mounted() {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn chưa đăng nhập!");
      return;
    }
    this.getTokenInfo();

    messageService
      .getConversation(this.receiverId)
      .then((response) => {
        this.messages = response.data.map((msg) => ({
          ...msg,
          timestamp: new Date(), // hoặc msg.timestamp nếu có
        }));
        this.scrollToBottom();
      })
      .catch((err) => console.error("Lỗi tải tin nhắn:", err));

    if (this.connection) {
      this.connection.off("ReceiveMessage");
    }
    this.connection = connectToMessageHub(token, this.receiveMessage);


  },
  beforeUnmount() {
    stopSignalR();
    clearTimeout(this.typingTimeout);
  },
  methods: {
    receiveMessage({ senderId, content }) {
      console.log("📥 Nhận tin nhắn realtime từ:", senderId, content);
      if (this.receiverId === senderId || senderId === this.currentUserId) {
        this.messages.push({
          senderId,
          content,
          timestamp: new Date(),
        });
        this.scrollToBottom();
      }
    },
    getTokenInfo() {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        this.currentUserId = decoded.nameid;
      }
    },
    sendMessage() {
      if (!this.newMessage.trim()) return;
      messageService
        .sendMessage({
          receiverId: this.receiverId,
          content: this.newMessage,
        })
        .then(() => {
          this.messages.push({
            senderId: this.currentUserId,
            content: this.newMessage,
            timestamp: new Date(),
          });
          if (this.connection?.state === "Connected") {
            this.connection.invoke("SendMessage", this.currentUserId, this.receiverId, this.newMessage)
              .catch(err => console.error("❌ Lỗi gửi SignalR:", err));
          }

          this.newMessage = "";
          this.scrollToBottom();
        })
        .catch((err) => console.error("Lỗi gửi tin nhắn:", err));
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const el = this.$refs.chatWindow;
        if (el) el.scrollTop = el.scrollHeight;
      });
    },
    formatTime(date) {
      const d = new Date(date);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    },
    emitTyping() {
      // if (this.connection?.state === "Connected") {
      //   this.connection.invoke("SendTyping", this.receiverId).catch(() => {});
      // }
    },
    // formatTime(date) {
    //   const d = new Date(date);
    //   return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    // }
  },
};
</script>

<style scoped>
.chat-dialog {
  border: 2px solid #e83e8c;
  border-radius: 12px;
  padding: 12px;
  background: linear-gradient(135deg, #ffe6f0, #fff0f5);
  box-shadow: 0 4px 15px rgba(232, 62, 140, 0.2);
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chat-window {
  height: 400px;
  overflow-y: auto;
  margin-bottom: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.message {
  max-width: 60%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.3s ease;
}

.message .timestamp {
  font-size: 0.75rem;
  color: #888;
  margin-bottom: 4px;
}

.message .content {
  padding: 8px;
  border-radius: 10px;
  word-break: break-word;
}

.message.me {
  align-self: flex-end;
  text-align: right;
}

.message.me .content {
  background-color: #fddde6;
  color: #8a084b;
  border: 1px solid #f5a3c7;
}

.message.them {
  align-self: flex-start;
  text-align: left;
}

.message.them .content {
  background-color: #d0ebff;
  color: #084298;
  border: 1px solid #74c0fc;
}

.typing-indicator {
  font-style: italic;
  color: #d63384;
  padding-left: 8px;
  animation: blink 1s infinite;
}

@keyframes blink {
  0% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.2;
  }
}

.chat-input {
  display: flex;
  align-items: center;
}

.chat-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #f3acc6;
  border-radius: 20px;
  outline: none;
  transition: border-color 0.3s;
}

.chat-input input:focus {
  border-color: #e83e8c;
}

.chat-input button {
  padding: 8px 14px;
  margin-left: 10px;
  background: #e83e8c;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  transition: background 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-input button:hover {
  background: #d63384;
}

.chat-input button::before {
  content: "📤";
}
</style>
