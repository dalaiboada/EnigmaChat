import typeEffect from '../components/UserInput.js';
import ScannerStatus from '../components/ScannerStatus.js';
import updateSystemTime from '../components/SystemTime.js';
import switchTab from '../components/Tab.js';
import generateParticles from '../components/Particles.js';	

document.addEventListener('DOMContentLoaded', () => {
  generateParticles();
  ScannerStatus();
  typeEffect();
  switchTab();
  
  // Actualizar hora cada segundo
  updateSystemTime();
  setInterval(updateSystemTime, 1000);
});