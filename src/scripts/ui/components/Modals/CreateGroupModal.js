// Lógica pura de UI y renderizado

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

// Funciones de renderizado
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

// Funciones de UI
const closeModal = () => {
  modalElements.modal.classList.remove('active');
};

const clearForm = () => {
  modalElements.groupNameInput.value = '';
  modalElements.searchInput.value = '';
  modalElements.usersList.innerHTML = '';
  modalElements.selectedUsersContainer.innerHTML = '';
};

const clearSelectedUsers = () => {
  selectedUsers = [];
  renderSelectedUsers(selectedUsers, handleRemoveUser);
};

const getFormData = () => ({
  groupName: modalElements.groupNameInput.value.trim(),
  groupDescription: modalElements.descriptionInput.value.trim(),
  permissions: Array.from(modalElements.permissionToggles)
    .map(toggle => toggle.classList.contains('active')),
  participants: Array.from(modalElements.selectedUsersContainer.children)
    .map(user => user.textContent.trim())
});

const initPermissionToggles = () => {
  modalElements.permissionToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
    });
  });
};

const handleUserSelect = (user) => {
  // Evitar duplicados antes de agregar
  if (!selectedUsers.some(u => u.name === user.name)) {
      selectedUsers.push(user);
  }
  // Actualiza la lista de seleccionados
  renderSelectedUsers(selectedUsers, handleRemoveUser);
};

const handleRemoveUser = (userToRemove) => {
    // Actualizar el estado
    selectedUsers = selectedUsers.filter(user => user.name !== userToRemove.name);
    
    // Actualiza la lista de seleccionados
    renderSelectedUsers(selectedUsers, handleRemoveUser);
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

  // TODO: Modifica, esto es solo para pruebas
  modalElements.confirmBtn.addEventListener('click', () => {
    const formData = getFormData();
    console.log(formData);
    closeModal();
    clearForm();
    clearSelectedUsers();
  });
  modalElements.searchInput.addEventListener('input', e => {
    console.log(e.target.value);
    renderUsersList(mockUsers, handleUserSelect);
  });

  clearForm();
  clearSelectedUsers();
  initPermissionToggles();

  const mockUsers = [ 
    { name: 'Lilith', status: 'En línea' },
    { name: 'Eva', status: 'En línea' },
    { name: 'Daniel', status: 'En línea' }
  ];
}

export default initCreateGroupModal;