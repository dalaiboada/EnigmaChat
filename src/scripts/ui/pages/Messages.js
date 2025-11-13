import generateParticles from '@/scripts/ui/components/Particles.js';
import initModal from '@/scripts/ui/components/Modal.js';
import updateSystemTime from '@/scripts/ui/components/SystemTime.js';

const usernameInfo = document.getElementById('username-info');

const initMessages = () => {
  generateParticles();
  initModal();

  // Actualizar hora cada segundo
  updateSystemTime();
  setInterval(updateSystemTime, 1000);

  usernameInfo.textContent = JSON.parse(localStorage.getItem('user')).username;
};

initMessages();
