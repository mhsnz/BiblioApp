// src/lib/types.js
// Type definitions for data structures
export const Book = {
    id: String,
    title: String,
    rating: Number,
    days: String,
    lastPageFeeling: String,
    experience: String,
    summary: String,
    images: Array
  };
  
  export const Folder = {
    id: String,
    name: String,
    books: Array
  };