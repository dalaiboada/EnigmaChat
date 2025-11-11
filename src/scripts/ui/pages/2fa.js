import generateParticles from '@/scripts/ui/components/Particles.js';
import { initQRInput } from '@/scripts/ui/components/QRInput.js'; 

const init2FA = () => {
  initQRInput();
  generateParticles();
};

init2FA();