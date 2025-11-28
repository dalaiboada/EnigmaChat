import { io } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js';

const WS_URL = import.meta.env.VITE_WS_URL || 'https://enigmachat-server.proceruss.com';

let socket = null;

export const connect = () => {
  if (socket?.connected) return;

  const token = localStorage.getItem('wsToken');
  if (!token) {
    console.error('No authentication token found for WebSocket');
    return;
  }

  socket = io(WS_URL, {
    auth: {
      token: token,
    },
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('✅ Connected to socket server');
  });

  socket.on('connect_error', (err) => {
    console.error('❌ Socket connection error:', err.message);
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ Disconnected from socket server:', reason);
  });
};

export const disconnect = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Chat actions
export const joinChat = (chatId) => {
  if (!socket) return;
  socket.emit('join-chat', chatId);
};

export const leaveChat = (chatId) => {
  if (!socket) return;
  socket.emit('leave-chat', chatId);
};

export const sendMessage = (chatId, ciphertext, sender) => {
  if (!socket) return;
  socket.emit('message', {
    chatId,
    ciphertext,
    sender,
  });
};

export const sendTyping = (chatId) => {
  if (!socket) return;
  socket.emit('typing', chatId);
};

export const sendStopTyping = (chatId) => {
  if (!socket) return;
  socket.emit('stop-typing', chatId);
};

export const sendChatStateChange = (chatId, isOpenChat) => {
  if (!socket) return;
  socket.emit('chat-state-change', {
    chatId,
    isOpenChat,
  });
};

// Event listeners
const addListener = (event, callback) => {
  if (!socket) return;
  
  // Remove previous listener if exists to avoid duplicates when re-registering
  socket.off(event);
  
  socket.on(event, (payload) => {
    callback(payload);
  });
};

export const onMessage = (callback) => {
  addListener('message', callback);
};

export const onTyping = (callback) => {
  addListener('typing', callback);
};

export const onStopTyping = (callback) => {
  addListener('stop-typing', callback);
};

export const onChatStateChange = (callback) => {
  addListener('chat-state-change', callback);
};
