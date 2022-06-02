<script context="module">
    import { fetchApi } from '/src/functions';

    const BASE_URL = import.meta.env.VITE_BASE_URL;

    export async function load({ params }) {
        const clip = await fetchApi(`/clips/${params.uuid}/`);
        return { props: { clip } };
    }
</script>

<script>
    import { onMount } from 'svelte';
    import { format, parseISO } from 'date-fns';
    import { formatBytes } from '/src/functions.js';
    import VideoThumbnail from '@components/VideoThumbnail.svelte';
    import Player from '@components/Player.svelte';
    import GridPlaceholder from '@components/GridPlaceholder.svelte';
    import ShareButton from '@components/ShareButton.svelte';
    import HotkeyModal from '@components/HotkeyModal.svelte';
    import { emotes, showEmotesInTitle } from '@stores/emotes';

    export let clip;
    let time = 0;

    onMount(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('t')) {
            time = parseInt(urlParams.get('t'));
        }
    });
</script>

<svelte:head>
    <meta name="description" content="Clip von {clip.creator} mit {clip.view_count} Views" />
    <meta property="og:title" content={clip.title} />
    <meta property="og:description" content="Clip von {clip.creator} mit {clip.view_count} Views" />
    <meta property="og:updated_time" content={clip.date} />
    <meta property="og:image" content="{BASE_URL}/media/clips/{clip.clip_id}-lg.jpg" />
    <meta property="og:image:url" content="{BASE_URL}/media/clips/{clip.clip_id}-lg.jpg" />
    <meta property="og:image:secure_url" content="{BASE_URL}/media/clips/{clip.clip_id}-lg.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Clip Thumbnail" />
    <meta name="twitter:title" content={clip.title} />
    <meta
        name="twitter:description"
        content="Clip von {clip.creator} mit {clip.view_count} Views"
    />
    <meta name="twitter:image" content="{BASE_URL}/media/clips/{clip.clip_id}-lg.jpg" />
    <meta name="twitter:image:alt" content="Clip Thumbnail" />
    <title>{clip.title}</title>
</svelte:head>

<main class="flex-shrink-0">
    <div class="container">
        <div class="mb-4">
            <div class="row">
                <div class="col-12">
                    <Player bind:time obj={clip} type="clips" />
                </div>
            </div>
        </div>
        <div class="vod-infos mb-4">
            <div class="d-flex title-container">
                <div>
                    <p class="display-6 fw-bolder">
                        {#await showEmotesInTitle(clip.title, $emotes, 50)}
                            {clip.title}
                        {:then newTitle}
                            {@html newTitle}
                        {/await}
                    </p>
                    <div class="row align-items-center">
                        <div class="col-auto me-3">
                            {#if clip.game}
                                <img
                                    src="{BASE_URL}/media/games/{clip.game.game_id}.jpg"
                                    alt={clip.game.name}
                                    loading="lazy"
                                />
                            {:else}
                                <img
                                    src="/img/modcheck.gif"
                                    alt="Unbekanntes Spiel"
                                    loading="lazy"
                                />
                            {/if}
                        </div>
                        <div class="col-auto">
                            <div class="row">
                                <div class="col">
                                    {format(parseISO(clip.date), 'dd.MM.yyyy - HH:mm')} Uhr<br />
                                    {clip.view_count} Views, erstellt von: {clip.creator}<br />
                                    {#if clip.game}
                                        Kategorie: {clip.game.name}
                                    {:else}
                                        Kategorie: Unbekannt
                                    {/if}
                                </div>
                            </div>
                            <div class="row">
                                <div class="col lh-lg mt-2">
                                    <button
                                        class="btn btn-sm"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#collapseExample"
                                        aria-expanded="false"
                                        aria-controls="collapseExample"
                                    >
                                        Mehr anzeigen
                                    </button>
                                    <a
                                        href="{BASE_URL}/dl/clips/{clip.uuid}"
                                        class="btn btn-sm"
                                        rel="external"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                            class="bi bi-download"
                                            viewBox="0 0 16 16"
                                        >
                                            <path
                                                d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"
                                            />
                                            <path
                                                d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"
                                            />
                                        </svg>
                                        Download
                                    </a>
                                    <button
                                        type="button"
                                        class="btn btn-sm"
                                        data-bs-toggle="modal"
                                        data-bs-target="#hotkeyModal"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                            class="bi bi-keyboard"
                                            viewBox="0 0 16 16"
                                        >
                                            <path
                                                d="M14 5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h12zM2 4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H2z"
                                            />
                                            <path
                                                d="M13 10.25a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm0-2a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm-5 0A.25.25 0 0 1 8.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 8 8.75v-.5zm2 0a.25.25 0 0 1 .25-.25h1.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-1.5a.25.25 0 0 1-.25-.25v-.5zm1 2a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm-5-2A.25.25 0 0 1 6.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 6 8.75v-.5zm-2 0A.25.25 0 0 1 4.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 4 8.75v-.5zm-2 0A.25.25 0 0 1 2.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 2 8.75v-.5zm11-2a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm-2 0a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm-2 0A.25.25 0 0 1 9.25 6h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 9 6.75v-.5zm-2 0A.25.25 0 0 1 7.25 6h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 7 6.75v-.5zm-2 0A.25.25 0 0 1 5.25 6h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 5 6.75v-.5zm-3 0A.25.25 0 0 1 2.25 6h1.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-1.5A.25.25 0 0 1 2 6.75v-.5zm0 4a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm2 0a.25.25 0 0 1 .25-.25h5.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-5.5a.25.25 0 0 1-.25-.25v-.5z"
                                            />
                                        </svg>
                                        Hotkeys
                                    </button>
                                    <HotkeyModal />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ShareButton bind:time />
            </div>
            <p class="collapse text-muted mt-2" id="collapseExample">
                Auflösung: {clip.resolution}<br />
                Bitrate: {formatBytes(clip.bitrate)}it/s<br />
                Größe: {formatBytes(clip.size)}
            </p>
        </div>
        {#if clip.vod}
            <hr class="my-4" />
            <p class="display-6 fw-bolder">Clip stammt aus folgendem Vod:</p>
            <div class="row">
                {#await fetchApi(`/vods/${clip.vod}/`)}
                    <GridPlaceholder count="1" />
                {:then vod}
                    <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3 col-xxl-2">
                        <div class="position-relative">
                            <VideoThumbnail
                                type="vods"
                                filename={vod.filename}
                                title={vod.title}
                                uuid={vod.uuid}
                                duration={vod.duration}
                                loading={'auto'}
                            />
                        </div>
                        <div class="card-body">
                            <a href="/vods/watch/{vod.uuid}">
                                <p class="h5 m-0">
                                    {#await showEmotesInTitle(vod.title, $emotes)}
                                        {vod.title}
                                    {:then newTitle}
                                        {@html newTitle}
                                    {/await}
                                </p>
                            </a>
                            <p class="card-text text-muted">
                                {format(parseISO(vod.date), 'dd.MM.yyyy - HH:mm')} Uhr
                            </p>
                        </div>
                    </div>
                {/await}
            </div>
            <hr class="my-4" />
        {/if}
        <script
            src="https://utteranc.es/client.js"
            repo="AgileProggers/archiv-comments"
            issue-term="url"
            theme="preferred-color-scheme"
            crossorigin="anonymous"
            async>
        </script>
    </div>
</main>

<style lang="scss">
    @media screen and (max-width: 767px) {
        .title-container {
            display: block !important;
        }
    }
</style>
