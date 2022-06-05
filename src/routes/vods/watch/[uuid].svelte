<script context="module">
    import { fetchApi } from '/src/functions';

    const BASE_URL = import.meta.env.VITE_BASE_URL;

    export async function load({ params }) {
        const vod = await fetchApi(`/vods/${params.uuid}/`);
        return { props: { vod } };
    }
</script>

<script>
    import { onMount } from 'svelte';
    import { format, parseISO } from 'date-fns';
    import { formatBytes } from '/src/functions';
    import VideoThumbnail from '@components/VideoThumbnail.svelte';
    import Player from '@components/Player.svelte';
    import GridPlaceholder from '@components/GridPlaceholder.svelte';
    import ShareButton from '@components/ShareButton.svelte';
    import HotkeyModal from '@components/HotkeyModal.svelte';
    import { emotes, showEmotesInTitle } from '@stores/emotes';

    export let vod;
    let time = 0;

    onMount(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('t')) {
            time = parseInt(urlParams.get('t'));
        }
    });
</script>

<svelte:head>
    <meta name="description" content="Vod vom {format(parseISO(vod.date), 'dd.MM.yyyy')}" />
    <meta property="og:title" content={vod.title} />
    <meta property="og:description" content="Vod vom {format(parseISO(vod.date), 'dd.MM.yyyy')}" />
    <meta property="og:updated_time" content={vod.date} />
    <meta property="og:image" content="{BASE_URL}/media/vods/{vod.filename}-lg.jpg" />
    <meta property="og:image:url" content="{BASE_URL}/media/vods/{vod.filename}-lg.jpg" />
    <meta property="og:image:secure_url" content="{BASE_URL}/media/vods/{vod.filename}-lg.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Vod Thumbnail" />
    <meta name="twitter:title" content={vod.title} />
    <meta name="twitter:description" content="Vod vom {format(parseISO(vod.date), 'dd.MM.yyyy')}" />
    <meta name="twitter:image" content="{BASE_URL}/media/vods/{vod.filename}-lg.jpg" />
    <meta name="twitter:image:alt" content="Vod Thumbnail" />
    <title>{vod.title}</title>
</svelte:head>

<main class="flex-shrink-0">
    <div class="container">
        <div class="mb-4">
            <div class="row">
                <div class="col-12">
                    <Player bind:time obj={vod} type="vods" />
                </div>
            </div>
        </div>
        <div class="vod-infos mb-4">
            <div class="d-flex title-container">
                <div>
                    <p class="display-6 fw-bolder">
                        {#await showEmotesInTitle(vod.title, $emotes, 50)}
                            {vod.title}
                        {:then newTitle}
                            {@html newTitle}
                        {/await}
                    </p>
                    <p class="text-muted">
                        {format(parseISO(vod.date), 'dd.MM.yyyy - HH:mm')} Uhr
                    </p>
                </div>
                <ShareButton bind:time />
            </div>
            <div>
                <p class="lh-lg">
                    <button
                        class="btn btn-sm"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#moreInfos"
                        aria-expanded="false"
                        aria-controls="moreInfos"
                    >
                        Mehr anzeigen
                    </button>
                    <a href="{BASE_URL}/dl/vods/{vod.uuid}" class="btn btn-sm" rel="external">
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
                </p>
                <p class="collapse text-muted" id="moreInfos">
                    Auflösung: {vod.resolution}<br />
                    Bitrate: {formatBytes(vod.bitrate)}it/s<br />
                    FPS: {vod.fps}<br />
                    Größe: {formatBytes(vod.size)}
                </p>
                <p>
                    <a
                        href="https://www.youtube.com/channel/UC9UlBHJlvz93xmLrjYCM0UA/search?query={format(
                            parseISO(vod.date),
                            'dd.MM.yyyy'
                        )}"
                        target="_blank"
                        class="text-decoration-none text-muted"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-info-circle align-middle me-1"
                            viewBox="0 0 16 16"
                        >
                            <path
                                d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
                            />
                            <path
                                d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"
                            />
                        </svg>
                        <span class="text-muted align-middle"
                            >Probleme? Dieses Vod auf YouTube suchen...</span
                        >
                    </a>
                </p>
            </div>
            {#if vod.clip_set.length}
                <hr class="my-4" />
                <p class="display-6 fw-bolder">Clips für dieses Vod:</p>
                <div class="row">
                    {#each vod.clip_set as uuid}
                        {#await fetchApi(`/clips/${uuid}`)}
                            <GridPlaceholder count="1" />
                        {:then clip}
                            <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3 col-xxl-2">
                                <div class="position-relative">
                                    <VideoThumbnail
                                        type="clips"
                                        filename={clip.clip_id}
                                        title={clip.title}
                                        uuid={clip.uuid}
                                        duration={clip.duration}
                                        loading={'auto'}
                                    />
                                </div>
                                <div class="card-body">
                                    <a href="/clips/watch/{clip.uuid}">
                                        <p class="h5 m-0">
                                            {#await showEmotesInTitle(vod.title, $emotes)}
                                                {clip.title}
                                            {:then newTitle}
                                                {@html newTitle}
                                            {/await}
                                        </p>
                                    </a>
                                    <p class="card-text text-muted">
                                        {format(parseISO(clip.date), 'dd.MM.yyyy - HH:mm')} Uhr<br
                                        />
                                        {clip.view_count} Views - {clip.creator}
                                    </p>
                                </div>
                            </div>
                        {/await}
                    {/each}
                </div>
                <hr class="my-4" />
            {/if}
        </div>
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
