import generateParticles from '@/scripts/ui/components/Particles.js';
import initModal from '@/scripts/ui/components/Modal.js';

const initMessages = () => {
  generateParticles();
  initModal();
};

initMessages();
