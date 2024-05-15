import { repo } from '../LocalStorage/repository.js'

export const authFetch = (url, options = {}) => {
    const token = repo.getToken();
    options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
    return fetch(url, options);
};