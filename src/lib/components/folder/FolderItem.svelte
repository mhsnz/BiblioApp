<!-- src/lib/components/folder/FolderItem.svelte -->
<script>
    import { fade } from 'svelte/transition';
    import FolderActions from './FolderActions.svelte';
    import { goto } from '$app/navigation';
    import { folders } from '../../stores/folders.js';
  
    export let folder;
  
    function navigateToFolder() {
      console.log('Attempting to navigate to folder with ID:', folder.id);
      console.log('Current folders in store:', $folders);
      const targetFolder = $folders.find(f => f.id === folder.id);
      if (targetFolder) {
        console.log('Folder found, navigating to:', `/folder/${folder.id}`);
        goto(`/folder/${folder.id}`);
      } else {
        console.error('Folder not found in store for ID:', folder.id);
        alert('Folder not found. It may have been deleted.');
      }
    }
  
    function updateFolderName(newName) {
      if (newName.trim()) {
        folders.update(f =>
          f.map(fld => (fld.id === folder.id ? { ...fld, name: newName } : fld))
        );
      }
    }
  </script>
  
  <div
    class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-dark-green cursor-pointer"
    transition:fade={{ duration: 200 }}
    on:click={navigateToFolder}
  >
    <div class="flex flex-col md:flex-row md:space-x-2 md:items-center">
      <FolderActions {folder} {updateFolderName} />
    </div>
  </div>