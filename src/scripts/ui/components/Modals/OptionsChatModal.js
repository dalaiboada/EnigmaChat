// Llamar elementos del DOM

const $chatOptionsModal = document.getElementById('chatOptionsModal');
const $chatOptionsBtn = document.getElementById('chatOptionsBtn');
const $isOpenToggle = document.getElementById('isOpenToggle');

let isOpenChat = false;

// initModal()
const initOptionsModal = () => {
	console.log('OptionsChatModal.js loaded');
	openModal()
	closeModal()
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

// TODO: toggleModal()
function toggleModal() {
	$chatOptionsModal.classList.toggle('active');
}

export default initOptionsModal;
