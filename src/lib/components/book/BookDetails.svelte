<script>
    import StarRating from '../ui/StarRating.svelte';
  
    export let book;
    export let onClose;
  
    let selectedImage = null;
  
    function openImage(image) {
      selectedImage = image;
    }
  
    function closeImage(event) {
      // Close only if clicking outside the image
      if (event.target.classList.contains('image-popup')) {
        selectedImage = null;
      }
    }
  </script>
  
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" on:click={onClose}>
    <div
      class="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full border border-dark-green max-h-[90vh] overflow-y-auto"
      on:click|stopPropagation
    >
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-semibold text-dark-green">{book.title}</h3>
        <button on:click={onClose} class="text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
  
      <div class="space-y-4">
        <div>
          <p class="text-dark-green font-medium">Rating:</p>
          <StarRating rating={book.rating} readonly={true} />
        </div>
        {#if book.days}
          <div>
            <p class="text-dark-green font-medium">Days to read:</p>
            <p class="text-dark-green">{book.days}</p>
          </div>
        {/if}
        {#if book.feeling}
          <div>
            <p class="text-dark-green font-medium">Feeling:</p>
            <p class="text-dark-green">{book.feeling}</p>
          </div>
        {/if}
        {#if book.experience}
          <div>
            <p class="text-dark-green font-medium">Experience:</p>
            <p class="text-dark-green">{book.experience}</p>
          </div>
        {/if}
        {#if book.summary}
          <div>
            <p class="text-dark-green font-medium">Summary:</p>
            <p class="text-dark-green">{book.summary}</p>
          </div>
        {/if}
        {#if book.images && book.images.length}
          <div>
            <p class="text-dark-green font-medium">Images:</p>
            <div class="flex flex-wrap gap-2">
              {#each book.images as image}
                <img
                  src={image}
                  alt="Book related"
                  class="w-24 h-24 object-cover rounded cursor-pointer"
                  on:click|stopPropagation={() => openImage(image)}
                />
              {/each}
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
  
  {#if selectedImage}
    <div
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 image-popup"
      on:click={closeImage}
    >
      <img
        src={selectedImage}
        alt="Full size"
        class="max-w-[90vw] max-h-[90vh] object-contain"
        on:click|stopPropagation
      />
    </div>
  {/if}