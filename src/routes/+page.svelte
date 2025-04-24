<script>
    import { onMount } from 'svelte';
    import { folders } from '../lib/stores/folders.js';
    import FolderList from '../lib/components/folder/FolderList.svelte';
  
    let error = null;
    let isClient = false;
  
    onMount(() => {
      isClient = true;
      console.log('Root page mounted, folders store:', $folders);
    });
  </script>
  
  {#if error}
    <div class="text-dark-green px-4 sm:px-6 lg:px-8 py-6">
      <p>{error}</p>
    </div>
  {:else}
    <div class="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <FolderList />
    </div>
  {/if}