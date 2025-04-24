<script>
    export let images = [];
    let imageInput;
  
    function handleImageUpload(e) {
      const files = e.target.files;
      for (let file of files) {
        const reader = new FileReader();
        reader.onload = () => {
          images = [...images, reader.result];
          dispatchEvent(new CustomEvent('change', { detail: images }));
        };
        reader.readAsDataURL(file);
      }
    }
  
    function removeImage(index) {
      images = images.filter((_, i) => i !== index);
      dispatchEvent(new CustomEvent('change', { detail: images }));
    }
  
    function handleImageClick(image) {
      const imgWindow = window.open('');
      imgWindow.document.write(`
        <html>
          <body style="margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background: #1a1a1a;">
            <img src="${image}" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
          </body>
        </html>
      `);
    }
  </script>
  
  <div class="space-y-1">
    <label class="block text-sm font-medium text-dark-green">Library Images</label>
    <input
      type="file"
      accept="image/*"
      multiple
      bind:this={imageInput}
      on:change={handleImageUpload}
      class="w-full p-2 border border-dark-green rounded-lg text-dark-green focus:ring-2 focus:ring-dark-green"
    />
    <div class="grid grid-cols-2 gap-2 mt-2 sm:grid-cols-3">
      {#each images as image, index}
        <div class="relative">
          <img
            src={image}
            alt="Library"
            class="w-full h-24 object-cover rounded-lg cursor-pointer border border-dark-green"
            on:click={() => handleImageClick(image)}
          />
          <button
            type="button"
            on:click={() => removeImage(index)}
            class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
          >
            ×
          </button>
        </div>
      {/each}
    </div>
  </div>