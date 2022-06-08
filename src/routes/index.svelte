<script>
    import { fetchApi } from '/src/functions';
    import VodGrid from '@components/VodGrid.svelte';
    import ClipGrid from '@components/ClipGrid.svelte';
    import GridPlaceholder from '@components/GridPlaceholder.svelte';
    import SEO from '@components/SEO.svelte';
    import subMonths from 'date-fns/subMonths/index.js';

    let statsDB = {};
    let ogTags = {
        title: 'Wubbl0rz Archiv',
        description: 'Twitch VOD Archiv von m4xfps/wubbl0rz',
        imageurl: '/img/og.jpg',
        imagealt: 'Wubbl0rz Archiv OG Image'
    };
</script>

<SEO bind:ogTags bind:statsDB />

<main class="flex-shrink-0">
    <div class="container">
        {#if !statsDB?.is_live}
            <div
                class="alert alert-custom border-0 rounded-3 fs-4 m-2 mb-5 fw-bold text-center"
                role="alert"
            >
                <p class="m-0 fs-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        fill="currentColor"
                        class="bi bi-twitch me-2"
                        viewBox="0 0 16 16"
                    >
                        <path
                            d="M3.857 0 1 2.857v10.286h3.429V16l2.857-2.857H9.57L14.714 8V0H3.857zm9.714 7.429-2.285 2.285H9l-2 2v-2H4.429V1.143h9.142v6.286z"
                        />
                        <path
                            d="M11.857 3.143h-1.143V6.57h1.143V3.143zm-3.143 0H7.571V6.57h1.143V3.143z"
                        />
                    </svg>
                    Max ist live!
                </p>
                <p class="m-0">
                    Hier gehts zum Stream: <a
                        href="https://www.twitch.tv/wubbl0rz"
                        class="alert-link">twitch.tv/wubbl0rz</a
                    >
                </p>
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

<style lang="scss">
    .alert-custom {
        background-color: var(--color-hover);
        color: var(--color-alert-text);
        box-shadow: 7px 5px 0px var(--color-alert-text);

        .alert-link {
            color: var(--color-alert-text);
        }
    }

    @media only screen and (min-width: 768px) {
        .alert-custom {
            background-image: url('/img/soyjak1.png'), url('/img/soyjak2.png');
            background-position: left, right;
            background-size: contain;
            background-repeat: no-repeat;
        }
    }
</style>
