import { repo } from '../LocalStorage/repository.js'

export const authFetch = (url, options = {}) => {
    const token = repo.getToken();
    options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    if (repo.getAdminAccess()) {
        options.headers = {
            ...options.headers,
            'admin-id': repo.getUserId(),
        }
    }
    return fetch(url, options);
};