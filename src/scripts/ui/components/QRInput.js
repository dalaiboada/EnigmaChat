// Si se ingresa un dígito, pasar al siguiente input
const handleAutoAdvance = (e, index, inputs) => {
  if (e.target.value.length === 1 && index < inputs.length - 1) {
    inputs[index + 1].focus();
  }
};

// Si se presiona backspace y el input está vacío, pasar al anterior
const handleBackspaceNavigation = (e, index, inputs) => {
  if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
    inputs[index - 1].focus();
  }
};

export const initQRInput = () => {
  const $codeInputs = document.querySelectorAll('.code-input');

  $codeInputs.forEach((input, index, list) => {
    input.addEventListener('input', (e) => handleAutoAdvance(e, index, list));
    input.addEventListener('keydown', (e) => handleBackspaceNavigation(e, index, list));
  });
};