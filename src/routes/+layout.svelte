<!-- src/routes/+layout.svelte -->
<script>
	import { onMount } from 'svelte';
	import '../app.css';
	import { folders } from '../lib/stores/folders.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { saveToStorage } from '../lib/utils/storage.js';
  
	let showFolderForm = false;
	let showSearchPopup = false;
	let newFolderName = '';
	let localSearchTerm = '';
	let filteredFolders = [];
	let filteredBooks = [];
	let isClient = false;
  
	onMount(() => {
	  isClient = true;
	});
  
	$: isBookListPage = $page.url.pathname.startsWith('/folder/');
  
	$: currentFolderId = isBookListPage ? $page.url.pathname.split('/')[2] : null;
  
	$: {
	  if (localSearchTerm.trim() === '') {
		filteredFolders = [];
	  } else {
		filteredFolders = $folders
		  .filter(folder => folder.name.toLowerCase().includes(localSearchTerm.toLowerCase()))
		  .sort((a, b) => {
			const aStartsWith = a.name.toLowerCase().startsWith(localSearchTerm.toLowerCase());
			const bStartsWith = b.name.toLowerCase().startsWith(localSearchTerm.toLowerCase());
			if (aStartsWith && !bStartsWith) return -1;
			if (!aStartsWith && bStartsWith) return 1;
			return a.name.localeCompare(b.name);
		  });
	  }
	}
  
	$: {
	  if (localSearchTerm.trim() === '' || !isBookListPage) {
		filteredBooks = [];
	  } else {
		const currentFolder = $folders.find(f => f.id === currentFolderId);
		if (currentFolder) {
		  filteredBooks = (currentFolder.books || [])
			.filter(book => book.title.toLowerCase().includes(localSearchTerm.toLowerCase()))
			.sort((a, b) => {
			  const aStartsWith = a.title.toLowerCase().startsWith(localSearchTerm.toLowerCase());
			  const bStartsWith = b.title.toLowerCase().startsWith(localSearchTerm.toLowerCase());
			  if (aStartsWith && !bStartsWith) return -1;
			  if (!aStartsWith && bStartsWith) return 1;
			  return a.title.localeCompare(b.title);
			});
		} else {
		  filteredBooks = [];
		}
	  }
	}
  
	function handleAddFolder() {
	  if (!isClient) {
		console.warn('Cannot add folder during SSR');
		return;
	  }
	  try {
		if (newFolderName.trim() === '') return;
		const newFolder = {
		  id: crypto.randomUUID(),
		  name: newFolderName.trim(),
		  books: []
		};
		folders.update(f => [...f, newFolder]);
		saveToStorage('bookFolders', $folders);
		showFolderForm = false;
		newFolderName = '';
	  } catch (err) {
		console.error('Error adding folder:', err);
	  }
	}
  
	function handleCancelFolder() {
	  showFolderForm = false;
	  newFolderName = '';
	}
  
	function handleBack() {
	  goto('/');
	}
  
	function handleFolderClick(folderId) {
	  showSearchPopup = false;
	  goto(`/folder/${folderId}`);
	}
  
	function handleBookClick(bookId) {
	  showSearchPopup = false;
	}
  
	function handleAddClick() {
	  showFolderForm = true;
	}
  </script>
  
  <div class="min-h-screen bg-gray-light">
	<header class="bg-dark-green text-white py-4 px-6 sm:px-8 flex justify-between items-center">
	  <div class="flex items-center space-x-4">
		{#if isBookListPage}
		  <button
			on:click={handleBack}
			class="p-2 text-gray-300 hover:bg-green-700 hover:text-white rounded-full transition-all duration-200"
		  >
			<svg class="w-6 h-6 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
			</svg>
		  </button>
		{/if}
		<a href="/" class="text-2xl sm:text-3xl font-bold text-center flex-1" style="font-family: 'Brush Script MT', cursive; font-style: italic;">
		  My Reading Hub
		</a>
	  </div>
	  <div class="flex items-center space-x-4">
		<button
		  on:click={() => (showSearchPopup = true)}
		  class="p-2 text-gray-300 hover:bg-green-700 hover:text-white rounded-full transition-all duration-200"
		>
		  <svg class="w-6 h-6 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
		  </svg>
		</button>
		{#if !isBookListPage}
		  <button
			on:click={handleAddClick}
			class="p-2 text-gray-300 hover:bg-green-700 hover:text-white rounded-full transition-all duration-200"
		  >
			<svg class="w-6 h-6 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h6l3 3h9a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"></path>
			  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 11v4m2-2h-4"></path>
			</svg>
		  </button>
		{/if}
	  </div>
	</header>
  
	{#if showSearchPopup}
	  <div class="fixed inset-0 backdrop-blur-lg flex flex-col items-center justify-center z-50">
		<div class="w-11/12 max-w-md bg-gray-50 rounded-xl shadow-2xl p-6 relative">
		  <button
			on:click={() => (showSearchPopup = false)}
			class="absolute top-4 right-4 p-2 text-gray-500 hover:bg-gray-200 hover:text-gray-700 rounded-full transition-all duration-200"
		  >
			<svg class="w-6 h-6 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
			</svg>
		  </button>
		  <h3 class="text-xl font-semibold text-dark-green mb-4">
			{isBookListPage ? 'Search Books' : 'Search Folders'}
		  </h3>
		  <div class="relative w-full mb-4">
			<input
			  type="text"
			  bind:value={localSearchTerm}
			  placeholder={isBookListPage ? 'Search books...' : 'Search folders...'}
			  class="border-2 border-gray-300 focus:border-dark-green rounded-lg p-3 w-full transition-colors"
			  autofocus
			/>
			<svg class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
			</svg>
		  </div>
		  {#if localSearchTerm.trim() === ''}
			<p class="text-dark-green">
			  {isBookListPage ? 'Type to search for books...' : 'Type to search for folders...'}
			</p>
		  {:else if isBookListPage}
			{#if filteredBooks.length}
			  <div class="grid grid-cols-1 gap-4 max-h-60 overflow-y-auto">
				{#each filteredBooks as book (book.id)}
				  <div
					on:click={() => handleBookClick(book.id)}
					on:keydown={(e) => e.key === 'Enter' && handleBookClick(book.id)}
					role="button"
					tabindex="0"
					class="border border-dark-green p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow text-left w-full cursor-pointer"
				  >
					<h3 class="text-lg font-medium text-dark-green">{book.title}</h3>
					<p class="text-gray-600 text-sm mt-1">Rating: {book.rating}/5</p>
				  </div>
				{/each}
			  </div>
			{:else}
			  <p class="text-dark-green">No books match your search.</p>
			{/if}
		  {:else if filteredFolders.length}
			<div class="grid grid-cols-1 gap-4 max-h-60 overflow-y-auto">
			  {#each filteredFolders as folder (folder.id)}
				<div
				  on:click={() => handleFolderClick(folder.id)}
				  on:keydown={(e) => e.key === 'Enter' && handleFolderClick(folder.id)}
				  role="button"
				  tabindex="0"
				  class="border border-dark-green p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow text-left w-full cursor-pointer"
				>
				  <h3 class="text-lg font-medium text-dark-green">{folder.name}</h3>
				  <p class="text-gray-600 text-sm mt-1">
					{folder.books.length} book{folder.books.length === 1 ? '' : 's'}
				  </p>
				</div>
			  {/each}
			</div>
		  {:else}
			<p class="text-dark-green">No folders match your search.</p>
		  {/if}
		</div>
	  </div>
	{/if}
  
	{#if showFolderForm}
	  <div class="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-50">
		<div class="w-11/12 max-w-md bg-gray-50 rounded-xl shadow-2xl p-6 relative">
		  <button
			on:click={handleCancelFolder}
			class="absolute top-4 right-4 p-2 text-gray-500 hover:bg-gray-200 hover:text-gray-700 rounded-full transition-all duration-200"
		  >
			<svg class="w-6 h-6 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
			</svg>
		  </button>
		  <h3 class="text-xl font-semibold text-dark-green mb-4">Add New Folder</h3>
		  <input
			type="text"
			bind:value={newFolderName}
			placeholder="Enter folder name"
			class="border-2 border-gray-300 focus:border-dark-green rounded-lg p-3 w-full transition-colors mb-4"
		  />
		  <button
			on:click={handleAddFolder}
			class="w-full bg-dark-green text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-all duration-200"
		  >
			Create Folder
		  </button>
		</div>
	  </div>
	{/if}
  
	<slot />
  </div>