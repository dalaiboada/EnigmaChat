import typeEffect from './ui/UserInput.js';
import ScannerStatus from './ui/ScannerStatus.js';
import updateSystemTime from './ui/SystemTime.js';
import switchTab from './ui/Tab.js';
import generateParticles from './ui/Particles.js';	

document.addEventListener('DOMContentLoaded', () => {
  generateParticles();
  ScannerStatus();
  typeEffect();
  switchTab();
  
  // Actualizar hora cada segundo
  updateSystemTime();
  setInterval(updateSystemTime, 1000);
});