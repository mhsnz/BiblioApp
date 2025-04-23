<!-- src/lib/components/ui/SearchBar.svelte -->
<script>
    export let searchTerm = '';
    export let placeholder = 'Search...';
    export let className = '';
  </script>
  
  <input
    type="text"
    bind:value={searchTerm}
    placeholder={placeholder}
    class="{className} border-2 border-gray-300 focus:border-dark-green rounded-lg p-3 w-full transition-colors outline-none"
  />