<script>
    import VideoThumbnail from './VideoThumbnail.svelte';
    import { format, formatDistanceToNow, parseISO } from 'date-fns';
    import { de } from 'date-fns/locale/index.js';
    import { emotes, showEmotesInTitle } from '@stores/emotes';

    export let vods;
</script>

<div class="row">
    {#each vods.results as vod, i}
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3 col-xxl-2 mb-2">
            <div class="card card-rounded h-100">
                <div class="position-relative">
                    <VideoThumbnail
                        type="vods"
                        filename={vod.filename}
                        title={vod.title}
                        uuid={vod.uuid}
                        duration={vod.duration}
                        loading={i > 7 ? 'lazy' : 'auto'}
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
                    <p
                        class="card-text text-muted"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title={format(parseISO(vod.date), 'dd.MM.yyyy HH:mm:ss')}
                    >
                        {formatDistanceToNow(parseISO(vod.date), { locale: de })},
                        {format(parseISO(vod.date), 'HH:mm')} Uhr
                    </p>
                </div>
            </div>
        </div>
    {:else}
        <div class="col">
            <img src="/img/modcheck.gif" alt="modcheck" width="110" height="110" />
        </div>
    {/each}
</div>
