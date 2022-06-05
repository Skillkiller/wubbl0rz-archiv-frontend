<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { db } from '@stores/main';

    let statsDB;

    onMount(() => {
        db.subscribe((newStats) => {
            statsDB = newStats;
        });
    });
</script>

<svelte:head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light dark" />
    <meta property="og:locale" content="de_DE" />
    <meta property="og:site_name" content="Wubbl0rz Archiv" />
    <meta property="og:url" content={$page.url} />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
    {#if !$page.url.pathname.startsWith('/vods/watch/') && !$page.url.pathname.startsWith('/clips/watch/')}
        <meta property="og:updated_time" content={statsDB?.updated_time} />
    {/if}
    <!-- Prevent flashing theme -->
    <script data-cfasync="false">
        if (document) {
            let theme = localStorage.getItem('theme');
            if (!theme) {
                theme = window.matchMedia('(prefers-color-scheme: dark)').matches
                    ? 'dark'
                    : 'light';
                localStorage.setItem('theme', theme);
            }
            document.documentElement.setAttribute('data-theme', theme);
        }
    </script>
</svelte:head>
