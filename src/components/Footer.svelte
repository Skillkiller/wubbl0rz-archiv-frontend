<script>
    import { onMount } from 'svelte';
    import { formatRelative, parseISO } from 'date-fns';
    import { de } from 'date-fns/locale/index.js';
    import { page } from '$app/stores';
    import { db } from '@stores/main';

    let statsDB;

    onMount(() => {
        db.subscribe((newStats) => {
            statsDB = newStats;
        });
    })
</script>

<footer class="footer mt-auto py-3">
    <div class="container">
        <div class="row">
            <div class="col-md mt-3">
                <p class="mb-1 fw-bold fs-6">Letztes Update</p>
                {#if statsDB}
                    <p class="m-0">
                        {formatRelative(parseISO(statsDB?.last_vod_sync), new Date(), {
                            locale: de
                        })} Uhr
                    </p>
                {/if}
            </div>
            <div class="col-md mt-3">
                <p class="mb-1 fw-bold fs-6">Max</p>
                <ul class="footer-list">
                    <li>
                        <a
                            href="https://www.twitch.tv/wubbl0rz"
                            target="_blank"
                            rel="noopener noreferrer"
                            data-bs-toggle="tooltip"
                            title="Twitch"
                            class="text-decoration-none"
                            >Twitch
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://www.youtube.com/user/m4xFPS"
                            target="_blank"
                            rel="noopener noreferrer"
                            data-bs-toggle="tooltip"
                            title="Youtube"
                            class="text-decoration-none"
                            >YouTube
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://discord.gg/n5vmqaC"
                            target="_blank"
                            rel="noopener noreferrer"
                            data-bs-toggle="tooltip"
                            title="Discord"
                            class="text-decoration-none"
                            >Discord
                        </a>
                    </li>
                </ul>
            </div>
            <div class="col-md mt-3 mb-3">
                <p class="mb-1 fw-bold fs-6">Archiv</p>
                <ul class="footer-list">
                    <li>
                        <a
                            href="https://github.com/AgileProggers/"
                            target="_blank"
                            rel="noopener noreferrer"
                            data-bs-toggle="tooltip"
                            title="GitHub"
                            class="text-decoration-none"
                            >Github
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://status.wubbl0rz.tv/status/wubbl0rz"
                            target="_blank"
                            rel="noopener noreferrer"
                            data-bs-toggle="tooltip"
                            title="Status Page"
                            class="text-decoration-none"
                            >Status
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://api.wubbl0rz.tv/"
                            target="_blank"
                            rel="noopener noreferrer"
                            data-bs-toggle="tooltip"
                            title="Rest Api"
                            class="text-decoration-none"
                            >Rest Api
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://www.youtube.com/channel/UC9UlBHJlvz93xmLrjYCM0UA"
                            target="_blank"
                            rel="noopener noreferrer"
                            data-bs-toggle="tooltip"
                            title="YouTube Archiv"
                            class="text-decoration-none"
                            >YouTube Archiv
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    {#if $page.url.hostname.startsWith('archiv.wubbl0rz.tv')}
        <script
            async
            defer
            data-website-id="df348655-2d47-427d-87d2-7a4b048c8216"
            src="https://umami.wubbl0rz.tv/u.js"></script>
    {/if}
</footer>
