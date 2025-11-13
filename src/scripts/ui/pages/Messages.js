import generateParticles from '@/scripts/ui/components/Particles.js';
import initModal from '@/scripts/ui/components/Modal.js';

const usernameInfo = document.getElementById('username-info');

const initMessages = () => {
  generateParticles();
  initModal();

  usernameInfo.textContent = JSON.parse(localStorage.getItem('user')).username;
};

initMessages();
