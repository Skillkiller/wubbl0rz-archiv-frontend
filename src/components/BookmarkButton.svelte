<script>
    import { onMount } from 'svelte';

    export let type;
    export let id;

    let bookmarks = {};
    let bookmarked = false;

    onMount(() => {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
        if (bookmarks) {
            bookmarked = !!(bookmarks[type] && bookmarks[type].includes(id));
        }
    });

    function bookmark() {
        bookmarked = !bookmarked;

        let vods = bookmarks.vods || [];
        let clips = bookmarks.clips || [];

        if (type === 'vods') {
            if (!vods.includes(id)) {
                vods.push(id);
            } else {
                vods.splice(vods.indexOf(id), 1);
            }
        } else if (type === 'clips') {
            if (!clips.includes(id)) {
                clips.push(id);
            } else {
                clips.splice(clips.indexOf(id), 1);
            }
        }

        localStorage.setItem('bookmarks', JSON.stringify({ vods, clips }));
    }
</script>

<div class="button">
    <button class="btn btn-sm" type="button" id="bookmark-button" on:click={bookmark}>
        {bookmarked ? 'Nicht länger merken' : 'Merken'}
    </button>
</div>
