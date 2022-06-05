<script>
    import { onMount } from 'svelte';
    import { format, formatDistanceToNow, parseISO } from 'date-fns';
    import { de } from 'date-fns/locale/index.js';
    import { goto } from '$app/navigation';
    import { theme } from '@stores/main';
    import { fetchApi } from '/src/functions';

    import Head from '@components/Head.svelte';
    import Footer from '@components/Footer.svelte';

    // vars
    let clips;
    let vods;
    let query = '';
    let showResults = false;
    let searchFocus = -1;
    let preferesDark;

    onMount(async () => {
        // bootstrap js
        await import('bootstrap/js/dist/base-component');
        await import('bootstrap/js/dist/button');
        await import('bootstrap/js/dist/collapse');
        await import('bootstrap/js/dist/dropdown');
        await import('bootstrap/js/dist/modal');
    });

    onMount(() => {
        // delete outdated local storage values
        let watched = JSON.parse(localStorage.getItem('watched'));
        if (watched && watched['vods'] === undefined) {
            localStorage.removeItem('watched');
        }
        if (localStorage.getItem('dark-mode')) {
            localStorage.removeItem('dark-mode');
        }

        // set theme
        preferesDark = window.matchMedia('(prefers-color-scheme: dark)');
        preferesDark.addEventListener('change', (e) => {
            setTheme(e.matches ? 'dark' : 'light');
        });

        // close search results when clicking somewhere else on the page
        document.addEventListener('click', function (e) {
            const searchInput = document.querySelector('#searchInput');
            const searchResults = document.querySelector('#searchResults');
            if (e.target != searchInput && e.target != searchResults) {
                showResults = false;
            }
        });

        /**
         *
         * Thats hacky
         * we remove the "insertAdjacentHTML" function from the head (otherwise it will break everything)
         * and replace it with a empty function.
         * We do that because https://github.com/utterance/utterances/blob/master/src/client.ts inserts styling with
         * this function that's results in duplicated styling when visiting vod's.
         */
        document.head.insertAdjacentHTML = function () {
            return;
        };
    });

    function setTheme(newTheme) {
        document.documentElement.setAttribute('data-theme', newTheme);
        $theme = newTheme;
        localStorage.setItem('theme', newTheme);
    }

    // handle search
    async function search() {
        if (query.length < 3) {
            return;
        }
        showResults = true;
        vods = await fetchApi(`/vods/?page_size=4&search=${query}`);
        clips = await fetchApi(`/clips/?page_size=4&search=${query}`);
    }

    search();

    // keyboard navigation for search results
    function handleResultsList(e) {
        let resultItems = document.querySelectorAll('.result-item');
        if (e.keyCode == 13 && searchFocus === -1 && query.length > 0) {
            showResults = false;
            goto(`/search/${query}`);
        } else if (e.keyCode == 40) {
            searchFocus++;
            addActive(resultItems);
        } else if (e.keyCode == 38) {
            searchFocus--;
            addActive(resultItems);
        } else if (e.keyCode == 13) {
            if (searchFocus > -1) {
                if (resultItems) resultItems[searchFocus].click();
            }
        }
    }

    function addActive(resultItems) {
        if (!resultItems) return false;
        removeActive(resultItems);
        if (searchFocus >= resultItems.length) searchFocus = 0;
        if (searchFocus < 0) searchFocus = resultItems.length - 1;
        resultItems[searchFocus].classList.add('result-item-active');
    }

    function removeActive(resultItems) {
        for (let i = 0; i < resultItems.length; i++) {
            resultItems[i].classList.remove('result-item-active');
        }
    }
</script>

<Head />

<header>
    <nav class="navbar navbar-expand-lg sticky-top mb-4">
        <div class="container-fluid">
            <a href="/" class="navbar-brand ps-3">
                <img
                    src="/favicon.ico"
                    width="50"
                    height="50"
                    class="rounded-circle"
                    alt="wubPog"
                />
            </a>
            <button
                class="navbar-toggler me-3 rounded-2"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span class="navbar-toggler-icon" />
            </button>
            <div class="collapse navbar-collapse mx-3" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item dropdown">
                        <a
                            class="nav-link dropdown-toggle fs-5"
                            id="navbarVodsDropdown"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            Vods
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarVodsDropdown">
                            <li><a href="/vods/all" class="dropdown-item">Alle Vods</a></li>
                            <li><a href="/vods/years" class="dropdown-item">Jahresansicht</a></li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link fs-5" href="/clips">Clips</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link fs-5" href="/stats">Stats</a>
                    </li>
                </ul>
                <div class="d-flex input-group me-2 search-container" autocomplete="off">
                    <input
                        id="searchInput"
                        class="form-control rounded-0 rounded-start"
                        type="search"
                        placeholder="Archiv durchsuchen..."
                        aria-label="Suche"
                        name="q"
                        bind:value={query}
                        on:input={() => search()}
                        on:focus={() => (showResults = true)}
                        on:keydown={(e) => handleResultsList(e)}
                        required
                    />
                    <button
                        class="btn btn-outline-secondary rounded-0 rounded-end d-flex align-items-center"
                        type="button"
                        aria-label="Suchen"
                        on:click={() => (query ? goto(`/search/${query}`) : '')}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-search"
                            viewBox="0 0 16 16"
                        >
                            <path
                                d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
                            />
                        </svg>
                    </button>
                    <div id="searchResults" class="{showResults ? '' : 'd-none'} rounded">
                        {#if vods?.results.length && query?.length > 2}
                            <h5 class="p-2">Vod Ergebnisse: {vods.count}</h5>
                            <div id="result-items-vods">
                                {#each vods.results as vod}
                                    <a href="/vods/watch/{vod.uuid}" class="text-decoration-none">
                                        <div
                                            class="p-2 result-item"
                                            on:mouseenter={(e) =>
                                                e.target.classList.add('result-item-active')}
                                            on:mouseleave={(e) =>
                                                e.target.classList.remove('result-item-active')}
                                        >
                                            <div class="fw-bold">{vod.title}</div>
                                            <div class="text-muted">
                                                {formatDistanceToNow(parseISO(vod.date), {
                                                    locale: de
                                                })} - {format(parseISO(vod.date), 'HH:mm')} Uhr
                                            </div>
                                        </div>
                                    </a>
                                {/each}
                            </div>
                        {/if}
                        {#if clips?.results.length && query?.length > 2}
                            <h5 class="p-2">Clip Ergebnisse: {clips.count}</h5>
                            <div id="result-items-clips">
                                {#each clips?.results as clip}
                                    <a href="/clips/watch/{clip.uuid}" class="text-decoration-none">
                                        <div
                                            class="p-2 result-item"
                                            on:mouseenter={(e) =>
                                                e.target.classList.add('result-item-active')}
                                            on:mouseleave={(e) =>
                                                e.target.classList.remove('result-item-active')}
                                        >
                                            <div class="fw-bold">{clip.title}</div>
                                            <div class="text-muted">
                                                {formatDistanceToNow(parseISO(clip.date), {
                                                    locale: de
                                                })}, von {clip.creator},
                                                {clip.view_count} Views
                                            </div>
                                        </div>
                                    </a>
                                {/each}
                            </div>
                        {/if}
                        {#if (vods?.results.length === 0 && clips?.results.length === 0) || query?.length <= 2}
                            <div class="p-2">Keine Ergebnisse</div>
                        {/if}
                    </div>
                </div>
                <ul class="navbar-nav me-2">
                    <li class="nav-item dropdown">
                        <a
                            class="nav-link dropdown-toggle fs-5"
                            id="navbarDropdown"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            aria-label="Theme"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="26"
                                height="26"
                                fill="currentColor"
                                class="bi bi-palette me-1"
                                viewBox="0 0 16 16"
                            >
                                <path
                                    d="M8 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm4 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM5.5 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm.5 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"
                                />
                                <path
                                    d="M16 8c0 3.15-1.866 2.585-3.567 2.07C11.42 9.763 10.465 9.473 10 10c-.603.683-.475 1.819-.351 2.92C9.826 14.495 9.996 16 8 16a8 8 0 1 1 8-8zm-8 7c.611 0 .654-.171.655-.176.078-.146.124-.464.07-1.119-.014-.168-.037-.37-.061-.591-.052-.464-.112-1.005-.118-1.462-.01-.707.083-1.61.704-2.314.369-.417.845-.578 1.272-.618.404-.038.812.026 1.16.104.343.077.702.186 1.025.284l.028.008c.346.105.658.199.953.266.653.148.904.083.991.024C14.717 9.38 15 9.161 15 8a7 7 0 1 0-7 7z"
                                />
                            </svg>
                        </a>
                        <ul
                            class="dropdown-menu dropdown-menu-end"
                            aria-labelledby="navbarDropdown"
                        >
                            <li class="cursor-pointer">
                                <div class="dropdown-item" on:click={() => setTheme('dark')}>
                                    Dark
                                </div>
                            </li>
                            <li class="cursor-pointer">
                                <div class="dropdown-item" on:click={() => setTheme('light')}>
                                    Light
                                </div>
                            </li>
                            <li class="cursor-pointer">
                                <div class="dropdown-item" on:click={() => setTheme('nord')}>
                                    Nord
                                </div>
                            </li>
                            <li class="cursor-pointer">
                                <div class="dropdown-item" on:click={() => setTheme('gruvbox')}>
                                    Gruvbox
                                </div>
                            </li>
                            <li class="cursor-pointer">
                                <div class="dropdown-item" on:click={() => setTheme('solarized')}>
                                    Solarized Dark
                                </div>
                            </li>
                            <li class="cursor-pointer">
                                <div class="dropdown-item" on:click={() => setTheme('ayaya')}>
                                    AYAYA
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</header>

<slot />

<Footer />

<style lang="scss" global>
    @import '../main.scss';

    .navbar {
        background-color: var(--color-background);
    }

    .navbar-collapse {
        background-color: var(--color-background);
    }

    .nav-link {
        color: var(--color-main) !important;
    }

    .form-control {
        color: var(--color-main) !important;
        border: var(--border);

        &:focus,
        &:focus-visible {
            color: inherit;
            border-color: inherit;
            box-shadow: none;
        }
    }

    .search-container {
        width: 25%;
    }

    #searchResults {
        position: absolute;
        z-index: 1000;
        background-color: var(--color-background);
        border: 1px solid var(--color-main);
        top: 0;
        margin-top: 37px;
        width: 100%;

        h5 {
            margin: 0;
            background-color: var(--color-main);
            color: var(--color-background);
        }
    }

    .navbar-toggler {
        border-radius: var(--border-radius);

        .navbar-toggler-icon {
            background-image: var(--toggler-icon);
        }

        &:focus {
            box-shadow: none !important;
        }
    }

    .cursor-pointer {
        cursor: pointer;
    }

    @media only screen and (max-width: 991px) {
        .search-container {
            width: 100%;
        }
    }
</style>
