<script>
    import { formatBytes } from '/src/functions';
    import StatsBox from '@components/StatsBox.svelte';
    import ChartBar from '@components/ChartBar.svelte';
    import ChartDoughnut from '@components/ChartDoughnut.svelte';
    import ChartLine from '@components/ChartLine.svelte';
    import SEO from '@components/SEO.svelte';
    import { fetchApi } from '/src/functions';

    let statsDB = {};
    let ogTags = {
        title: 'Statistiken',
        description: 'Twitch VOD Archiv von m4xfps/wubbl0rz',
        imageurl: '/img/og.jpg',
        imagealt: 'Wubbl0rz Archiv OG Image'
    };
</script>

<SEO bind:ogTags bind:statsDB />

<main class="flex-shrink-0">
    <div class="container mb-4">
        <h1 class="display-4 fw-bolder pb-3">Statistiken</h1>
        {#await fetchApi('/stats') then stats}
            <section>
                <div class="row">
                    <div class="col-12 col-sm-6 col-lg-3 p-2">
                        <StatsBox
                            title="Vods"
                            count={stats.count_vods_total}
                            trend={stats.trend_vods}
                            color="1"
                        />
                    </div>
                    <div class="col-12 col-sm-6 col-lg-3 p-2">
                        <StatsBox
                            title="Clips"
                            count={stats.count_clips_total}
                            trend={stats.trend_clips}
                            color="2"
                        />
                    </div>
                    <div class="col-12 col-sm-6 col-lg-3 p-2">
                        <StatsBox
                            title="Stunden gestreamt"
                            count={stats.count_h_streamed}
                            trend={stats.trend_h_streamed}
                            color="3"
                        />
                    </div>
                    <div class="col-12 col-sm-6 col-lg-3 p-2">
                        <StatsBox
                            title="Archivgröße"
                            count={formatBytes(stats.count_size_bytes)}
                            trend={false}
                            color="4"
                        />
                    </div>
                </div>
            </section>
            <section>
                <div class="row">
                    <div class="col-md-8 py-3">
                        <h3 class="display-6 py-3">
                            <strong>Vods pro Monat</strong>
                        </h3>
                        <ChartBar data={stats.vods_per_month} />
                    </div>
                    <div class="col-md-4 py-3">
                        <h3 class="display-6 py-3">
                            <strong>Vods pro Wochentag</strong>
                        </h3>
                        <ChartDoughnut data={stats.vods_per_weekday} />
                    </div>
                </div>
                <div class="row">
                    <div class="col p-3">
                        <h3 class="display-6 py-3">
                            <strong>Streambeginn nach Uhrzeit</strong>
                        </h3>
                        <ChartLine data={stats.start_by_time} />
                    </div>
                </div>
            </section>
        {/await}

        <section>
            <h3 class="display-6 py-3">
                <strong>Emotes</strong>
            </h3>
            {#await fetchApi(`/emotes/?page_size=500&provider=twitch`)}
                <h4 class="h4">Twitch</h4>
            {:then emotes}
                <h4 class="h4">
                    Twitch
                    <small>({emotes.count})</small>
                </h4>
                <div class="row">
                    {#each emotes.results as emote}
                        <div class="col-auto p-1">
                            <img
                                src={emote.url}
                                alt={emote.name}
                                loading="lazy"
                                height="60"
                                data-toggle="tooltip"
                                title={emote.name}
                            />
                        </div>
                    {/each}
                </div>
            {/await}
            {#await fetchApi(`/emotes/?page_size=500&provider=bttv`)}
                <h4 class="h4 pt-4">BetterTTV</h4>
            {:then emotes}
                <h4 class="h4 pt-4">
                    BetterTTV
                    <small>({emotes.count})</small>
                </h4>
                <div class="row">
                    {#each emotes.results as emote}
                        <div class="col-auto p-1">
                            <img
                                src={emote.url}
                                alt={emote.name}
                                loading="lazy"
                                height="60"
                                data-toggle="tooltip"
                                title={emote.name}
                            />
                        </div>
                    {/each}
                </div>
            {/await}
            {#await fetchApi(`/emotes/?page_size=500&provider=ffz`)}
                <h4 class="h4 pt-4">FrankerFaceZ</h4>
            {:then emotes}
                <h4 class="h4 pt-4">
                    FrankerFaceZ
                    <small>({emotes.count})</small>
                </h4>
                <div class="row">
                    {#each emotes.results as emote}
                        <div class="col-auto p-1">
                            <img
                                src={emote.url}
                                alt={emote.name}
                                loading="lazy"
                                height="60"
                                data-toggle="tooltip"
                                title={emote.name}
                            />
                        </div>
                    {/each}
                </div>
            {/await}
        </section>
    </div>
</main>
