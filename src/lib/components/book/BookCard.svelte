<!-- src/lib/components/book/BookCard.svelte -->
<script>
    import { folders } from '$lib/stores/folders.js'; // تغییر مسیر به $lib
  
    export let book;
    export let folderId;
    export let onEdit;
    export let onDelete;
    export let onMove;
    export let onViewDetails;
  
    let showMoveOptions = false;
  
    $: otherFolders = $folders.filter(folder => folder.id !== folderId);
  
    $: getBookCountText = (count) => `${count} book${count === 1 ? '' : 's'}`;
  
    function handleMove(targetFolderId) {
      onMove(book, targetFolderId);
      showMoveOptions = false;
    }
  
    function closeMoveOptions() {
      showMoveOptions = false;
    }
  </script>
  
  <div class="border border-dark-green p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow">
    <div class="flex justify-between items-start">
      <div on:click={onViewDetails} on:keydown={(e) => e.key === 'Enter' && onViewDetails()} role="button" tabindex="0" class="cursor-pointer flex-1">
        <h3 class="text-lg font-medium text-dark-green">{book.title}</h3>
        <p class="text-gray-600 text-sm mt-1">Rating: {book.rating}/5</p>
      </div>
      <div class="flex space-x-2">
        <button
          on:click={() => onEdit(book)}
          class="p-2 text-blue-500 hover:bg-blue-100 hover:text-blue-700 rounded-full transition-all duration-200"
        >
          <svg class="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0l-1.414-1.414a2 2 0 010-2.828l9.414-9.414z"></path>
          </svg>
        </button>
        <button
          on:click={() => onDelete(book.id)}
          class="p-2 text-red-500 hover:bg-red-100 hover:text-red-700 rounded-full transition-all duration-200"
        >
          <svg class="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        {#if otherFolders.length > 0}
          <button
            on:click={() => (showMoveOptions = !showMoveOptions)}
            class="p-2 text-gray-500 hover:bg-gray-200 hover:text-gray-700 rounded-full transition-all duration-200"
          >
            <svg class="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 20" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5h-4l-5 5v4l5 5h4l5-5v-4l-5-5zm-2 7h-2m2 0v-2m0 2v2"></path>
            </svg>
          </button>
        {/if}
      </div>
    </div>
  
    {#if showMoveOptions && otherFolders.length > 0}
      <div class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50" on:click={closeMoveOptions}>
        <div class="w-11/12 max-w-md bg-gray-50 rounded-xl shadow-2xl p-6 relative" on:click|stopPropagation>
          <h3 class="text-xl font-semibold text-dark-green mb-4">Move to Folder</h3>
          <div class="grid grid-cols-1 gap-4 max-h-60 overflow-y-auto">
            {#each otherFolders as folder (folder.id)}
              <button
                on:click={() => handleMove(folder.id)}
                class="border border-dark-green p-4 rounded-lg bg-white shadow-md hover:bg-gray-100 hover:shadow-lg transition-all duration-200 text-left w-full"
              >
                <h4 class="text-lg font-medium text-dark-green">{folder.name}</h4>
                <p class="text-gray-600 text-sm mt-1">
                  {getBookCountText(folder.books.length)}
                </p>
              </button>
            {/each}
          </div>
        </div>
      </div>
    {/if}
  </div>