// Controlador de chats - Orquesta la lógica entre servicio y UI

import { loadChats, createGroup, createGroupMock } from '@/scripts/services/chatsService.js';
import { renderChatList, setActiveChat, addChatToList } from '@/scripts/ui/components/ChatList.js';
import { loadChatMessages } from '@/scripts/controllers/messagesController.js';
import { scrollToBottom } from '@/scripts/ui/components/ConversationPanel';
import { toggleState, updateInputState, updateToggleState } from '../ui/components/Modals/OptionsChatModal';
import { updateChatState } from '../services/messages';
import { getGroupMembers } from '../services/groups';
import { sendChatStateChange, onChatStateChange } from '../services/socket';

const $isOpenToggle = document.getElementById('isOpenToggle');

// -- ESTADO DEL CONTROLADOR
export let currentChats = [];
export let members = [];
export let userRole = null;
export let activeChatId = null;
export let activeChat = null;
const user = JSON.parse(localStorage.getItem('user'));

// -- CONFIGURACIÓN
const USE_MOCK_DATA = false; // Cambiar a false cuando la API esté lista

// -- FUNCIONES PÚBLICAS

/**
 * Inicializa el controlador de chats
 * Carga y renderiza la lista de chats
 */
export const initChatsController = async () => {
  try {
    console.log('Inicializando controlador de chats...');
    
    // Cargar chats (mock o API según configuración)
    const chats = await loadChats();
    console.log(chats);
    
    // Guardar en estado
    currentChats = chats;
    
    // Renderizar en UI
    renderChatList(chats);
    
    console.log(`✅ ${chats.length} chats cargados correctamente`);
    
    // Configurar event listeners
    setupChatListeners();
    $isOpenToggle.addEventListener('click', async (event) => {
      event.stopPropagation();
      if (userRole !== 'ADMIN') {
        alert("Solo los administradores pueden abrir/cerrar chats")
        return;
      };
      
      const newState = !activeChat.isOpenChat;
      
      // Actualizar en el servidor
      await updateChatState(activeChat.id, newState);
      
      // Emitir evento de socket para sincronizar con otros usuarios
      sendChatStateChange(activeChat.id, newState);
      
      // Actualizar estado local
      activeChat.isOpenChat = newState;
      toggleState(activeChat.id, !newState, () => {}); // Solo actualiza UI
    });
    
    // Escuchar cambios de estado de chat desde otros usuarios
    onChatStateChange((payload) => {
      console.log('📢 Chat state changed:', payload);
      
      // Si es el chat activo, actualizar UI
      if (payload.chatId === activeChatId) {
        activeChat.isOpenChat = payload.isOpenChat;
        updateToggleState(payload.isOpenChat);
        updateInputState(userRole === 'ADMIN' ? true : payload.isOpenChat);
      }
      
      // Actualizar en la lista de chats
      const chat = currentChats.find(c => c.id === payload.chatId);
      if (chat) {
        chat.isOpenChat = payload.isOpenChat;
      }
    });
    
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
    activeChat = currentChats.find(chat => chat.id === activeChatId);
    console.log(activeChat);

    //updateChatState(chatId, true);
    members = await getGroupMembers(chatId);
    console.log("members", members);
    userRole = members.find(member => member.userId === user.id).role;
    console.log("userRole", userRole);

    updateToggleState(activeChat.isOpenChat);
    updateInputState(userRole === 'ADMIN' ? true : activeChat.isOpenChat);
    
    //  Cargar mensajes del chat
    await loadChatMessages(chatId);
    scrollToBottom();
    
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
    
    const chats = await loadChats();
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

