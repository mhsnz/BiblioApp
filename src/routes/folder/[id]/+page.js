// src/routes/folder/[id]/+page.js
/** @type {import('./$types').PageLoad} */
export function load({ params }) {
  console.log('Load function called with params:', params);
  return {
    id: params.id
  };
}