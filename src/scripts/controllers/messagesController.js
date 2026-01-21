// Controlador de mensajes - Orquesta la carga y renderizado de mensajes
import CryptoJS from 'crypto-js';

import { loadMessages, sendMessage as sendApiMessage, updateChatStateMock } from '@/scripts/services/messages.js';
import { renderAllMessages, addMessage, clearMessages } from '@/scripts/ui/components/ConversationPanel.js';
import { 
  connect, 
  joinChat, 
  leaveChat, 
  sendMessage as sendSocketMessage, 
  sendTyping, 
  sendStopTyping, 
  onMessage, 
  onTyping, 
  onStopTyping 
} from '@/scripts/services/socket.js';
import { updateChatState } from '../services/messages';
import { activeChat } from './chatsController.js';

// -- ESTADO DEL CONTROLADOR
let currentChatId = null;
export let currentChatData = null;
let currentMessages = [];
let typingTimeout = null;
const user = JSON.parse(localStorage.getItem('user'));

const $messageForm = document.getElementById('message-form');
const $messageInput = document.getElementById('message-input');
const $conversationStatus = document.querySelector('.conversation-status');

$messageInput.addEventListener('input', () => {
  if (!currentChatId) return;

  sendTyping(currentChatId);

  if (typingTimeout) clearTimeout(typingTimeout);

  typingTimeout = setTimeout(() => {
    sendStopTyping(currentChatId);
  }, 2000);
});

$messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  handleSendMessage($messageInput.value)
});

// -- CONFIGURACIÓN
const USE_MOCK_DATA = false; // Cambiar a false cuando la API esté lista

// -- FUNCIONES PÚBLICAS

/**
 * Carga y renderiza los mensajes de un chat específico
 * @param {string} chatId - ID del chat a cargar
 */
export const loadChatMessages = async (chatId) => {
  try {
    if (!chatId) {
      console.error('ID de chat requerido');
      return;
    }
    
    console.log(`Cargando mensajes del chat: ${chatId}`);
    
    // Cargar mensajes (mock o API según configuración)
    const messages = await loadMessages(chatId);
    console.log('CONTROLLER: ', messages)
    
    // Guardar en estado
    currentChatId = chatId;
    currentMessages = messages;
    
    // Renderizar en UI
    renderAllMessages(messages, true);
    
    // Socket: Unirse al chat
    joinChat(chatId);

    console.log(`✅ ${messages.length} mensajes cargados correctamente`);
    
  } catch (error) {
    console.error('❌ Error al cargar mensajes:', error);
    // TODO: Mostrar mensaje de error al usuario
  }
};

/**
 * Envía un nuevo mensaje al chat actual
 * @param {string} content - Contenido del mensaje
 */
export const handleSendMessage = async (content) => {
  try {
    if (!currentChatId) {
      console.error('No hay chat activo');
      return;
    }
    
    if (!content || !content.trim()) {
      console.error('El mensaje no puede estar vacío');
      return;
    }
    
    console.log('Enviando mensaje...', content);
    
    const encryptedContent = CryptoJS.AES.encrypt(content, 'secret-key').toString();
    
    console.log('Enviando mensaje encriptado...', encryptedContent);
    
    // Enviar mensaje (mock o API según configuración)
    const newMessage = await sendApiMessage(currentChatId, encryptedContent);

    // Socket: Enviar mensaje
    sendSocketMessage(currentChatId, encryptedContent, user.username);
    
    // Agregar al estado
    currentMessages.push(newMessage);
    
    // Agregar a la UI
    addMessage(newMessage);

    $messageInput.value = "";
    $messageInput.focus();
    
    console.log('✅ Mensaje enviado exitosamente');
    
    return newMessage;
  } catch (error) {
    console.error('❌ Error al enviar mensaje:', error);
    throw error;
  }
};

/**
 * Limpia los mensajes del chat actual
 */
export const clearCurrentChat = () => {
  if (currentChatId) {
    leaveChat(currentChatId);
  }
  currentChatId = null;
  currentMessages = [];
  clearMessages();
  console.log('Chat limpiado');
};

/**
 * Obtiene el ID del chat actual
 * @returns {string|null} ID del chat actual o null
 */
export const getCurrentChatId = () => {
  return currentChatId;
};

/**
 * Obtiene todos los mensajes del chat actual
 * @returns {Array} Lista de mensajes
 */
export const getCurrentMessages = () => {
  return [...currentMessages];
};

/**
 * Recarga los mensajes del chat actual
 */
export const reloadCurrentChat = async () => {
  if (currentChatId) {
    await loadChatMessages(currentChatId);
  }
};


// TODO: [Revisar] Fue un invento mío
export const initMessagesController = () => {
	console.log('MessagesController.js loaded');

  // Inicializar socket
  connect();

  // Configurar listeners de socket
  onMessage((payload) => {
    console.log('📩 Mensaje recibido:', payload);
    if (payload.chatId === currentChatId) {
      const message = {
        id: Date.now().toString(), // ID temporal
        content: payload.ciphertext,
        sender: payload.sender,
        timestamp: payload.timestamp,
        isOwn: false,
      };
      currentMessages.push(message);
      addMessage(message);
    }
  });

  onTyping((payload) => {
    if (payload.chatId === currentChatId) {
      // TODO: Mostrar quién está escribiendo si tenemos el nombre
      $conversationStatus.textContent = 'Escribiendo...';
      $conversationStatus.style.color = 'var(--color-primary)';
    }
  });

  onStopTyping((payload) => {
    if (payload.chatId === currentChatId) {
      $conversationStatus.textContent = 'En línea • ';
      $conversationStatus.style.color = '';
    }
  });
}
