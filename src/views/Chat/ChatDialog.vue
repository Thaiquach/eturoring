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
import * as signalR from "@microsoft/signalr";
import jwtDecode from "jwt-decode";
import messageService from "../../api/messageService";

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

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7050/MessageHub", {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    this.connection
      .start()
      .then(() => console.log("✅ SignalR kết nối thành công!"))
      .catch((err) => console.error("❌ Kết nối thất bại:", err));

    this.connection.on("ReceiveMessage", (senderId, content) => {
      this.messages.push({ senderId, content, timestamp: new Date() });
      this.scrollToBottom();
    });

    this.connection.on("UserTyping", (senderId) => {
      if (senderId === this.receiverId) {
        this.isTyping = true;
        clearTimeout(this.typingTimeout);
        this.typingTimeout = setTimeout(() => (this.isTyping = false), 2000);
      }
    });

    this.connection.onreconnecting(() => {
      console.warn("🔄 Đang kết nối lại SignalR...");
    });
    this.connection.onreconnected(() => {
      console.log("🔌 SignalR kết nối lại thành công!");
    });
  },
  beforeUnmount() {
    if (this.connection) this.connection.stop();
    clearTimeout(this.typingTimeout);
  },
  methods: {
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
      if (this.connection?.state === "Connected") {
        this.connection.invoke("SendTyping", this.receiverId).catch(() => {});
      }
    },
    formatTime(date) {
      const d = new Date(date);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
  },
};
</script>
  
  <style scoped>
  .chat-window {
  border: 1px solid #ccc;
  height: 400px;
  overflow-y: auto;
  margin-bottom: 10px;
  padding: 10px;
  background: #f5f5f5;
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
}

.message .timestamp {
  font-size: 0.75rem;
  color: #666;
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
  background-color: #d1e7dd;
}

.message.them {
  align-self: flex-start;
  text-align: left;
}

.message.them .content {
  background-color: #f8d7da;
}

.chat-input {
  display: flex;
}

.chat-input input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.chat-input button {
  padding: 8px 16px;
  margin-left: 10px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.chat-input button:hover {
  background: #0056b3;
}

  </style>
  