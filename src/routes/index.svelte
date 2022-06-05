<script>
    import { onMount, onDestroy } from 'svelte';
    import VodGrid from '@components/VodGrid.svelte';
    import ClipGrid from '@components/ClipGrid.svelte';
    import GridPlaceholder from '@components/GridPlaceholder.svelte';
    import subMonths from 'date-fns/subMonths/index.js';
    import { page } from '$app/stores';
    import { fetchApi } from '/src/functions';
    import { db } from '@stores/main';

    let statsDB;

    const interval = setInterval(async () => {
        db.set(await fetchApi('/stats/db/'));
    }, 60000);

    onMount(async () => {
        db.set(await fetchApi('/stats/db/'));

        db.subscribe((newStats) => {
            statsDB = newStats;
        });
    });

    onDestroy(() => {
        clearInterval(interval);
    });
</script>

<svelte:head>
    <meta property="og:title" content="Wubbl0rz Archiv" />
    <meta property="og:url" content={$page.url} />
    <meta property="og:updated_time" content="Wubbl0rz Archiv" />
    <meta name="twitter:title" content="Wubbl0rz Archiv" />
    <title>Wubbl0rz Archiv</title>
</svelte:head>

<main class="flex-shrink-0">
    <div class="container">
        {#if statsDB?.is_live}
            <div class="alert alert-success" role="alert">
                <strong>Max ist live!</strong> Hier gehts zum Stream:
                <a href="https://www.twitch.tv/wubbl0rz" class="alert-link">twitch.tv/wubbl0rz</a>
            </div>
        {/if}
        <h1 class="display-4 fw-bolder p-0 m-0 mb-4 align-self-center">
            <a href="/vods/all" class="text-decoration-none">Kürzliche Vods</a>
        </h1>
        {#await fetchApi('/vods/?page_size=12')}
            <GridPlaceholder count="12" />
        {:then vods}
            <VodGrid {vods} />
        {/await}
    </div>
    <div class="container">
        <h1 class="display-4 fw-bolder p-0 m-0 mb-4 align-self-center">
            <a href="/clips" class="text-decoration-none">Top Clips letzter Monat</a>
        </h1>
        {#await fetchApi(`/clips/?page_size=12&ordering=-view_count&date_from=${subMonths(Date.now(), 1).toISOString()}`)}
            <GridPlaceholder count="12" />
        {:then clips}
            <ClipGrid {clips} />
        {/await}
    </div>
</main>
