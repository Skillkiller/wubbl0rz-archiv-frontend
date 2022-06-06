<script>
    import SEO from '@components/SEO.svelte';
    import VodGrid from '@components/VodGrid.svelte';
    import GridPlaceholder from '@components/GridPlaceholder.svelte';
    import Pagination from '@components/Pagination.svelte';
    import { fetchApi } from '/src/functions';

    let vods;
    let p = 1;
    let statsDB;
    let ogTags = {
        title: 'Alle Vods',
        description: 'Twitch VOD Archiv von m4xfps/wubbl0rz',
        imageurl: '/img/og.jpg',
        imagealt: 'Wubbl0rz Archiv OG Image'
    };

    async function fetchVods(p) {
        vods = await fetchApi(`/vods/?page_size=48&page=${p}`);
        window.scrollTo(0, 0);
        return vods;
    }
</script>

<SEO bind:ogTags bind:statsDB />

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
