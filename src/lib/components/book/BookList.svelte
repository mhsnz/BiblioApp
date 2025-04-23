<!-- src/lib/components/book/BookList.svelte -->
<script>
    import { onMount, createEventDispatcher } from 'svelte';
    import { folders } from '$lib/stores/folders.js';
    import { goto } from '$app/navigation';
    import { saveToStorage } from '$lib/utils/storage.js';
    import BookCard from './BookCard.svelte';
    import BookForm from './BookForm.svelte';
  
    export let folderId;
    export let showBookForm = false;
  
    const dispatch = createEventDispatcher();
  
    let books = [];
    let error = null;
    let showBookDetails = null;
    let bookToEdit = null;
  
    onMount(() => {
      try {
        const folder = $folders.find(f => f.id === folderId);
        if (folder) {
          books = folder.books || [];
        } else {
          error = 'Folder not found.';
        }
      } catch (err) {
        console.error('Error loading books:', err);
        error = 'An error occurred while loading books.';
      }
    });
  
    $: {
      const folder = $folders.find(f => f.id === folderId);
      books = folder ? folder.books || [] : [];
    }
  
    function handleEdit(book) {
      bookToEdit = book;
      showBookForm = true;
    }
  
    function handleDelete(bookId) {
      folders.update(f =>
        f.map(folder =>
          folder.id === folderId
            ? { ...folder, books: folder.books.filter(book => book.id !== bookId) }
            : folder
        )
      );
      saveToStorage('bookFolders', $folders);
    }
  
    function handleMove(book, targetFolderId) {
      folders.update(f => {
        let updatedFolders = f.map(folder => {
          if (folder.id === folderId) {
            return {
              ...folder,
              books: folder.books.filter(b => b.id !== book.id)
            };
          }
          return folder;
        });
  
        updatedFolders = updatedFolders.map(folder => {
          if (folder.id === targetFolderId) {
            return {
              ...folder,
              books: [...folder.books, book]
            };
          }
          return folder;
        });
  
        return updatedFolders;
      });
      saveToStorage('bookFolders', $folders);
    }
  
    function handleViewDetails(book) {
      showBookDetails = book;
    }
  
    function handleCloseDetails() {
      showBookDetails = null;
    }
  
    function handleToggleForm() {
      showBookForm = false;
      bookToEdit = null;
      dispatch('closeForm');
    }
  </script>
  
  <div class="space-y-4">
    {#if showBookForm}
      <div class="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-50">
        <BookForm 
          {folderId} 
          book={bookToEdit} 
          on:toggleForm={handleToggleForm} 
        />
      </div>
    {/if}
  
    {#if error}
      <div class="text-dark-green">
        <p>{error}</p>
      </div>
    {:else if books.length > 0}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {#each books as book (book.id)}
          <BookCard
            {book}
            {folderId}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onMove={handleMove}
            onViewDetails={() => handleViewDetails(book)}
          />
        {/each}
      </div>
    {:else}
      <p class="text-dark-green">
        No books yet. Click the "Add Book" button to add one.
      </p>
    {/if}
  
    {#if showBookDetails}
      <div class="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-50">
        <div class="w-full max-w-lg sm:max-w-xl bg-gray-50 rounded-xl shadow-2xl p-4 sm:p-6 relative mx-auto">
          <button
            on:click={handleCloseDetails}
            class="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 text-gray-500 hover:bg-gray-200 hover:text-gray-700 rounded-full transition-all duration-200"
          >
            <svg class="w-6 h-6 sm:w-7 sm:h-7 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          <h3 class="text-lg sm:text-xl font-semibold text-dark-green mb-4 sm:mb-6">{showBookDetails.title}</h3>
          <div class="space-y-2 sm:space-y-3">
            <p class="text-gray-600 text-sm sm:text-base"><strong>Author:</strong> {showBookDetails.author}</p>
            <p class="text-gray-600 text-sm sm:text-base"><strong>Rating:</strong> {showBookDetails.rating}/5</p>
            <p class="text-gray-600 text-sm sm:text-base"><strong>Feeling after the last page:</strong> {showBookDetails.lastPageFeeling || 'Not specified.'}</p>
            <p class="text-gray-600 text-sm sm:text-base"><strong>Reading experience:</strong> {showBookDetails.readingExperience || 'Not specified.'}</p>
            {#if showBookDetails.images && showBookDetails.images.length > 0}
              <div>
                <p class="text-gray-600 text-sm sm:text-base mb-2"><strong>Images:</strong></p>
                <div class="flex flex-wrap gap-2 sm:gap-3">
                  {#each showBookDetails.images as image}
                    <img src={image} alt="Book Image" class="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg" />
                  {/each}
                </div>
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/if}
  </div>