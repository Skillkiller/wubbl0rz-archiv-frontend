<script>
    import { fetchApi } from '/src/functions';
    import VodGrid from '@components/VodGrid.svelte';
    import ClipGrid from '@components/ClipGrid.svelte';
    import GridPlaceholder from '@components/GridPlaceholder.svelte';
    import Alert from '@components/Alert.svelte';
    import SEO from '@components/SEO.svelte';
    import subMonths from 'date-fns/subMonths/index.js';

    let statsDB = {};
    let ogTags = {
        title: 'Wubbl0rz Archiv',
        description: 'Twitch VOD Archiv von m4xfps/wubbl0rz',
        imageurl: '/img/og.jpg',
        imagealt: 'Wubbl0rz Archiv OG Image'
    };
    let apiError = false;
</script>

<SEO bind:ogTags bind:statsDB />

<main class="flex-shrink-0">
    <div class="container">
        {#if statsDB?.is_live}
            <Alert
                bind:this={apiError}
                level="success"
                title="Max ist live!"
                subtitle="Hier gehts zum Stream: <a href='https://www.twitch.tv/wubbl0rz' class='alert-link'>twitch.tv/wubbl0rz</a>"
            />
        {/if}
        <h1
            class="display-4 fw-bolder p-0 m-0 mb-4 align-self-center"
            class:d-none={apiError ? true : false}
        >
            <a href="/vods/all" class="text-decoration-none">Kürzliche Vods</a>
        </h1>
        {#await fetchApi('/vods/?page_size=12')}
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
    <div class="container">
        <h1
            class="display-4 fw-bolder p-0 m-0 mb-4 align-self-center"
            class:d-none={apiError ? true : false}
        >
            <a href="/clips" class="text-decoration-none">Top Clips letzter Monat</a>
        </h1>
        {#await fetchApi(`/clips/?page_size=12&ordering=-view_count&date_from=${subMonths(Date.now(), 1).toISOString()}`)}
            <GridPlaceholder count="12" />
        {:then clips}
            <ClipGrid {clips} />
        {/await}
    </div>
</main>
