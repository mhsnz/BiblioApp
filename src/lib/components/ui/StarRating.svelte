<!-- src/lib/components/ui/StarRating.svelte -->
<script>
    // Reusable star rating component
    export let rating = 3;
    export let max = 5;
  </script>
  
  <div class="space-y-1">
    <label class="block text-sm font-medium">Rating</label>
    <div class="flex space-x-1">
      {#each Array(max) as _, i}
        <button
          type="button"
          on:click={() => (rating = i + 1)}
          class="text-2xl {rating > i ? 'text-yellow-400' : 'text-gray-300'}"
        >
          ★
        </button>
      {/each}
    </div>
  </div>