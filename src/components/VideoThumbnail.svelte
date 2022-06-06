<script>
    import { toHHMMSS } from '/src/functions';

    export let type;
    export let filename;
    export let title;
    export let uuid;
    export let duration;
    export let loading;

    const BASE_URL = import.meta.env.VITE_BASE_URL;
    let avifSm;
    let avifMd;
    let jpg;
    let watched = JSON.parse(localStorage.getItem('watched'));
    if (!watched) {
        watched = {
            vods: {},
            clips: {}
        };
    }

    function showPrev() {
        avifSm.srcset = `${BASE_URL}/media/${type}/${filename}-preview.webp`;
        avifMd.srcset = `${BASE_URL}/media/${type}/${filename}-preview.webp`;
    }

    function hidePrev() {
        avifSm.srcset = `${BASE_URL}/media/${type}/${filename}-sm.avif`;
        avifMd.srcset = `${BASE_URL}/media/${type}/${filename}-md.avif`;
    }
</script>

<a href="/{type}/watch/{uuid}">
    <!-- https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/mouse-events-have-key-events.md -->
    <picture
        id={filename}
        class="has-preview"
        on:mouseover={() => showPrev()}
        on:focus={() => showPrev()}
        on:mouseout={() => hidePrev()}
        on:blur={() => hidePrev()}
    >
        <source
            id="{filename}-sm-avif"
            type="image/avif"
            srcset="{BASE_URL}/media/{type}/{filename}-sm.avif"
            media="(min-width: 576px)"
            class="card-img-top rounded"
            alt={title}
            {loading}
            bind:this={avifSm}
        />
        <source
            id="{filename}-md-avif"
            type="image/avif"
            srcset="{BASE_URL}/media/{type}/{filename}-md.avif"
            media="(max-width: 575px)"
            class="card-img-top rounded"
            alt={title}
            {loading}
            bind:this={avifMd}
        />
        <img
            width="520"
            height="293"
            id="{filename}-jpg"
            srcset="{BASE_URL}/media/{type}/{filename}-sm.jpg 576w, {BASE_URL}/media/{type}/{filename}-md.jpg 575w"
            src="{BASE_URL}/media/{type}/{filename}-md.jpg"
            class="card-img-top rounded"
            alt={title}
            {loading}
            bind:this={jpg}
        />
    </picture>
    <div class="timecode-overlay text-white">
        {toHHMMSS(duration, false)}
    </div>
    {#if watched[type][uuid]}
        <div id="watched-progress" data-id={uuid} class="progress progress-overlay">
            <div
                class="progress-bar"
                role="progressbar"
                aria-label="{uuid}-progress"
                aria-valuenow={watched[type][uuid]}
                aria-valuemin="0"
                aria-valuemax={duration}
                style:width={`${Math.round((watched[type][uuid] * 100) / duration)}%`}
            />
        </div>
    {/if}
</a>

<style lang="scss">
    .card-img-top {
        width: 100%;
        height: auto;
    }

    .progress-overlay {
        position: absolute;
        width: 100%;
        bottom: 0;
        height: 0.4rem;
        border-radius: unset;
        background-color: var(--progress-bar-bg);

        .progress-bar {
            background-color: var(--progress-bar-fg);
        }
    }
    .timecode-overlay {
        position: absolute;
        bottom: 0;
        right: 0;
        margin: 7px;
        background: black;
        padding: 0px 3px;
        border-radius: 0.25rem;
    }
</style>
