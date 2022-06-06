<script>
    import SEO from '@components/SEO.svelte';
    import { format, parseISO } from 'date-fns';
    import { emotes, showEmotesInTitle } from '@stores/emotes';
    import { fetchApi, toHHMMSS } from '/src/functions';

    let vodCount = 0;
    let vods = {};

    let statsDB = {};
    let ogTags = {
        title: 'Jahresansicht',
        description: 'Twitch VOD Archiv von m4xfps/wubbl0rz',
        imageurl: '/img/og.jpg',
        imagealt: 'Wubbl0rz Archiv OG Image'
    };

    async function fetchYears() {
        const y = await fetchApi('/years/');
        y.forEach((element) => {
            vodCount += element.count;
        });
        return y;
    }

    async function fetchVods(y) {
        if (y in vods) {
            return;
        }
        const year = await fetchApi(`/vods/?page_size=500&year=${y}`);
        vods[y] = year.results;
    }
</script>

<SEO bind:ogTags bind:statsDB />

<div class="container">
    <h1 class="display-4 fw-bold pb-3">
        Jahresansicht
        <small class="text-muted">Gesamt: {vodCount}</small>
    </h1>
    <div class="accordion" id="accordionPanelsStayOpenExample">
        {#await fetchYears()}
            <p>Lade Jahre...</p>
        {:then years}
            {#each years as year}
                <div class="accordion-item" on:mouseenter={() => fetchVods(year.year)}>
                    <h2 class="accordion-header" id="panelsStayOpen-headingOne">
                        <button
                            class="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#panelsStayOpen-collapse-{year.year}"
                            aria-expanded="true"
                            aria-controls="panelsStayOpen-collapse-{year.year}"
                        >
                            <span class="fw-bold pe-1">{year.year}</span> ({year.count})
                        </button>
                    </h2>
                    <div
                        id="panelsStayOpen-collapse-{year.year}"
                        class="accordion-collapse collapse"
                        aria-labelledby="panelsStayOpen-headingOne"
                    >
                        <div class="accordion-body">
                            <div class="container">
                                {#if vods[year.year]}
                                    {#each vods[year.year] as vod}
                                        <div class="row py-2">
                                            <div class="col-md-auto">
                                                {format(parseISO(vod.date), 'dd.MM.yyyy - HH:mm')} Uhr
                                            </div>
                                            <div class="col order-first order-md-last fw-bold">
                                                <a href="/vods/watch/{vod.uuid}">
                                                    {#await showEmotesInTitle(vod.title, $emotes)}
                                                        {vod.title}
                                                    {:then newTitle}
                                                        {@html newTitle}
                                                    {/await}
                                                </a>
                                            </div>
                                            <div class="col-md-auto order-sm-last">
                                                {toHHMMSS(vod.duration, true)}
                                            </div>
                                        </div>
                                        <hr class="my-2 mx-0" />
                                    {:else}
                                        <div class="row py-2">
                                            <div class="col-md-auto">
                                                Keine Vods in {year.year}
                                            </div>
                                        </div>
                                    {/each}
                                {:else}
                                    <div class="row py-2">
                                        <div class="col-md-auto">Lade Vods...</div>
                                    </div>
                                {/if}
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        {/await}
    </div>
</div>

<style lang="scss">
    .accordion-item {
        border-color: var(--color-main);
        color: var(--color-main);
        background-color: var(--color-background);
    }

    .accordion-button {
        color: var(--color-main);
        background-color: var(--color-background);

        &:hover {
            background-color: var(--color-hover);
        }

        &:focus {
            color: inherit;
            box-shadow: none;
        }

        &:not(.collapsed) {
            color: var(--color-background);
            background-color: var(--color-main);
        }

        &::after {
            background-image: var(--accordion-button);
        }

        &:not(.collapsed)::after {
            background-image: var(--accordion-button);
            filter: invert(1);
        }
    }
</style>
