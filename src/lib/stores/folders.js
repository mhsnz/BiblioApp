import { writable } from 'svelte/store';
import { getFromStorage } from '$lib/utils/storage.js'; 

const initialFolders = getFromStorage('bookFolders') || [];

export const folders = writable(initialFolders);