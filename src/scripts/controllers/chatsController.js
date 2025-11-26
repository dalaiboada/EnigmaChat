// Controlador de chats - Orquesta la lógica entre servicio y UI

import { loadChats, loadChatsMock, createGroup, createGroupMock } from '@/scripts/services/chatsService.js';
import { renderChatList, setActiveChat, addChatToList } from '@/scripts/ui/components/ChatList.js';

// -- ESTADO DEL CONTROLADOR
let currentChats = [];
let activeChatId = null;

// -- CONFIGURACIÓN
const USE_MOCK_DATA = true; // Cambiar a false cuando la API esté lista

// -- FUNCIONES PÚBLICAS

/**
 * Inicializa el controlador de chats
 * Carga y renderiza la lista de chats
 */
export const initChatsController = async () => {
  try {
    console.log('Inicializando controlador de chats...');
    
    // Cargar chats (mock o API según configuración)
    const chats = USE_MOCK_DATA ? await loadChatsMock() : await loadChats();
    
    // Guardar en estado
    currentChats = chats;
    
    // Renderizar en UI
    renderChatList(chats);
    
    console.log(`✅ ${chats.length} chats cargados correctamente`);
    
    // Configurar event listeners
    setupChatListeners();
    
  } catch (error) {
    console.error('❌ Error al inicializar chats:', error);
    // TODO: Mostrar mensaje de error al usuario
  }
};

/**
 * Maneja el click en un chat de la lista
 * @param {string} chatId - ID del chat clickeado
 */
export const handleChatClick = async (chatId) => {
  try {
    console.log(`Chat seleccionado: ${chatId}`);
    
    // Marcar como activo en UI
    setActiveChat(chatId);
    
    // Guardar en estado
    activeChatId = chatId;
    
    // TODO: Cargar mensajes del chat
    // const messages = await loadMessages(chatId);
    // renderMessages(messages);
    
  } catch (error) {
    console.error(`Error al seleccionar chat ${chatId}:`, error);
  }
};

/**
 * Recarga la lista de chats
 */
export const reloadChats = async () => {
  try {
    console.log('Recargando chats...');
    
    const chats = USE_MOCK_DATA ? await loadChatsMock() : await loadChats();
    currentChats = chats;
    renderChatList(chats);
    
    // Restaurar chat activo si existe
    if (activeChatId) {
      setActiveChat(activeChatId);
    }
    
    console.log('✅ Chats recargados');
  } catch (error) {
    console.error('❌ Error al recargar chats:', error);
  }
};

/**
 * Obtiene el chat actualmente seleccionado
 * @returns {Object|null} Chat activo o null
 */
export const getActiveChat = () => {
  if (!activeChatId) return null;
  return currentChats.find(chat => chat.id === activeChatId) || null;
};

/**
 * Obtiene todos los chats cargados
 * @returns {Array} Lista de chats
 */
export const getAllChats = () => {
  return [...currentChats];
};

/**
 * Maneja la creación de un nuevo grupo
 * @param {Object} groupData - Datos del grupo a crear
 * @returns {Promise<Object>} Grupo creado
 */
export const handleCreateGroup = async (groupData) => {
  try {
    console.log('Creando grupo...', groupData);
    
    // Crear grupo (mock o API según configuración)
    const newGroup = USE_MOCK_DATA 
      ? await createGroupMock(groupData) 
      : await createGroup(groupData);
    
    // Agregar al estado
    currentChats.unshift(newGroup);
    
    // Agregar a la UI (al inicio de la lista)
    addChatToList(newGroup, true);
    
    console.log('✅ Grupo creado exitosamente:', newGroup);
    
    return newGroup;
  } catch (error) {
    console.error('❌ Error al crear el grupo:', error);
    throw error;
  }
};

// -- FUNCIONES PRIVADAS

/**
 * Configura los event listeners para la lista de chats
 */
const setupChatListeners = () => {
  const chatListContainer = document.querySelector('.chats-list');
  
  if (!chatListContainer) {
    console.warn('No se encontró el contenedor de chats');
    return;
  }
  
  // Delegación de eventos para los chat-items
  chatListContainer.addEventListener('click', (e) => {
    const chatItem = e.target.closest('.chat-item');
    
    if (chatItem) {
      const chatId = chatItem.dataset.chatId;
      if (chatId) {
        handleChatClick(chatId);
      }
    }
  });
  
  console.log('✅ Event listeners configurados');
};
