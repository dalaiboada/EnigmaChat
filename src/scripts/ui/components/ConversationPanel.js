// Funciones para renderizar mensajes
const $messagesContainer = document.getElementById('messagesContainer')

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

import CryptoJS from 'crypto-js';

// renderMessage
export const renderMessage = message =>  {
	const  { id, content, sender, timestamp, isOwn } = message;

    let decryptedContent = content;
    try {
        const bytes = CryptoJS.AES.decrypt(content, 'secret-key');
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        if (originalText) {
            decryptedContent = originalText;
        }
    } catch (e) {
        console.error('Error decrypting message:', e);
    }

	const $message = document.createElement('div');
	$message.className = `message ${ isOwn ? 'own' : 'other'  }`
	$message.dataset.messageId = id; //para después

    if (!isOwn && sender) {
        const $sender = document.createElement('div');
        $sender.className = 'message-user';
        $sender.style.marginBottom = '10px';
        $sender.textContent = sender.toUpperCase();
        $message.appendChild($sender);
    }

    const $text = document.createElement('div');
    $text.className = 'message-text';
    $text.textContent = decryptedContent;
    $message.appendChild($text);

    const $time = document.createElement('div');
    $time.className = 'message-time';
    $time.textContent = formatMessageTime(timestamp);
    $message.appendChild($time);

	return $message;
}

// renderAllMessages
export const renderAllMessages = (messages, clearContainer = true) => {
  // Limpiar contenedor si se especifica
  if (clearContainer) $messagesContainer.replaceChildren();
  
  // Agrupar mensajes por fecha para agregar separadores
  let lastDate = null;
  
  messages.forEach(message => {
    const messageDate = new Date(message.timestamp).toDateString();
    
    // Agregar separador de fecha si cambió el día
    if (messageDate !== lastDate) {
      const $separator = createDateSeparator(message.timestamp);
      $messagesContainer.appendChild($separator);
      lastDate = messageDate;
    }
    console.log('ALL', message)
    
    // Agregar mensaje
    const $messageElement = renderMessage(message);
    $messagesContainer.appendChild($messageElement);
  });
}

export const scrollToBottom = () => {
  if ($messagesContainer) $messagesContainer.scrollTop = $messagesContainer.scrollHeight;
};


/**
 * Agrega un mensaje individual al final del contenedor
 * @param {Object} message - Mensaje a agregar
 */
export const addMessage = message => {
  if (!$messagesContainer) {
    console.error('No se encontró el contenedor de mensajes');
    return;
  }
  
  const $messageElement = renderMessage(message);
  $messagesContainer.appendChild($messageElement);
  
  // Scroll al final
  scrollToBottom();
};

export const clearMessages = () => {
  if ($messagesContainer) {
    $messagesContainer.replaceChildren();
  }
};


/**
 * Crea un separador de fecha
 * @param {string|Date} timestamp - Timestamp para generar el separador
 * @returns {HTMLElement} Elemento DOM del separador
 */
export const createDateSeparator = timestamp => {
  const $separator = document.createElement('div');
  $separator.className = 'date-separator';
  $separator.textContent = formatDateSeparator(timestamp);
  
  return $separator;
};

/**
 * Formatea la fecha para el separador
 * @param {string|Date} timestamp - Timestamp del mensaje
 * @returns {string} Fecha formateada (ej: "SÁBADO")
 */
const formatDateSeparator = timestamp => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const days = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
  
  return days[date.getDay()];
};

const formatMessageTime = timestamp => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${hours}:${minutes}`;
};

