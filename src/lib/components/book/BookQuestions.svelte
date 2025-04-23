<!-- src/lib/components/book/BookQuestions.svelte -->
<script>
    // Component for book-related questions
    export let days = '';
    export let lastPageFeeling = '';
    export let experience = '';
  </script>
  
  <div class="space-y-4">
    <div>
      <label for="days" class="block text-sm font-medium">Days to Finish</label>
      <input
        id="days"
        bind:value={days}
        type="number"
        class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        placeholder="Enter number of days"
      />
    </div>
    <div>
      <label for="lastPageFeeling" class="block text-sm font-medium">Feeling After Last Page</label>
      <textarea
        id="lastPageFeeling"
        bind:value={lastPageFeeling}
        class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        placeholder="How did you feel?"
        rows="4"
      ></textarea>
    </div>
    <div>
      <label for="experience" class="block text-sm font-medium">Reading Experience</label>
      <textarea
        id="experience"
        bind:value={experience}
        class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        placeholder="Describe your experience"
        rows="4"
      ></textarea>
    </div>
  </div>