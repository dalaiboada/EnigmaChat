import typeEffect from '@/scripts/ui/components/UserInput.js';
import ScannerStatus from '@/scripts/ui/components/ScannerStatus.js';
import updateSystemTime from '@/scripts/ui/components/SystemTime.js';
import switchTab from '@/scripts/ui/components/Tab.js';
import generateParticles from '@/scripts/ui/components/Particles.js';	

const initApp = () => {
  generateParticles();
  ScannerStatus();
  typeEffect();
  switchTab();
  
  // Actualizar hora cada segundo
  updateSystemTime();
  setInterval(updateSystemTime, 1000);
};

initApp();