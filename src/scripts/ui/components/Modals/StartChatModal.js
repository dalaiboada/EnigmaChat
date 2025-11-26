const $startChatModal = document.getElementById('startChatModal');
const $closeStartChatModal = document.getElementById('closeStartChatModal');

const initStartChatModal = () => {
	closeModal();
}

function closeModal(){
	// Al presionar escape
	document.addEventListener('keydown', e => {
		if (e.key === 'Escape') $startChatModal.classList.remove('active');
  });

	// Al clickear fuera del modal
	$startChatModal.addEventListener('click', e => {
		if (e.target === $startChatModal) $startChatModal.classList.remove('active');
	});

	// Al clickear la X
	$closeStartChatModal.addEventListener('click', e => {
		$startChatModal.classList.remove('active');
	});
}

export default initStartChatModal;