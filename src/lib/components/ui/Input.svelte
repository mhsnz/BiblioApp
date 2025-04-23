<!-- src/lib/components/ui/Input.svelte -->
<script>
    // Reusable input component
    export let label = '';
    export let value = '';
    export let type = 'text';
    export let required = false;
    export let placeholder = '';
  </script>
  
  <div class="space-y-1">
    {#if label}
      <label for={label} class="block text-sm font-medium">{label}</label>
    {/if}
    <input
      id={label}
      {type}
      {required}
      {placeholder}
      bind:value
      class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
    />
  </div>