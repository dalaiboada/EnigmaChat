// Gestión y renderizado de la lista de chats

// -- ELEMENTOS DEL DOM
const chatListContainer = document.querySelector('.chats-list');

// -- FUNCIONES AUXILIARES
/**
 * Genera las iniciales para el avatar del chat
 * @param {string} name - Nombre del chat o grupo
 * @returns {string} Iniciales en mayúsculas
 */
const generateChatInitials = name => {
  if (!name) return '??';
  
  const words = name.trim().split(' ');
  
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  
  return (words[0][0] + words[1][0]).toUpperCase();
};

/**
 * Formatea la hora del último mensaje
 * @param {string|Date} timestamp - Timestamp del mensaje
 * @returns {string} Hora formateada (HH:MM)
 */
const formatChatTime = timestamp => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${hours}:${minutes}`;
};

/**
 * Formatea el preview del mensaje según el tipo de chat
 * @param {Object} lastMessage - Último mensaje del chat
 * @param {boolean} isGroup - Si es un chat grupal
 * @returns {string} Preview formateado
 */
const formatChatPreview = (lastMessage, isGroup) => {
  if (!lastMessage || !lastMessage.content) return '';
  
  const { sender, content } = lastMessage;
  
  // Si es un grupo, mostrar el nombre del remitente
  if (isGroup && sender) {
    return `${sender.toUpperCase()}: ${content}`;
  }
  
  return content;
};

// -- FUNCIONES DE RENDERIZADO
/**
 * Crea un elemento chat-item individual
 * @param {Object} chat - Objeto con la información del chat
 * @param {string} chat.id - ID único del chat
 * @param {string} chat.name - Nombre del chat o grupo
 * @param {boolean} chat.isGroup - Indica si es un grupo
 * @param {boolean} chat.isActive - Indica si el chat está activo
 * @param {Object} chat.lastMessage - Último mensaje (opcional)
 * @returns {HTMLElement} Elemento DOM del chat-item
 */
export const createChatItem = chat => {
  const { id, name, isActive = false, isGroup = false, lastMessage } = chat;
  
  const $chatItem = document.createElement('div');
  $chatItem.className = `chat-item${isActive ? ' active' : ''}`;
  $chatItem.dataset.chatId = id;
  
  const $avatar = document.createElement('div');
  $avatar.className = 'chat-avatar';
  $avatar.textContent = generateChatInitials(name);
  $chatItem.appendChild($avatar);

  const $info = document.createElement('div');
  $info.className = 'chat-info';
  $chatItem.appendChild($info);

  const $name = document.createElement('div');
  $name.className = 'chat-name';
  $name.textContent = name;
  $info.appendChild($name);

  if (lastMessage) {
      const $preview = document.createElement('div');
      $preview.className = 'chat-preview';
      $preview.textContent = formatChatPreview(lastMessage, isGroup);
      $info.appendChild($preview);
  }

  if (lastMessage) {
      const $time = document.createElement('div');
      $time.className = 'chat-time';
      $time.textContent = formatChatTime(lastMessage.timestamp);
      $chatItem.appendChild($time);
  }
  
  return $chatItem;
};

/**
 * Renderiza la lista completa de chats
 * @param {Array<Object>} chats - Array de objetos con información de chats
 */
export const renderChatList = chats => {
  if (!chatListContainer) {
    console.error('No se encontró el contenedor de la lista de chats');
    return;
  }
  
  // Limpiar lista actual
  chatListContainer.replaceChildren();
  
  // Renderizar cada chat
  chats.forEach(chat => {
    const $chatItem = createChatItem(chat);
    chatListContainer.appendChild($chatItem);
  });
};

/**
 * Agrega un chat individual a la lista (sin limpiar los existentes)
 * @param {Object} chat - Objeto con la información del chat
 * @param {boolean} prepend - Si es true, agrega al inicio; si es false, al final
 */
export const addChatToList = (chat, prepend = true) => {
  if (!chatListContainer) {
    console.error('No se encontró el contenedor de la lista de chats');
    return;
  }
  
  const $chatItem = createChatItem(chat);
  
  if (prepend) {
    chatListContainer.prepend($chatItem);
  } else {
    chatListContainer.appendChild($chatItem);
  }
};

/**
 * Actualiza un chat existente en la lista
 * @param {string} chatId - ID del chat a actualizar
 * @param {Object} updatedData - Datos actualizados del chat
 */
export const updateChatInList = (chatId, updatedData) => {
  const $existingChat = chatListContainer?.querySelector(`[data-chat-id="${chatId}"]`);
  
  if (!$existingChat) {
    console.warn(`No se encontró el chat con ID: ${chatId}`);
    return;
  }
  
  // Crear nuevo elemento con datos actualizados
  const $newChatItem = createChatItem({ id: chatId, ...updatedData });
  
  // Reemplazar el elemento existente
  $existingChat.replaceWith($newChatItem);
};

/**
 * Elimina un chat de la lista
 * @param {string} chatId - ID del chat a eliminar
 */
export const removeChatFromList = chatId => {
  const $chatToRemove = chatListContainer?.querySelector(`[data-chat-id="${chatId}"]`);
  
  if ($chatToRemove) {
    $chatToRemove.remove();
  }
};

/**
 * Marca un chat como activo y desmarca los demás
 * @param {string} chatId - ID del chat a marcar como activo
 */
export const setActiveChat = chatId => {
  // Remover clase active de todos los chats
  chatListContainer?.querySelectorAll('.chat-item').forEach($chat => {
    $chat.classList.remove('active');
  });
  
  // Agregar clase active al chat seleccionado
  const $selectedChat = chatListContainer?.querySelector(`[data-chat-id="${chatId}"]`);
  if ($selectedChat) {
    $selectedChat.classList.add('active');
  }
};

/**
 * Limpia toda la lista de chats
 */
export const clearChatList = () => {
  if (chatListContainer) {
    chatListContainer.replaceChildren();
  }
};
