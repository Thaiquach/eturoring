// src/api/signalr.js
import * as signalR from '@microsoft/signalr';

let connection = null;
let isListenerRegistered = false;

export function connectToMessageHub(token, onReceiveMessage) {
  // Nếu đã có connection thì chỉ cần update lại callback
  if (connection) {
    // Xóa callback cũ (tránh bị giữ callback cũ từ lần mount trước)
    connection.off("ReceiveMessage");

    // Đăng ký lại
    connection.on("ReceiveMessage", (senderId, content) => {
      console.log("📩 ReceiveMessage", senderId, content);
      onReceiveMessage({ senderId, content });
    });

    return connection;
  }
  connection = new signalR.HubConnectionBuilder()
    .withUrl('https://localhost:7050/MessageHub', {
      accessTokenFactory: () => token
    })
    .withAutomaticReconnect()
    .build();
  // 🧹 Xóa listener cũ trước khi thêm mới
  connection.off("ReceiveMessage");
  // ✅ luôn đăng ký callback mới (off trước tránh nhân bản)
  connection.on("ReceiveMessage", (senderId, content) => {
    console.log("📩 ReceiveMessage", senderId, content);
    onReceiveMessage({ senderId, content });
  });
  isListenerRegistered = true;

  connection.onreconnecting(() => {
    console.warn('🔄 Đang kết nối lại với SignalR...');
  });

  connection.onreconnected(() => {
    console.log('✅ Đã kết nối lại thành công với SignalR');
  });

  connection.start()
    .then(() => console.log('✅ Đã kết nối SignalR'))
    .catch((err) => console.error('❌ Lỗi kết nối SignalR:', err));
  return connection;
}
export function stopSignalR() {
  if (connection) {
    connection.stop();
    connection = null;
    isListenerRegistered = false; // ✅ reset flag để cho phép kết nối lại
  }
}
