const $campoUsuario = document.getElementById('usuario');
const texto = 'Agente_047';


const typeEffect = () => {
  let i = 0;
  
  const type = () => {
    if (i < texto.length) {
      $campoUsuario.value += texto.charAt(i);
      i++;
      setTimeout(type, 100);
    }
  }
  
  // Iniciar después de un breve retraso
  setTimeout(type, 2000);
}

export default typeEffect;