// Lógica pura de UI y renderizado

import { handleCreateGroup } from '@/scripts/controllers/chatsController.js';

// Elementos del DOM
export const modalElements = {
  modal: document.getElementById('createGroupModal'),
  closeBtn: document.getElementById('closeCreateGroupModal'),
  cancelBtn: document.getElementById('cancelCreateGroup'),
  confirmBtn: document.getElementById('confirmCreateGroup'),
  searchInput: document.getElementById('searchUsers'),
  groupNameInput: document.getElementById('groupName'),
  descriptionInput: document.getElementById('groupDescription'),
  usersList: document.getElementById('usersListGroup'),
  selectedUsersContainer: document.getElementById('selectedUsers'),
  permissionToggles: document.querySelectorAll('.permission-toggle')
};

let selectedUsers = [];

// -- FUNCIONES DE RENDERIZADO
const renderUserItem = (user, onUserSelect) => {
  const $userItem = document.createElement('div');

  $userItem.className = 'user-item';
  $userItem.innerHTML = `
    <div class="user-avatar">${user.name.charAt(0).toUpperCase()}</div>
    <div class="user-info">
      <div class="user-name">${user.name.toUpperCase()}</div>
      <div class="user-status">${user.status || 'En línea'}</div>
    </div>
  `;
  
  $userItem.addEventListener('click', () => onUserSelect(user));
  
  return $userItem;
};

const renderUsersList = (users, onUserSelect) => {
  const { usersList } = modalElements;
  if (!usersList) return;
  
  usersList.innerHTML = '';
  users.forEach(user => {
    usersList.appendChild(renderUserItem(user, onUserSelect));
  });
};

const renderSelectedUsers = (selectedUsers, onRemoveUser) => {
  const { selectedUsersContainer } = modalElements;
  selectedUsersContainer.innerHTML = '';
  
  selectedUsers.forEach(user => {
    const userElement = document.createElement('div');
    userElement.classList.add('selected-user');
    userElement.innerHTML = `
      <span>${user.name}</span>
      <i class="fas fa-times"></i>
    `;
    
    userElement.querySelector('i').addEventListener('click', (e) => {
      e.stopPropagation();
      onRemoveUser(user);
    });
    
    selectedUsersContainer.appendChild(userElement);
  });
};

const handleUserSelect = user => {
  // Evitar duplicados antes de agregar
  if (!selectedUsers.some(u => u.name === user.name)) {
      selectedUsers.push(user);
  }
  // Actualiza la lista de seleccionados
  renderSelectedUsers(selectedUsers, handleRemoveUser);
};

const handleRemoveUser = userToRemove => {
    // Actualizar el estado
    selectedUsers = selectedUsers.filter(user => user.name !== userToRemove.name);
    
    // Actualiza la lista de seleccionados
    renderSelectedUsers(selectedUsers, handleRemoveUser);
};

// -- FUNCIONES DE UI
const closeModal = () => {
  modalElements.modal.classList.remove('active');
};

const clearForm = () => {
  modalElements.groupNameInput.value = '';
  modalElements.descriptionInput.value = '';
  modalElements.searchInput.value = '';
  modalElements.usersList.innerHTML = '';
  modalElements.selectedUsersContainer.innerHTML = '';
};

const clearSelectedUsers = () => {
  selectedUsers = [];
  renderSelectedUsers(selectedUsers, handleRemoveUser);
};

const getFormData = () => {
  // Obtener permisos activos (sus data-permission)
  const activePermissions = Array.from(modalElements.permissionToggles)
    .filter(toggle => toggle.classList.contains('active'))
    .map(toggle => toggle.dataset.permission);
  
  // Obtener nombres de participantes seleccionados
  const participants = selectedUsers.map(user => user.name.toLowerCase());
  
  return {
    name: modalElements.groupNameInput.value.trim(),
    description: modalElements.descriptionInput.value.trim(),
    permissions: activePermissions,
    participants: participants
  };
};

const initPermissionToggles = () => {
  modalElements.permissionToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
    });
  });
};

const handleConfirmCreateGroup = async () => {
  try {
    const formData = getFormData();
    
    // Validar datos
    if (!formData.name) {
      alert('Por favor, ingresa un nombre para el grupo');
      return;
    }
    
    if (formData.participants.length === 0) {
      alert('Por favor, selecciona al menos un participante');
      return;
    }
    
    console.log('📤 Creando grupo con datos:', formData);
    
    // Deshabilitar botón mientras se crea
    modalElements.confirmBtn.disabled = true;
    modalElements.confirmBtn.textContent = 'Creando...';
    
    // Crear grupo usando el controlador
    const newGroup = await handleCreateGroup(formData);
    
    console.log('✅ Grupo creado exitosamente:', newGroup);
    
    // Cerrar modal y limpiar formulario
    closeModal();
    clearForm();
    clearSelectedUsers();
    
    // Restaurar botón
    modalElements.confirmBtn.disabled = false;
    modalElements.confirmBtn.textContent = 'Crear grupo';
    
  } catch (error) {
    console.error('❌ Error al crear grupo:', error);
    alert(`Error al crear el grupo: ${error.message}`);
    
    // Restaurar botón
    modalElements.confirmBtn.disabled = false;
    modalElements.confirmBtn.textContent = 'Crear grupo';
  }
};

const initCreateGroupModal = () => {
  modalElements.closeBtn.addEventListener('click', closeModal);
  modalElements.cancelBtn.addEventListener('click', closeModal);
  modalElements.modal.addEventListener('click', e => {
    if (e.target === modalElements.modal) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  clearForm();
  clearSelectedUsers();
  initPermissionToggles();

  // Evento para crear grupo
  modalElements.confirmBtn.addEventListener('click', handleConfirmCreateGroup);
  
  // Mock de usuarios para desarrollo
  const mockUsers = [ 
    { name: 'Lilith', status: 'En línea' },
    { name: 'Eva', status: 'En línea' },
    { name: 'Daniel', status: 'En línea' }
  ];
  
  modalElements.searchInput.addEventListener('input', e => {
    console.log(e.target.value);
    renderUsersList(mockUsers, handleUserSelect);
  });
}

export default initCreateGroupModal;