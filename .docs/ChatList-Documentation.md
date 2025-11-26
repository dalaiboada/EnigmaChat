# ChatList - Documentación Técnica

## 📋 Índice
1. [Arquitectura](#arquitectura)
2. [Estructura de Datos](#estructura-de-datos)
3. [API de Funciones](#api-de-funciones)
4. [Ejemplos de Uso](#ejemplos-de-uso)

---

## 🏗️ Arquitectura

### Separación de Responsabilidades

```
┌─────────────────────────────────────────────────────────┐
│                    chatsController.js                    │
│  (Orquesta la lógica entre servicio y renderizado)      │
└─────────────────────────────────────────────────────────┘
                    ↓                    ↓
        ┌───────────────────┐  ┌───────────────────┐
        │  chatsService.js  │  │   ChatList.js     │
        │  (API calls)      │  │  (Renderizado)    │
        └───────────────────┘  └───────────────────┘
```

### Responsabilidades por Módulo

**ChatList.js** (UI Component)
- ✅ Renderizar elementos DOM
- ✅ Manipular la lista de chats
- ✅ Gestionar estados visuales (activo/inactivo)
- ❌ NO hace llamadas a API
- ❌ NO transforma datos de la API

**chatsService.js** (Service Layer)
- ✅ Llamadas a la API
- ✅ Manejo de autenticación (JWT)
- ✅ Transformación de datos API → formato UI
- ❌ NO manipula el DOM

**chatsController.js** (Controller)
- ✅ Orquesta servicio y UI
- ✅ Maneja eventos de usuario
- ✅ Coordina flujo de datos
- ❌ NO hace llamadas directas a API
- ❌ NO manipula DOM directamente

---

## 📊 Estructura de Datos

### Datos desde la API (GET /api/chats)

```javascript
[
  {
    "id": "chat-123",
    "type": "individual" | "group",
    "createdAt": "2025-11-26T02:00:00Z",
    "updatedAt": "2025-11-26T02:15:00Z",
    "participants": [
      {
        "id": "user-456",
        "username": "eva_martinez",
        "email": "eva@enigma.com",
        "imageUrl": "https://..." // opcional
      },
      {
        "id": "user-789",
        "username": "daniel_torres",
        "email": "daniel@enigma.com"
      }
    ]
  }
]
```

### Datos Transformados (para ChatList.js)

```javascript
{
  id: "chat-123",              // ID único del chat
  name: "Eva Martinez",        // Nombre a mostrar
  isGroup: false,              // true si es grupo
  isActive: false,             // true si está seleccionado
  lastMessage: {               // OPCIONAL - solo si hay mensajes
    sender: "Eva",             // Nombre del remitente
    content: "Hola!",          // Contenido del mensaje
    timestamp: "2025-11-26T02:15:00Z"  // ISO 8601
  }
}
```

### Datos de Mensajes (GET /api/chats/:id/messages)

```javascript
[
  {
    "id": "msg-001",
    "chatId": "chat-123",
    "senderId": "user-456",
    "content": "Hola!",
    "timestamp": "2025-11-26T02:15:00Z",
    "read": true
  }
]
```

---

## 🔧 API de Funciones

### ChatList.js

#### `renderChatList(chats)`
Renderiza la lista completa de chats (limpia y recrea).

**Parámetros:**
- `chats` (Array): Array de objetos chat transformados

**Retorna:** `void`

**Ejemplo:**
```javascript
renderChatList([
  { id: '1', name: 'Eva', isGroup: false, isActive: true },
  { id: '2', name: 'Grupo Dev', isGroup: true, isActive: false }
]);
```

---

#### `createChatItem(chat)`
Crea un elemento DOM para un chat individual.

**Parámetros:**
- `chat` (Object): Objeto chat transformado

**Retorna:** `HTMLElement`

**Ejemplo:**
```javascript
const chatElement = createChatItem({
  id: '1',
  name: 'Eva Martinez',
  isGroup: false,
  isActive: false,
  lastMessage: {
    sender: 'Eva',
    content: 'Hola!',
    timestamp: '2025-11-26T02:15:00Z'
  }
});
```

---

#### `addChatToList(chat, prepend = true)`
Agrega un chat a la lista sin limpiar los existentes.

**Parámetros:**
- `chat` (Object): Objeto chat transformado
- `prepend` (Boolean): Si es `true`, agrega al inicio; si es `false`, al final

**Retorna:** `void`

**Ejemplo:**
```javascript
addChatToList({ id: '3', name: 'Nuevo Chat', isGroup: false }, true);
```

---

#### `updateChatInList(chatId, updatedData)`
Actualiza un chat existente en la lista.

**Parámetros:**
- `chatId` (String): ID del chat a actualizar
- `updatedData` (Object): Datos actualizados (se fusionan con el ID)

**Retorna:** `void`

**Ejemplo:**
```javascript
updateChatInList('1', {
  name: 'Eva Martinez',
  lastMessage: {
    sender: 'Eva',
    content: 'Nuevo mensaje',
    timestamp: new Date().toISOString()
  }
});
```

---

#### `removeChatFromList(chatId)`
Elimina un chat de la lista.

**Parámetros:**
- `chatId` (String): ID del chat a eliminar

**Retorna:** `void`

**Ejemplo:**
```javascript
removeChatFromList('1');
```

---

#### `setActiveChat(chatId)`
Marca un chat como activo y desmarca los demás.

**Parámetros:**
- `chatId` (String): ID del chat a marcar como activo

**Retorna:** `void`

**Ejemplo:**
```javascript
setActiveChat('2');
```

---

#### `clearChatList()`
Limpia toda la lista de chats.

**Parámetros:** Ninguno

**Retorna:** `void`

**Ejemplo:**
```javascript
clearChatList();
```

---

## 💡 Ejemplos de Uso

### Caso 1: Cargar Chats al Iniciar

```javascript
// chatsController.js
import { renderChatList } from '@/scripts/ui/components/ChatList.js';
import { loadChats } from '@/scripts/services/chatsService.js';

export const initChats = async () => {
  try {
    const chats = await loadChats();
    renderChatList(chats);
  } catch (error) {
    console.error('Error al cargar chats:', error);
  }
};
```

---

### Caso 2: Agregar Nuevo Chat

```javascript
// chatsController.js
import { addChatToList } from '@/scripts/ui/components/ChatList.js';
import { createChat } from '@/scripts/services/chatsService.js';

export const handleCreateChat = async (userId) => {
  try {
    const newChat = await createChat(userId);
    addChatToList(newChat, true); // Agregar al inicio
  } catch (error) {
    console.error('Error al crear chat:', error);
  }
};
```

---

### Caso 3: Actualizar con Nuevo Mensaje

```javascript
// chatsController.js
import { updateChatInList } from '@/scripts/ui/components/ChatList.js';

export const handleNewMessage = (chatId, message) => {
  updateChatInList(chatId, {
    lastMessage: {
      sender: message.sender,
      content: message.content,
      timestamp: message.timestamp
    }
  });
};
```

---

### Caso 4: Seleccionar Chat

```javascript
// chatsController.js
import { setActiveChat } from '@/scripts/ui/components/ChatList.js';
import { loadMessages } from '@/scripts/services/chatsService.js';

export const handleChatClick = async (chatId) => {
  setActiveChat(chatId);
  
  try {
    const messages = await loadMessages(chatId);
    // Renderizar mensajes en el panel de conversación
  } catch (error) {
    console.error('Error al cargar mensajes:', error);
  }
};
```

---

## 🎨 Renderizado Condicional

### Sin Último Mensaje
```html
<div class="chat-item" data-chat-id="1">
  <div class="chat-avatar">EM</div>
  <div class="chat-info">
    <div class="chat-name">Eva Martinez</div>
  </div>
</div>
```

### Con Último Mensaje (Individual)
```html
<div class="chat-item active" data-chat-id="1">
  <div class="chat-avatar">EM</div>
  <div class="chat-info">
    <div class="chat-name">Eva Martinez</div>
    <div class="chat-preview">Hola, ¿cómo estás?</div>
  </div>
  <div class="chat-time">14:30</div>
</div>
```

### Con Último Mensaje (Grupo)
```html
<div class="chat-item" data-chat-id="2">
  <div class="chat-avatar">GD</div>
  <div class="chat-info">
    <div class="chat-name">Grupo Dev</div>
    <div class="chat-preview">EVA: Revisé el código</div>
  </div>
  <div class="chat-time">15:45</div>
</div>
```

---

## 🔄 Flujo de Datos Completo

```
1. Usuario abre la app
   ↓
2. chatsController.initChats()
   ↓
3. chatsService.loadChats()
   ├─ Verifica autenticación
   ├─ Hace GET /api/chats
   ├─ Transforma datos API → formato UI
   └─ Retorna chats transformados
   ↓
4. ChatList.renderChatList(chats)
   ├─ Limpia contenedor
   ├─ Crea elementos DOM
   └─ Renderiza en pantalla
   ↓
5. Usuario ve la lista de chats
```

---

## ⚠️ Consideraciones Importantes

1. **Autenticación**: Todas las llamadas a la API requieren JWT
2. **Manejo de Errores**: El controlador debe manejar errores del servicio
3. **Estado**: El componente ChatList NO mantiene estado, solo renderiza
4. **Performance**: `renderChatList` limpia y recrea todo; usa `updateChatInList` para actualizaciones individuales
5. **Timestamps**: Siempre en formato ISO 8601 desde la API

---

## 📝 Notas de Implementación

- Las funciones auxiliares (`generateChatInitials`, `formatChatTime`, `formatChatPreview`) son internas y NO se exportan
- El selector `.chats-list` debe existir en el DOM antes de llamar a las funciones
- Los IDs de chat se almacenan en `data-chat-id` para fácil acceso
- La clase `active` se usa para marcar el chat seleccionado
