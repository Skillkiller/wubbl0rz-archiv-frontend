import { readable } from 'svelte/store';
import { fetchApi } from '/src/functions';

const emotes = readable([], (set) => {
    fetchApi('/emotes/?page_size=500')
        .then((data) => set(data.results))
        .catch((err) => {
            console.error('Failed to fetch', err);
        });
    return () => {
        // silence is golden
    };
});

async function showEmotesInTitle(title, emotes, size = 20) {
    let newTitle = title;
    let emoteNames = [];
    let emoteLinks = [];

    Object.keys(emotes).map((key) => {
        emoteNames.push(emotes[key].name);
        emoteLinks.push(emotes[key].url);
    });

    for (let i = 0; i < emoteNames.length; i++) {
        let value = emoteNames[i];
        let imgHTML =
            '<img src="' +
            emoteLinks[i] +
            '" alt="' +
            value +
            '" loading="lazy" height="' +
            size +
            '" data-toggle="tooltip" title="' +
            value +
            '" />';

        let re = new RegExp(`\\b${value}\\b`, 'gi');
        newTitle = newTitle.replace(re, imgHTML);
    }

    return newTitle;
}

export { emotes, showEmotesInTitle };
