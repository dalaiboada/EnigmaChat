const $statusElement = document.getElementById('scanner-status');
const $progressBar = document.getElementById('scanner-progress');
const $fingerprintContainer = document.getElementById('fingerprint-container');

const estados = [
  "ACTIVANDO VERIFICACIÓN",
  "ANALIZANDO SISTEMAS...",
  "VERIFICANDO IDENTIDAD...",
  "ACCESO CONCEDIDO"
];
  
let estadoActual = 0;
let progreso = 0;

const ScannerStatus = () => {
  let estadoActual = 0;
  let progreso = 0;
  
  const intervalo = setInterval(() => {
    $statusElement.textContent = estados[estadoActual];
    
    progreso += 25;
    $progressBar.style.width = `${progreso}%`;
    
    // Activar animación de la huella en ciertos estados
    if (estadoActual >= 1 && estadoActual <= 3) {
      $fingerprintContainer.classList.add('active');
    } else {
      $fingerprintContainer.classList.remove('active');
    }
    
    estadoActual++;
    
    if (estadoActual >= estados.length) {
      clearInterval(intervalo);
      // Reiniciar después de un tiempo
      setTimeout(() => {
        $statusElement.textContent = estados[0];
        $progressBar.style.width = '0%';
        $fingerprintContainer.classList.remove('active');
        ScannerStatus();
      }, 3000);
    }
  }, 1500);
}

export default ScannerStatus;

