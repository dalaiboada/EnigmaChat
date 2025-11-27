// Controlador de mensajes - Orquesta la carga y renderizado de mensajes

import { loadMessages, sendMessage } from '@/scripts/services/messages.js';
import { renderAllMessages, addMessage, clearMessages } from '@/scripts/ui/components/ConversationPanel.js';

// -- ESTADO DEL CONTROLADOR
let currentChatId = null;
let currentMessages = [];

const $messageForm = document.getElementById('message-form');
const $messageInput = document.getElementById('message-input');

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
    
    // Enviar mensaje (mock o API según configuración)
    const newMessage = await sendMessage(currentChatId, content);
    
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
