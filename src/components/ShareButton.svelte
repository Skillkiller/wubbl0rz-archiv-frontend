<script>
    import { onMount } from 'svelte';
    import { toHHMMSS } from '/src/functions';

    export let time;

    let baseUrl;
    let shareTime = false;
    let shareUrl;
    let copyClicked = false;

    if (time === undefined) {
        time = 0;
    }

    onMount(() => {
        baseUrl = window.location.href.split('?')[0]; // prevent having 2x '?t=' in url
    });

    $: shareTime, (shareUrl = shareTime ? baseUrl + '?t=' + time : baseUrl);

    function copyToClipboard() {
        navigator.clipboard.writeText(shareUrl);
        copyClicked = true;
        setTimeout(() => {
            copyClicked = false;
        }, 1000);
    }
</script>

<div class="share-button">
    <div class="dropdown">
        <button
            class="btn btn-sm dropdown-toggle"
            type="button"
            id="share-button"
            data-bs-toggle="dropdown"
            data-bs-auto-close="outside"
            aria-expanded="false"
        >
            Teilen
        </button>
        <ul
            class="dropdown-menu dropdown-menu-end p-3 share-button-list"
            id="share-button-list"
            aria-labelledby="share-button"
            style="width: max-content;"
        >
            <li>
                <div class="input-group">
                    <input
                        type="text"
                        class="form-control share-input"
                        aria-label="Share Url"
                        value={shareUrl}
                    />
                    <button id="btn-copy-clipboard" class="btn" on:click={copyToClipboard}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="currentColor"
                            class="bi bi-clipboard {copyClicked ? 'd-none' : ''}"
                            viewBox="0 0 16 16"
                        >
                            <path
                                d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"
                            />
                            <path
                                d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"
                            />
                        </svg>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="currentColor"
                            class="bi bi-clipboard-check {copyClicked ? '' : 'd-none'}"
                            viewBox="0 0 16 16"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"
                            />
                            <path
                                d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"
                            />
                            <path
                                d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"
                            />
                        </svg>
                    </button>
                </div>
                <div class="form-check mt-2">
                    <input
                        class="form-check-input"
                        type="checkbox"
                        id="share-checkbox"
                        bind:checked={shareTime}
                    />
                    <label class="form-check-label" for="share-checkbox" id="share-at-text">
                        Teilen bei {toHHMMSS(time, true)}
                    </label>
                </div>
            </li>
        </ul>
    </div>
</div>

<style lang="scss">
    .share-input {
        padding: 0.25rem 0.5rem;
    }

    .share-button-list {
        background-color: var(--color-hover);
        width: 450px !important;
        max-width: 100vw;
    }

    .share-button {
        margin-left: auto;
    }

    @media screen and (max-width: 767px) {
        .share-button {
            margin: 1rem 0;
        }
    }
</style>
