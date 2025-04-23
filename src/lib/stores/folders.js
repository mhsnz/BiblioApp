// src/stores/folders.js
import { writable } from 'svelte/store';
import { getFromStorage } from '$lib/utils/storage.js'; // تغییر مسیر به $lib

const initialFolders = getFromStorage('bookFolders') || [];

export const folders = writable(initialFolders);