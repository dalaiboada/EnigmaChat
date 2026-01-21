// Lógica pura de UI y renderizado

import { handleCreateGroup } from '@/scripts/controllers/chatsController.js';
import { findSomeUsers } from '@/scripts/services/users.js';

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
  
  const $avatar = document.createElement('div');
  $avatar.className = 'user-avatar';
  $avatar.textContent = user.username.charAt(0).toUpperCase();
  $userItem.appendChild($avatar);

  const $info = document.createElement('div');
  $info.className = 'user-info';
  $userItem.appendChild($info);

  const $name = document.createElement('div');
  $name.className = 'user-name';
  $name.textContent = user.username.toUpperCase();
  $info.appendChild($name);

  const $status = document.createElement('div');
  $status.className = 'user-status';
  $status.textContent = 'Invitar usuario';
  $info.appendChild($status);
  
  $userItem.addEventListener('click', () => onUserSelect(user));
  
  return $userItem;
};

const renderUsersList = (users, onUserSelect) => {
  const { usersList } = modalElements;
  if (!usersList) return;
  
  usersList.replaceChildren();
  users.forEach(user => {
    console.log(user)
    usersList.appendChild(renderUserItem(user, onUserSelect));
  });
};

const renderSelectedUsers = (selectedUsers, onRemoveUser) => {
  const { selectedUsersContainer } = modalElements;
  selectedUsersContainer.replaceChildren();
  
  selectedUsers.forEach(user => {
    const userElement = document.createElement('div');
    userElement.classList.add('selected-user');
    
    const $name = document.createElement('span');
    $name.textContent = user.username;
    userElement.appendChild($name);

    const $icon = document.createElement('i');
    $icon.className = 'fas fa-times';
    userElement.appendChild($icon);
    
    $icon.addEventListener('click', (e) => {
      e.stopPropagation();
      onRemoveUser(user);
    });
    
    selectedUsersContainer.appendChild(userElement);
  });
};

const handleUserSelect = user => {
  // Limpiar el input
  modalElements.searchInput.value = "";
  modalElements.searchInput.focus();
  // Evitar duplicados antes de agregar
  if (!selectedUsers.some(u => u.username === user.username)) {
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
  modalElements.usersList.replaceChildren();
  modalElements.selectedUsersContainer.replaceChildren();
};

const clearSelectedUsers = () => {
  selectedUsers = [];
  renderSelectedUsers(selectedUsers, handleRemoveUser);
};

const getFormData = () => {
  // Obtener permisos activos
  const activePermissions = Array.from(modalElements.permissionToggles)
    .map(toggle => toggle.classList.contains('active'));
  
  // Obtener nombres de participantes seleccionados
  const participants = selectedUsers.map(user => user.username.toLowerCase());
  const user = JSON.parse(localStorage.getItem("user"));
  participants.unshift(user.username);
  
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
    { id: 'Lilith', username: 'lilit', email: 'dalaililith@gmail.com', imageUrl: null },
    { id: 'Eva', username: 'eva', email: 'eva@gmail.com', imageUrl: null },
    { id: 'Daniel', username: 'daniel', email: 'daniel@gmail.com', imageUrl: null }
  ];
  
  modalElements.searchInput.addEventListener('input', async e => {
    console.log(e.target.value);
    if (e.target.value.length < 3) return;

    const users = await findSomeUsers(e.target.value);
    console.log(users);
    renderUsersList(users, handleUserSelect);
  });
}

export default initCreateGroupModal;
