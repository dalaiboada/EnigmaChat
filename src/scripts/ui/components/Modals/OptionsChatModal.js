// Llamar elementos del DOM

const $chatOptionsModal = document.getElementById('chatOptionsModal');
const $chatOptionsBtn = document.getElementById('chatOptionsBtn');
const $isOpenToggle = document.getElementById('isOpenToggle');
const $messageInput = document.getElementById('message-input');
const $sendButton = document.querySelector('.send-button');


// initModal()
const initOptionsModal = () => {
	console.log('OptionsChatModal.js loaded');
	updateToggleState();
	updateInputState();  // Inicializar estado de inputs
	openModal();
	closeModal();
	// toggleState() debe ser llamado desde el controlador con un callback
}

function openModal() {
	$chatOptionsBtn.addEventListener('click', e => {
		e.stopPropagation();
		$chatOptionsModal.classList.toggle('active');
	});
}

// Al hacer click fuera del modal
function closeModal() {
	document.addEventListener('click', e => {
		if (!$chatOptionsModal.contains(e.target) && e.target !== $chatOptionsBtn) {
			$chatOptionsModal.classList.remove('active');
		}
	});
}

// Toggle del estado de chat abierto/cerrado
export function toggleState(isOpenChat, handleIsOpenToggle) {
	$isOpenToggle.addEventListener('click', e => {
		e.stopPropagation();
		isOpenChat = !isOpenChat;
		
		updateToggleState(isOpenChat); // Actualizar estado del toggle
		updateInputState(isOpenChat);  // Actualizar estado de inputs de mensaje
		
		// Ejecutar callback solo si existe, pasando el nuevo estado
		if (handleIsOpenToggle && typeof handleIsOpenToggle === 'function') 
			handleIsOpenToggle(isOpenChat);
	});
}

function updateToggleState(isOpenChat) {
	isOpenChat
		? $isOpenToggle.classList.add('active') 
		: $isOpenToggle.classList.remove('active');
}

// Habilitar/deshabilitar inputs según el estado del chat
function updateInputState(isOpenChat) {
	if (isOpenChat) {
		// Chat abierto: habilitar inputs
		$messageInput.classList.remove('close');
		$sendButton.classList.remove('close');
		$messageInput.disabled = false;
		$messageInput.placeholder = 'Escribe un mensaje...';
	} else {
		// Chat cerrado: deshabilitar inputs
		$messageInput.classList.add('close');
		$sendButton.classList.add('close');
		$messageInput.disabled = true;
		$messageInput.placeholder = 'Solo los administradores pueden enviar mensajes';
	}
}

export default initOptionsModal;
