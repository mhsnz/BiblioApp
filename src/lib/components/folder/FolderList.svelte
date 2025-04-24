<script>
    import { onMount } from 'svelte';
    import { folders } from '../../stores/folders.js';
    import { goto } from '$app/navigation';
    import { saveToStorage } from '../../utils/storage.js';
  
    let error = null;
    let showRenamePopup = null;
    let renameValue = '';
  
    onMount(() => {
      console.log('FolderList mounted, folders store:', $folders);
      try {
        // No need for filteredFolders since we're not searching here
      } catch (err) {
        console.error('Error loading folders:', err);
        error = 'An error occurred while loading folders.';
      }
    });
  
    function handleFolderClick(folderId) {
      goto(`/folder/${folderId}`);
    }
  
    function handleRename(folder) {
      renameValue = folder.name;
      showRenamePopup = folder.id;
    }
  
    function submitRename(folderId) {
      if (renameValue.trim() === '') return;
      folders.update(f =>
        f.map(fld =>
          fld.id === folderId ? { ...fld, name: renameValue.trim() } : fld
        )
      );
      saveToStorage('bookFolders', $folders);
      showRenamePopup = null;
    }
  
    function handleDelete(folderId) {
      folders.update(f => f.filter(fld => fld.id !== folderId));
      saveToStorage('bookFolders', $folders);
    }
  </script>
  
  <div class="space-y-4">
    {#if error}
      <div class="text-dark-green">
        <p>{error}</p>
      </div>
    {:else if $folders.length > 0}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {#each $folders as folder (folder.id)}
          <div class="relative">
            <div
              on:click={() => handleFolderClick(folder.id)}
              on:keydown={(e) => e.key === 'Enter' && handleFolderClick(folder.id)}
              role="button"
              tabindex="0"
              class="border border-dark-green p-4 sm:p-6 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow text-left w-full cursor-pointer"
            >
              <div class="flex justify-between items-center">
                <h3 class="text-lg sm:text-xl font-medium text-dark-green">{folder.name}</h3>
                <div class="flex space-x-2">
                  <button
                    on:click|stopPropagation={() => handleRename(folder)}
                    class="text-gray-500 hover:text-dark-green transition-colors"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0l-1.414-1.414a2 2 0 010-2.828L15.172 4z"></path>
                    </svg>
                  </button>
                  <button
                    on:click|stopPropagation={() => handleDelete(folder.id)}
                    class="text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a2 2 0 00-2 2v1h8V5a2 2 0 00-2-2z"></path>
                    </svg>
                  </button>
                </div>
              </div>
              <p class="text-gray-600 text-sm sm:text-base mt-1">
                {folder.books.length} book{folder.books.length === 1 ? '' : 's'}
              </p>
            </div>
            {#if showRenamePopup === folder.id}
              <div class="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-50">
                <div class="w-11/12 max-w-md bg-gray-50 rounded-xl shadow-2xl p-6 relative">
                  <button
                    on:click={() => (showRenamePopup = null)}
                    class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                  <h3 class="text-xl font-semibold text-dark-green mb-4">Rename Folder</h3>
                  <input
                    type="text"
                    bind:value={renameValue}
                    placeholder="Enter new folder name"
                    class="border-2 border-gray-300 focus:border-dark-green rounded-lg p-3 w-full transition-colors mb-4"
                  />
                  <button
                    on:click={() => submitRename(folder.id)}
                    class="bg-dark-green text-white py-2 px-4 rounded-lg"
                  >
                    Save
                  </button>
                </div>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {:else}
    <div class="flex items-center justify-center h-[calc(100vh-12rem)]">
        <p class="text-dark-green text-center">
          No folders yet. Click the "+" icon to create one.
        </p>
    </div>
    {/if}
  </div>