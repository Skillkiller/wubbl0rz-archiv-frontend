<script>
    import { fetchApi } from '/src/functions';
    import VodGrid from '@components/VodGrid.svelte';
    import ClipGrid from '@components/ClipGrid.svelte';
    import GridPlaceholder from '@components/GridPlaceholder.svelte';
    import SEO from '@components/SEO.svelte';
    import { bookmarkStore } from '@stores/bookmarks';

    let statsDB = {};
    let ogTags = {
        title: 'Gemerkte Vods und Clips',
        description: 'Twitch VOD Archiv von m4xfps/wubbl0rz',
        imageurl: '/img/og.jpg',
        imagealt: 'Wubbl0rz Archiv OG Image'
    };
    let bookmarks;

    bookmarkStore.subscribe((bm) => {
        bookmarks = bm;
    });
</script>

<SEO bind:ogTags bind:statsDB />

<main class="flex-shrink-0">
    <div class="container">
        {#if bookmarks?.vods.length > 0}
            <h1 class="display-4 fw-bolder p-0 m-0 mb-4 align-self-center">
                <p>Gemerkte Vods</p>
            </h1>
            {#await fetchApi(`/vods/?uuids=${bookmarks.vods.join(',')}`)}
                <GridPlaceholder count="4" />
            {:then vods}
                <VodGrid {vods} />
            {/await}
        {/if}
        {#if bookmarks?.clips.length > 0}
            <h1 class="display-4 fw-bolder p-0 m-0 mb-4 align-self-center">
                <p>Gemerkte Clips</p>
            </h1>
            {#await fetchApi(`/clips/?uuids=${bookmarks.clips.join(',')}`)}
                <GridPlaceholder count="4" />
            {:then clips}
                <ClipGrid {clips} />
            {/await}
        {/if}
        {#if bookmarks?.vods.length === 0 && bookmarks?.clips.length === 0}
            <h1 class="display-4 fw-bolder p-0 m-0 mb-4 align-self-center">
                <p>Keine gemerkten Items</p>
            </h1>
            <GridPlaceholder count="3" />
        {/if}
    </div>
</main>
