<script>
    import { fetchApi } from '/src/functions';
    import VodGrid from '@components/VodGrid.svelte';
    import ClipGrid from '@components/ClipGrid.svelte';
    import GridPlaceholder from '@components/GridPlaceholder.svelte';
    import Alert from '@components/Alert.svelte';
    import SEO from '@components/SEO.svelte';

    let statsDB = {};
    let ogTags = {
        title: 'Gemerkte Vods und Clips',
        description: 'Twitch VOD Archiv von m4xfps/wubbl0rz',
        imageurl: '/img/og.jpg',
        imagealt: 'Wubbl0rz Archiv OG Image'
    };
    let apiError = false;

    const bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    const vods = bookmarks.vods.join(',');
    const clips = bookmarks.clips.join(',');
</script>

<SEO bind:ogTags bind:statsDB />

<main class="flex-shrink-0">
    {#if vods.length > 0}
        <div class="container">
            <h1
                class="display-4 fw-bolder p-0 m-0 mb-4 align-self-center"
                class:d-none={apiError ? true : false}
            >
                <p>Gemerkte Vods</p>
            </h1>
            {#await fetchApi(`/vods/?uuids=${vods}`)}
                <GridPlaceholder count="12" />
            {:then vods}
                <VodGrid {vods} />
            {:catch}
                <Alert
                    bind:this={apiError}
                    level="danger"
                    title="Api nicht erreichbar"
                    subtitle="Status hier prüfen: <a href='https://status.wubbl0rz.tv/status/wubbl0rz' target='_blank' class='alert-link'>status.wubbl0rz.tv</a>"
                />
            {/await}
        </div>
    {/if}
    {#if clips.length > 0}
        <div class="container">
            <h1
                class="display-4 fw-bolder p-0 m-0 mb-4 align-self-center"
                class:d-none={apiError ? true : false}
            >
                <p>Gemerkte Clips</p>
            </h1>
            {#await fetchApi(`/clips/?uuids=${clips}`)}
                <GridPlaceholder count="12" />
            {:then clips}
                <ClipGrid {clips} />
            {/await}
        </div>
    {/if}
</main>
