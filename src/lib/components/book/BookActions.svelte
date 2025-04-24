<script>
    // Reusable actions for book (edit, delete, move)
    import Button from '../ui/Button.svelte';
    import Select from '../ui/Select.svelte';
    import { folders } from '../../stores/folders';
  
    export let book;
    export let folderId;
    export let onEdit;
    export let onDelete;
    export let onMove;
  
    $: folderOptions = $folders
      .filter(f => f.id !== folderId)
      .map(f => ({ value: f.id, label: f.name }));
  </script>
  
  <div class="flex flex-wrap gap-2">
    <Button variant="secondary" on:click={() => onEdit(book)}>Edit</Button>
    <Button variant="danger" on:click={() => onDelete(book.id)}>Delete</Button>
    {#if folderOptions.length}
      <Select
        value=""
        options={[{ value: '', label: 'Move to...' }, ...folderOptions]}
        on:change={e => onMove(book, e.target.value)}
      />
    {/if}
  </div>