<!-- src/lib/components/ui/Select.svelte -->
<script>
    // Reusable select component
    export let label = '';
    export let value = '';
    export let options = [];
  </script>
  
  <div class="space-y-1">
    {#if label}
      <label for={label} class="block text-sm font-medium">{label}</label>
    {/if}
    <select
      id={label}
      bind:value
      class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
    >
      {#each options as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
  </div>