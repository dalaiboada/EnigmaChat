//API calls
import { authenticatedFetch } from '@/scripts/utils/services.js';

// transformMessagesData
const transformMessagesData = (apiMessages, currentUserId) => {
  return apiMessages.map(msg => {
    const isOwn = msg.senderId === currentUserId;
    
    return {
      id: msg.id,
      content: msg.ciphertext,
      sender: msg.sender?.username || 'Usuario',
      timestamp: msg.sentAt,
      isOwn: isOwn,
    };
  });
};

const transformOneMessage = (msg) => {
  const user = JSON.parse(localStorage.getItem('user'));
  return {
    id: msg.id,
    content: msg.ciphertext,
    sender:  user.username,
    timestamp: msg.sentAt,
    isOwn: true,
  };
}

/*
[
{
	"id": "LLqN8XqG",
	"chatId": "m5why9xU",
	"senderId": "uW1v0btd",
	"ciphertext": "¡Hola! ¿Cómo estás?",
	"sentAt": "2025-11-25T00:01:35.812Z",
	"sender": {
		"username": "agente20",
		"imageUrl": null,
	}
}
]
*/
// loadMessages
export const loadMessages = async (chatId) => { 
	const data = await authenticatedFetch(`/chats/${chatId}/messages`, {
		method: 'GET'
	});

	// formatear data
  const user = JSON.parse(localStorage.getItem('user'));
  const transformedData = transformMessagesData(data, user.id);

	console.log(transformedData);

	return transformedData;
}

export const sendMessage = async (chatId, ciphertext) => { 
	const data = await authenticatedFetch(`/chats/${chatId}/messages`, {
		method: 'POST',
		body: JSON.stringify({ ciphertext })
	});

	const transformedData = transformOneMessage(data)

	return transformedData;
}

// TODO: [Revisar] Fue autocompletado
const updateChatState = async (chatId, isOpen) => { 
	const data = await authenticatedFetch(`/chats/${chatId}/messages`, {
		method: 'POST',
		body: JSON.stringify({ isOpen })
	});

	return data;
}


// TODO: [Eliminar] cuando se implemente la API 
export const updateChatStateMock = ( chatID, isOpen ) => {
	console.log(`DESDE SERVICIO: Chat [${chatID}]: ${isOpen ? 'Activado' : 'Desactivado'}`);
}

export const getStateChatMock = () => {
	return {
		isOpen: true
	}
}