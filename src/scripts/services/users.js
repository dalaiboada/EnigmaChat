import { authenticatedFetch } from '@/scripts/utils/services.js';

export const findSomeUsers = async (username) => {
  try {
    const users = await authenticatedFetch(`/users/some?username=${username}`);
    return users;
  } catch (error) {
    console.error('Error al buscar usuarios:', error);
    throw error;
  }
};


