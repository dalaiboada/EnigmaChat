// Servicio para gestionar chats - Llamadas a la API

import { authService } from './authServece.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// -- FUNCIONES AUXILIARES 

// Transforma los datos de la API al formato esperado por ChatList
const transformChatsData = (apiChats, currentUsername) => {
  return apiChats.map(chat => {
    const isGroup = chat.chatType === 'GROUP';
    
    let chatName;
    if (isGroup) {
      // Para grupos, usar el nombre del grupo
      chatName = chat.groupChat?.groupName || 'Grupo sin nombre';
    } else {
      // Para chats individuales, obtener el otro participante
      // participants es un array de usernames
      if (chat.individualChat?.participants) {
        const otherParticipant = chat.individualChat.participants.find(
          username => username !== currentUsername
        );
        chatName = otherParticipant || chat.individualChat.participants[0] || 'Usuario';
      } 
      else {
        chatName = 'Chat individual';
      }
    }
    
    return {
      id: chat.id,
      name: chatName,
      isGroup,
      isActive: false
    };
  });
};

// Realiza una petición autenticada a la API
const authenticatedFetch = async (endpoint, options = {}) => {
  // Verificar autenticación
  if (!authService.isAuthenticated()) throw new Error('Usuario no autenticado');
  
  const token = authService.getToken();
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    },
    credentials: 'include'
  });
  
  // Manejar errores de autenticación
  if (response.status === 401) {
    authService.logout();
    window.location.href = '/index.html';
    throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente');
  }
  
  // Verificar si la respuesta es exitosa
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
};

// -- FUNCIONES PÚBLICAS

// TODO: Carga la lista de chats del usuario autenticado desde la API
export const loadChats = async () => {
  try {
    const apiChats = await authenticatedFetch('/chats', {
      method: 'GET'
    });
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const currentUsername = user.username || '';
    
    const formattedChats = transformChatsData(apiChats, currentUsername);
    
    return formattedChats;
  } catch (error) {
    console.error('Error al cargar los chats:', error);
    throw error;
  }
};

// Carga datos de prueba para desarrollo (sin llamar a la API)
export const loadChatsMock = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const mockApiChats = [
    {
      id: "chat-001",
      chatType: "INDIVIDUAL",
      enigmaMasterKey: "clave123",
      createdAt: "2025-11-25T10:00:00Z",
      updatedAt: "2025-11-25T18:45:00Z",
      individualChat: {
        participants: ["lilith_zahir", "eva_martinez"],
        enigmaMasterKey: "clave123"
      },
      groupChat: null
    },
    {
      id: "chat-002",
      chatType: "INDIVIDUAL",
      enigmaMasterKey: "clave456",
      createdAt: "2025-11-24T08:00:00Z",
      updatedAt: "2025-11-25T20:00:00Z",
      individualChat: {
        participants: ["lilith_zahir", "daniel_torres"],
        enigmaMasterKey: "clave456"
      },
      groupChat: null
    },
    {
      id: "chat-003",
      chatType: "GROUP",
      enigmaMasterKey: "claveGrupo1",
      createdAt: "2025-11-23T15:30:00Z",
      updatedAt: "2025-11-26T01:15:00Z",
      individualChat: null,
      groupChat: {
        chatId: "chat-003",
        creatorId: "user-current",
        groupName: "Grupo Enigmático",
        groupDescription: "Grupo de desarrollo",
        isOpenChat: true,
        isEditable: false,
        canInvite: true
      }
    },
    {
      id: "chat-004",
      chatType: "GROUP",
      enigmaMasterKey: "claveGrupo2",
      createdAt: "2025-11-22T12:00:00Z",
      updatedAt: "2025-11-26T02:00:00Z",
      individualChat: null,
      groupChat: {
        chatId: "chat-004",
        creatorId: "user-999",
        groupName: "Equipo Dev",
        groupDescription: null,
        isOpenChat: false,
        isEditable: true,
        canInvite: false
      }
    }
  ];
  
  // Usar "lilith_zahir" como username del usuario actual para los datos mock
  const formattedChats = transformChatsData(mockApiChats, "lilith_zahir");
  
  return formattedChats;
};

// TODO: Crea un nuevo grupo usando la API
export const createGroup = async (groupData) => {
  try {
    const { name, description, participants, permissions, enigmaMasterKey } = groupData;
    
    // Validar datos requeridos
    if (!name || !participants || participants.length === 0) {
      throw new Error('Nombre y participantes son requeridos');
    }
    
    // Preparar datos para la API
    const requestBody = {
      name,
      description: description || null,
      participants,
      isOpenChat: permissions?.includes('1') || true,
      isEditable: permissions?.includes('2') || false,
      canInvite: permissions?.includes('3') || true,
      enigmaMasterKey: enigmaMasterKey || `key_${Date.now()}`
    };
    
    const newGroup = await authenticatedFetch('/chats/groups', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
    
    // Transformar el grupo creado al formato esperado
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const currentUsername = user.username || '';
    const formattedGroup = transformChatsData([newGroup], currentUsername)[0];
    
    return formattedGroup;
  } catch (error) {
    console.error('Error al crear el grupo:', error);
    throw error;
  }
};

// Crea un nuevo grupo con datos de prueba (sin llamar a la API)
export const createGroupMock = async (groupData) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const { name, description, participants, permissions } = groupData;
  
  // Validar datos requeridos
  if (!name || !participants || participants.length === 0) {
    throw new Error('Nombre y participantes son requeridos');
  }
  
  // Generar ID único
  const newGroupId = `chat-${Date.now()}`;
  
  // Crear grupo mock con la estructura de la API
  const mockNewGroup = {
    id: newGroupId,
    chatType: "GROUP",
    enigmaMasterKey: `key_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    individualChat: null,
    groupChat: {
      chatId: newGroupId,
      creatorId: "user-current",
      groupName: name,
      groupDescription: description || null,
      isOpenChat: permissions?.includes('1') || true,
      isEditable: permissions?.includes('2') || false,
      canInvite: permissions?.includes('3') || true
    }
  };
  
  console.log('✅ Grupo mock creado:', mockNewGroup);
  
  // Transformar al formato esperado
  const formattedGroup = transformChatsData([mockNewGroup], "lilith_zahir")[0];
  
  return formattedGroup;
};

