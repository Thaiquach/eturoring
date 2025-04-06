<template>
    <div class="message-box">
      <h3>Chat với {{ receiver.fullName }}</h3>
      <div class="messages">
        <div v-for="message in messages" :key="message.id" :class="['message', message.senderId === userId ? 'sent' : 'received']">
          {{ message.content }}
        </div>
      </div>
      <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Nhập tin nhắn..." />
    </div>
  </template>
  
  <script>
  import messageService from '../../api/messageService';
  import * as signalR from '@microsoft/signalr';
  
  export default {
    props: {
      receiver: Object
    },
    data() {
      return {
        messages: [],
        newMessage: '',
        connection: null,
        userId: localStorage.getItem('userId')
      };
    },
    async created() {
      await this.loadConversation();
      this.setupSignalR();
    },
    methods: {
      async loadConversation() {
        const response = await messageService.getConversation(this.receiver.id);
        this.messages = response.data;
      },
      async sendMessage() {
        if (!this.newMessage) return;
  
        const message = {
          receiverId: this.receiver.id,
          content: this.newMessage
        };
  
        await messageService.sendMessage(message);
        this.newMessage = '';
        await this.loadConversation();
      },
      setupSignalR() {
        this.connection = new signalR.HubConnectionBuilder()
          .withUrl('https://localhost:5001/MessageHub')
          .configureLogging(signalR.LogLevel.Information)
          .build();
  
        this.connection.start().catch(err => console.error('SignalR connection error:', err));
  
        this.connection.on('ReceiveMessage', (senderId, content) => {
          if (senderId === this.receiver.id || senderId === this.userId) {
            this.messages.push({ senderId, content });
          }
        });
      }
    },
    beforeUnmount() {
      if (this.connection) {
        this.connection.stop();
      }
    }
  };
  </script>
  
  <style scoped>
  .message-box {
    border: 1px solid #ccc;
    padding: 10px;
    width: 100%;
  }
  
  .messages {
    max-height: 300px;
    overflow-y: auto;
    margin-bottom: 10px;
  }
  
  .message {
    padding: 5px 10px;
    margin-bottom: 5px;
    border-radius: 5px;
  }
  
  .sent {
    background-color: #dcf8c6;
    align-self: flex-end;
  }
  
  .received {
    background-color: #f1f1f1;
    align-self: flex-start;
  }
  
  input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
  }
  </style>
  