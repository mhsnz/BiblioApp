<!-- src/lib/components/book/BookForm.svelte -->
<script>
  import { onMount, onDestroy } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import { folders } from '$lib/stores/folders.js';
  import { saveToStorage } from '$lib/utils/storage.js';

  export let folderId;
  export let book = null;

  const dispatch = createEventDispatcher();

  let title = '';
  let author = '';
  let rating = 0;
  let lastPageFeeling = '';
  let readingExperience = '';
  let images = [];
  let isClient = false;
  let formContainer = null;

  onMount(() => {
    isClient = true;
    if (book) {
      title = book.title || '';
      author = book.author || '';
      rating = book.rating || 0;
      lastPageFeeling = book.lastPageFeeling || '';
      readingExperience = book.readingExperience || '';
      images = book.images || [];
    }

    const handleClickOutside = (event) => {
      if (formContainer && !formContainer.contains(event.target)) {
        dispatch('toggleForm');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    document.addEventListener('click', handleClickOutside, true);
    
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });

  function handleImageChange(event) {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        images = [...images, e.target.result];
      };
      reader.readAsDataURL(file);
    });
  }

  function removeImage(index) {
    images = images.filter((_, i) => i !== index);
  }

  function handleStarClick(star) {
    rating = star;
  }

  function handleSubmit(event) {
    event.stopPropagation();
    if (!isClient) {
      console.warn('Cannot add/edit book during SSR');
      return;
    }
    try {
      if (title.trim() === '') {
        alert('Please enter a book title.');
        return;
      }
      const bookData = {
        id: book ? book.id : crypto.randomUUID(),
        title: title.trim(),
        author: author.trim() || 'Unknown Author',
        rating: parseInt(rating, 10) || 0,
        lastPageFeeling: lastPageFeeling.trim() || '',
        readingExperience: readingExperience.trim() || '',
        images: images.length > 0 ? images : []
      };
      folders.update(f => {
        const updatedFolders = f.map(folder => {
          if (folder.id === folderId) {
            let updatedBooks;
            if (book) {
              updatedBooks = folder.books.map(b =>
                b.id === book.id ? bookData : b
              );
            } else {
              updatedBooks = [...(folder.books || []), bookData];
            }
            return { ...folder, books: updatedBooks };
          }
          return folder;
        });
        return updatedFolders;
      });
      saveToStorage('bookFolders', $folders);
      title = '';
      author = '';
      rating = 0;
      lastPageFeeling = '';
      readingExperience = '';
      images = [];
      alert(book ? 'Book updated successfully!' : 'Book added successfully!');
      dispatch('toggleForm');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error adding/editing book:', err);
      alert('An error occurred while adding/editing the book. Please try again.');
    }
  }

  function handleCancel(event) {
    event.stopPropagation();
    dispatch('toggleForm');
    title = '';
    author = '';
    rating = 0;
    lastPageFeeling = '';
    readingExperience = '';
    images = [];
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
</script>

<div
bind:this={formContainer}
class="w-full max-w-lg sm:max-w-2xl bg-gray-50 rounded-xl shadow-2xl p-4 sm:p-6 relative mx-auto max-h-[80vh] overflow-y-auto"
on:click|stopPropagation
>
<button
  on:click={handleCancel}
  class="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 text-gray-500 hover:bg-gray-200 hover:text-gray-600 hover:scale-110 transition-all duration-200 rounded-full z-10"
>
  <svg class="w-6 h-6 sm:w-7 sm:h-7 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
  </svg>
</button>
<h3 class="text-lg sm:text-xl font-semibold text-dark-green mb-4 sm:mb-6">{book ? 'Edit Book' : 'Add New Book'}</h3>
<form on:submit|preventDefault={handleSubmit} class="space-y-4 sm:space-y-6">
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <label for="title" class="block text-dark-green font-medium text-sm sm:text-base">Book Title</label>
      <input
        id="title"
        type="text"
        bind:value={title}
        placeholder="Enter book title"
        class="border-2 border-gray-300 focus:border-dark-green rounded-lg p-2 sm:p-3 w-full transition-colors text-sm sm:text-base"
      />
    </div>
    <div>
      <label for="author" class="block text-dark-green font-medium text-sm sm:text-base">Author</label>
      <input
        id="author"
        type="text"
        bind:value={author}
        placeholder="Enter author name"
        class="border-2 border-gray-300 focus:border-dark-green rounded-lg p-2 sm:p-3 w-full transition-colors text-sm sm:text-base"
      />
    </div>
  </div>

  <div>
    <label class="block text-dark-green font-medium text-sm sm:text-base">Number of Stars (1-5)</label>
    <div class="flex space-x-1 sm:space-x-2 mt-2">
      {#each Array(5) as _, i}
        <button
          type="button"
          on:click={() => handleStarClick(i + 1)}
          class="focus:outline-none hover:scale-110 transition-all duration-200"
        >
          <svg
            class="w-6 h-6 sm:w-7 sm:h-7"
            fill={i < rating ? '#FFD700' : 'none'}
            stroke={i < rating ? '#FFD700' : 'currentColor'}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z"
            />
          </svg>
        </button>
      {/each}
    </div>
  </div>

  <div>
    <label for="lastPageFeeling" class="block text-dark-green font-medium text-sm sm:text-base">How did you feel after reading the last page of the book?</label>
    <textarea
      id="lastPageFeeling"
      bind:value={lastPageFeeling}
      placeholder="Describe your feelings..."
      class="border-2 border-gray-300 focus:border-dark-green rounded-lg p-2 sm:p-3 w-full transition-colors text-sm sm:text-base"
      rows="3"
    ></textarea>
  </div>

  <div>
    <label for="readingExperience" class="block text-dark-green font-medium text-sm sm:text-base">What was your experience reading this book?</label>
    <textarea
      id="readingExperience"
      bind:value={readingExperience}
      placeholder="Share your experience..."
      class="border-2 border-gray-300 focus:border-dark-green rounded-lg p-2 sm:p-3 w-full transition-colors text-sm sm:text-base"
      rows="3"
    ></textarea>
  </div>

  <div>
    <label for="image" class="block text-dark-green font-medium text-sm sm:text-base">Upload Book Images</label>
    <input
      id="image"
      type="file"
      accept="image/*"
      multiple
      on:change={handleImageChange}
      class="border-2 border-gray-300 rounded-lg p-2 w-full transition-colors text-sm sm:text-base"
    />
    {#if images.length > 0}
      <div class="mt-2 flex flex-wrap gap-2 sm:gap-3">
        {#each images as image, index}
          <div class="relative">
            <img src={image} alt="Book Preview" class="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg" />
            <button
              on:click={() => removeImage(index)}
              class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center hover:bg-red-600 hover:scale-110 transition-all duration-200"
            >
              <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <button
    type="submit"
    class="w-full bg-dark-green text-white py-2 px-4 rounded-lg hover:bg-green-600 hover:scale-105 hover:shadow-lg transition-all duration-200 text-sm sm:text-base"
  >
    {book ? 'Save Changes' : 'Add Book'}
  </button>
</form>
</div>