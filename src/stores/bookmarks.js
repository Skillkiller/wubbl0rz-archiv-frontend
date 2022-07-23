import { writable } from 'svelte/store';

export const bookmarkStore = writable({
    vods: [],
    clips: []
});

if (typeof window !== 'undefined' && localStorage.getItem('bookmarks'))
    [bookmarkStore.set(JSON.parse(localStorage.getItem('bookmarks')))];
