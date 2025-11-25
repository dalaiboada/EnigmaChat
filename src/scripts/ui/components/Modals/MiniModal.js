const $floatingButton = document.getElementById('floatingButton');
const $miniModalOverlay = document.getElementById('miniModalOverlay');
const $miniModalOptions = document.querySelectorAll('.mini-modal-option');

const $createGroupModal = document.getElementById('createGroupModal');
const $startChatModal = document.getElementById('startChatModal');

const initMiniModal = () => {
	openMiniModal();
	closeMiniModal()
	showSelectedModal();
}

function openMiniModal(){
	$floatingButton.addEventListener('click', e => {
		e.stopPropagation();
		$miniModalOverlay.classList.toggle('active');
	});
}

// Al hacer clic afuera
function closeMiniModal(){
	document.addEventListener('click', e => {
		if (!$miniModalOverlay.contains(e.target) && e.target !== $floatingButton) {
			$miniModalOverlay.classList.remove('active');
		}
	});
}

function showSelectedModal(){
	$miniModalOptions.forEach(option => {
		option.addEventListener('click', () => {
			$miniModalOverlay.classList.remove('active');
			
			const action = option.getAttribute('data-action');
			
			if (action === 'create-group') $createGroupModal.classList.add('active');
			if (action === 'start-chat') $startChatModal.classList.add('active');
		});
	});
}

export default initMiniModal;