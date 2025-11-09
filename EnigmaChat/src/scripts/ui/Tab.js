const switchTab = () => {
  const tabs = document.querySelectorAll('.tab');
  const formContainers = document.querySelectorAll('.form-container');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remover clase active de todas las pestañas y formularios
      tabs.forEach(t => t.classList.remove('active'));
      formContainers.forEach(fc => fc.classList.remove('active'));
          
      // Activar la pestaña clickeada
      tab.classList.add('active');
          
      // Mostrar el formulario correspondiente
      const tabId = tab.getAttribute('data-tab');
      document.getElementById(`${tabId}-form`).classList.add('active');
    });
  });
}

export default switchTab;