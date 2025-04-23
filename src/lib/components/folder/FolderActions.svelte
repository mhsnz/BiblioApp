<!-- src/lib/components/folder/FolderActions.svelte -->
<script>
    import { onMount } from 'svelte';
    import { folders } from '../../stores/folders.js';
  
    export let folder;
    export let updateFolderName;
  
    let isEditing = false;
    let editName = folder.name;
    let inputElement;
  
    function startEditing() {
      isEditing = true;
      editName = folder.name;
    }
  
    function saveName() {
      updateFolderName(editName);
      isEditing = false;
    }
  
    function handleKeydown(event) {
      if (event.key === 'Enter') {
        saveName();
      } else if (event.key === 'Escape') {
        isEditing = false;
      }
    }
  
    function deleteFolder() {
      if (confirm('Delete this folder and all its books?')) {
        folders.update(f => f.filter(fld => fld.id !== folder.id));
      }
    }
  
    onMount(() => {
      if (isEditing && inputElement) {
        inputElement.focus();
        inputElement.select();
      }
    });
  
    $: if (isEditing && inputElement) {
      inputElement.focus();
      inputElement.select();
    }
  </script>
  
  <div class="flex space-x-2">
    {#if isEditing}
      <input
        type="text"
        bind:value={editName}
        bind:this={inputElement}
        on:blur={saveName}
        on:keydown={handleKeydown}
        class="border border-dark-green rounded-lg p-1 text-dark-green focus:ring-2 focus:ring-dark-green"
      />
    {:else}
      <h3 class="text-xl font-semibold text-dark-green">{folder.name}</h3>
      <button
        on:click|stopPropagation={startEditing}
        class="text-gold hover:text-yellow-500 transition-colors cursor-pointer"
        title="Rename Folder"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
        </svg>
      </button>
      <button
        on:click|stopPropagation={deleteFolder}
        class="text-red-500 hover:text-red-600 transition-colors cursor-pointer"
        title="Delete Folder"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
        </svg>
      </button>
    {/if}
  </div>