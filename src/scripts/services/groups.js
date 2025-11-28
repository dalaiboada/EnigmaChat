import { authenticatedFetch } from '@/scripts/utils/services.js';

export const getGroupMembers = async (chatId) => { 
    const data = await authenticatedFetch(`/groups/${chatId}/members`, {
        method: 'GET',
    });

    return data;
}
