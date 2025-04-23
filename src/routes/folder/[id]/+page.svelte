<!-- src/routes/folder/[id]/+page.svelte -->
<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { folders } from '$lib/stores/folders.js';
  import { saveToStorage } from '$lib/utils/storage.js';
  import { goto } from '$app/navigation';
  import BookList from '$lib/components/book/BookList.svelte';

  export let data;
  let folderId = data.id;

  const dispatch = createEventDispatcher();

  let books = [];
  let error = null;
  let showBookForm = false;

  onMount(() => {
    try {
      const folder = $folders.find(f => f.id === folderId);
      if (folder) {
        books = folder.books || [];
      } else {
        error = 'Folder not found.';
      }
    } catch (err) {
      console.error('Error loading folder:', err);
      error = 'An error occurred while loading the folder.';
    }
  });

  function handleToggleForm() {
    showBookForm = false;
  }
</script>

<div class="min-h-screen bg-gray-100 p-4 sm:p-6">
  <div class="max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl sm:text-3xl font-bold text-dark-green">
        BiblioApp
      </h1>
      <button
        on:click={() => (showBookForm = true)}
        class="bg-dark-green text-white py-2 px-4 sm:px-6 rounded-lg hover:bg-green-600 hover:scale-105 hover:shadow-lg transition-all duration-200 text-sm sm:text-base"
      >
        {showBookForm ? 'Cancel' : 'Add Book'}
      </button>
    </div>

    <BookList {folderId} {showBookForm} on:closeForm={handleToggleForm} />
  </div>
</div>