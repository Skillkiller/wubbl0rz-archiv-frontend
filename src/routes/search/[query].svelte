<script>
    import VodGrid from '@components/VodGrid.svelte';
    import ClipGrid from '@components/ClipGrid.svelte';
    import GridPlaceholder from '@components/GridPlaceholder.svelte';
    import Pagination from '@components/Pagination.svelte';
    import SEO from '@components/SEO.svelte';
    import { page } from '$app/stores';
    import { fetchApi } from '/src/functions';

    let vodsPage = 1;
    let clipsPage = 1;
    let pageSize = 18;
    let statsDB = {};
    let ogTags = {
        title: '',
        description: 'Suche',
        imageurl: '/img/og.jpg',
        imagealt: 'Wubbl0rz Archiv OG Image'
    };

    page.subscribe(() => {
        ogTags.title = $page.params.query;
    });
</script>

<SEO bind:ogTags bind:statsDB />

<main class="flex-shrink-0">
    <div class="container">
        {#await fetchApi(`/vods/?page_size=${pageSize}&page=${vodsPage}&search=${ogTags.title}`)}
            <div class="row mb-4">
                <div class="col-xs-12 col-md-7">
                    <h1 class="display-4 fw-bolder p-0 m-0 align-self-center">Vod Ergebnisse</h1>
                </div>
            </div>
            <GridPlaceholder count="12" />
        {:then vods}
            <div class="row mb-4">
                <div class="col-auto">
                    <h1 class="display-4 fw-bolder p-0 m-0 align-self-center">Vod Ergebnisse</h1>
                </div>
                <div class="col-xs-12 col-md-5 ms-auto col-pages">
                    <p class="fs-4 fw-bold p-0 m-0 align-self-center">
                        {#if vods.count >= 1}
                            {(vodsPage - 1) * pageSize + 1} - {(vodsPage - 1) * pageSize +
                                vods.results.length} von {vods.count}
                            {vods.count == 1 ? 'Ergebnis' : 'Ergebnissen'}
                        {:else}
                            0 Ergebnisse
                        {/if}
                    </p>
                </div>
            </div>
            <VodGrid {vods} />
            <Pagination obj={vods} bind:p={vodsPage} />
        {/await}
    </div>
    <div class="container">
        {#await fetchApi(`/clips/?page_size=${pageSize}&page=${clipsPage}&search=${ogTags.title}`)}
            <div class="row mb-4">
                <div class="col-xs-12 col-md-7">
                    <h1 class="display-4 fw-bolder p-0 m-0 align-self-center">Clip Ergebnisse</h1>
                </div>
            </div>
            <GridPlaceholder count="12" />
        {:then clips}
            <div class="row mb-4">
                <div class="col-auto">
                    <h1 class="display-4 fw-bolder p-0 m-0 align-self-center">Clip Ergebnisse</h1>
                </div>
                <div class="col-xs-12 col-md-5 ms-auto col-pages">
                    <p class="fs-4 fw-bold p-0 m-0 align-self-center">
                        {#if clips.count >= 1}
                            {(clipsPage - 1) * pageSize + 1} - {(clipsPage - 1) * pageSize +
                                clips.results.length} von {clips.count}
                            {clips.count == 1 ? 'Ergebnis' : 'Ergebnissen'}
                        {:else}
                            0 Ergebnisse
                        {/if}
                    </p>
                </div>
            </div>
            <ClipGrid {clips} />
            <Pagination obj={clips} bind:p={clipsPage} />
        {/await}
    </div>
</main>
