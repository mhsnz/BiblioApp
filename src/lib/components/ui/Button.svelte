<!-- src/lib/components/ui/Button.svelte -->
<script>
  export let variant = 'primary';
  export let type = 'button';
</script>

<button
  {type}
  on:click
  class="border-2 {variant === 'primary' ? 'border-dark-green bg-dark-green text-white hover:bg-green-900 hover:border-green-900' : ''} 
         {variant === 'secondary' ? 'border-gray-500 bg-gray-500 text-white hover:bg-gray-600 hover:border-gray-600' : ''} 
         {variant === 'danger' ? 'border-red-500 bg-red-500 text-white hover:bg-red-600 hover:border-red-600' : ''} 
         px-4 py-2 rounded-lg transition-colors duration-200"
>
  <slot />
</button>