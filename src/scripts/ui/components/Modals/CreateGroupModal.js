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

export const closeModal = () => {
  modalElements.modal.classList.remove('active');
};

export const clearForm = () => {
  modalElements.groupNameInput.value = '';
  modalElements.searchInput.value = '';
  modalElements.usersList.innerHTML = '';
  modalElements.selectedUsersContainer.innerHTML = '';
};

// Helpers de UI
// TODO: Modificar para que envie un array con los participantes 
export const getFormData = () => ({
  groupName: modalElements.groupNameInput.value.trim(),
  description: modalElements.descriptionInput.value.trim(),
  permissions: Array.from(modalElements.permissionToggles)
    .map(toggle => toggle.classList.contains('active')),
  /* participants: Array.from(modalElements.selectedUsersContainer.children)
    .map(user => user.dataset.userId) */
});

export const initPermissionToggles = () => {
  modalElements.permissionToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
    });
  });
};

const initCreateGroupModal = () => {
  modalElements.closeBtn.addEventListener('click', closeModal);
  modalElements.cancelBtn.addEventListener('click', closeModal);
  modalElements.confirmBtn.addEventListener('click', showData); // TODO

  clearForm();
  initPermissionToggles();
}

export default initCreateGroupModal;