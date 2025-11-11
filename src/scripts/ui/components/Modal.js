const $modalOverlay = document.getElementById('modalOverlay');
const $settingsBtn = document.getElementById('settings-btn');
const $closeModalBtn = document.getElementById('closeModal');

const $optionStatuses = document.querySelectorAll('.option-status');
const $optionItems = document.querySelectorAll('.option-item');

const closeModal = () => { $modalOverlay.classList.remove('active'); };
const openModal = () => { $modalOverlay.classList.add('active'); };

// Añadir o quitar la clase 'active'
const toggleOptionState = (status, item) => {
  status.classList.toggle('active');
  item.classList.toggle('active');
};

// Modal
const attachModalListeners = () => {
  $settingsBtn.addEventListener('click', openModal);
  $closeModalBtn.addEventListener('click', closeModal);

  // Cerrar cuando se clickee fuera del modal
  $modalOverlay.addEventListener('click', e => {
    if (e.target === $modalOverlay) closeModal();
  });

  // Cerrar con la tecla Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && $modalOverlay.classList.contains('active')) closeModal();
  });
};

// Opciones
const attachOptionListeners = () => {
  // Acivar y desactivar al presionar el indicador
  $optionStatuses.forEach((status, index) => {
    status.addEventListener('click', e => {
      e.stopPropagation();
      toggleOptionState(status, $optionItems[index]);
    });
  });

  // Acivar y desactivar al presionar el item
  $optionItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      toggleOptionState($optionStatuses[index], item);
    });
  });
};

const initModal = () => {
  attachModalListeners();
  attachOptionListeners();
};

export default initModal;