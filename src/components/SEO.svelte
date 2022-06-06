<script>
    import { onMount, onDestroy } from 'svelte';
    import { page } from '$app/stores';
    import { db } from '@stores/main';
    import { fetchApi } from '/src/functions';

    export let ogTags;
    export let statsDB;

    // periodically fetch db stats for live event
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
    <meta name="description" content={ogTags.description} />
    <meta property="og:title" content={ogTags.title} />
    <meta property="og:description" content={ogTags.description} />
    <meta property="og:url" content={$page.url} />
    <meta property="og:updated_time" content={statsDB?.last_vod_sync} />
    <meta property="og:image" content={ogTags.imageurl} />
    <meta property="og:image:url" content={ogTags.imageurl} />
    <meta property="og:image:secure_url" content={ogTags.imageurl} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content={ogTags.imagealt} />
    <meta name="twitter:title" content={ogTags.title} />
    <meta name="twitter:description" content={ogTags.description} />
    <meta name="twitter:image" content={ogTags.imageurl} />
    <meta name="twitter:image:alt" content={ogTags.imagealt} />
    <title>{ogTags.title}</title>
</svelte:head>
