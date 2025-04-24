<script>
    // Reusable textarea component
    export let label = '';
    export let value = '';
    export let placeholder = '';
  </script>
  
  <div class="space-y-1">
    {#if label}
      <label for={label} class="block text-sm font-medium">{label}</label>
    {/if}
    <textarea
      id={label}
      {placeholder}
      bind:value
      class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
      rows="4"
    ></textarea>
  </div>