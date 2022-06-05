import { writable } from 'svelte/store';
import { fetchApi } from '/src/functions';

export const clipFilter = writable({
    sort_by: 'date',
    direction: '-',
    date_from: null,
    date_to: null
});

export const theme = writable();
export const db = writable(await fetchApi('/stats/db/'));
if (typeof window !== 'undefined') [theme.set(localStorage.getItem('theme'))];
