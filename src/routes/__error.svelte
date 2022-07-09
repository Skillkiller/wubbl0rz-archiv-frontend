<script context="module">
    /** @type {import('@sveltejs/kit').ErrorLoad} */
    export function load({ error, status }) {
        return {
            props: {
                status: status,
                message: error.message
            }
        };
    }
</script>

<script>
    export let status, message;
</script>

<h1 class="text-center">{status}</h1>
<h2 class="text-center mt-4">{message}</h2>
