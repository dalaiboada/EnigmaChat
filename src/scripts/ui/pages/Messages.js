import generateParticles from '@/scripts/ui/components/Particles.js';
import initModal from '@/scripts/ui/components/Modal.js';
import updateSystemTime from '@/scripts/ui/components/SystemTime.js';

import initMiniModal from '@/scripts/ui/components/Modals/MiniModal.js';
import initStartChatModal from '@/scripts/ui/components/Modals/StartChatModal.js';
import initCreateGroupModal from '@/scripts/ui/components/Modals/CreateGroupModal.js';
import initOptionsModal from '@/scripts/ui/components/Modals/OptionsChatModal.js';

import { initChatsController } from '@/scripts/controllers/chatsController.js';

const usernameInfo = document.getElementById('username-info');

const initMessages = () => {
  generateParticles();
  initModal();
  initMiniModal();
  initStartChatModal();
  initCreateGroupModal();
  initOptionsModal();

  initChatsController();

  // Actualizar hora cada segundo
  updateSystemTime();
  setInterval(updateSystemTime, 1000);

  usernameInfo.textContent = JSON.parse(localStorage.getItem('user')).username;
};

initMessages();
