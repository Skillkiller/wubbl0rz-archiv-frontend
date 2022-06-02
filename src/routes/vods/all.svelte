<script>
    import VodGrid from '@components/VodGrid.svelte';
    import GridPlaceholder from '@components/GridPlaceholder.svelte';
    import Pagination from '@components/Pagination.svelte';
    import { page } from '$app/stores';
    import { fetchApi } from '/src/functions';

    let vods;
    let p = 1;

    async function fetchVods(p) {
        vods = await fetchApi(`/vods/?page_size=48&page=${p}`);
        window.scrollTo(0, 0);
        return vods;
    }
</script>

<svelte:head>
    <meta property="og:title" content="Alle Vods" />
    <meta property="og:url" content={$page.url} />
    <meta property="og:updated_time" content="Alle Vods" />
    <meta name="twitter:title" content="Alle Vods" />
    <title>Alle Vods</title>
</svelte:head>

<main class="flex-shrink-0">
    <div class="container">
        <div class="row mb-4">
            <div class="col-xs-12 col-md-8">
                <h1 class="display-4 fw-bolder p-0 m-0 align-self-center">Alle Vods</h1>
            </div>
            {#if vods}
                <div class="col-xs-12 col-md-4 col-pages">
                    <p class="fs-4 fw-bold mb-2 pb-3">
                        Seite {vods.current_page} von {vods.total_pages}
                    </p>
                </div>
            {/if}
        </div>
        {#await fetchVods(p)}
            <GridPlaceholder count="48" />
        {:then vods}
            <VodGrid {vods} />
            <Pagination obj={vods} bind:p />
        {/await}
    </div>
</main>
