<script>
    import { onMount } from 'svelte';
    import { Chart, registerables } from 'chart.js/dist/chart.esm';
    import { theme } from '@stores/main';
    import { themeColors } from './StatsColors.svelte';

    Chart.register(...registerables);

    export let data;

    let chartCanvas;
    let chart;
    let colors = themeColors[$theme];
    const chartValues = Array.from([...data.map((x) => x.count)]);
    const chartLabels = Array.from([...data.map((x) => x.weekday)]);

    theme.subscribe((newTheme) => {
        if (chart) {
            colors = themeColors[newTheme];
            chart.data.datasets.forEach((dataset) => {
                dataset.backgroundColor = colors?.backgroundColors;
            });
            chart.options.plugins.legend.labels.color = colors?.ticks;
            chart.update();
        }
    });

    onMount(async () => {
        let ctx = chartCanvas.getContext('2d');
        chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: chartLabels,
                datasets: [
                    {
                        data: chartValues,
                        backgroundColor: colors?.backgroundColors
                    }
                ]
            },
            options: {
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: colors?.ticks
                        }
                    }
                }
            }
        });
    });
</script>

<canvas bind:this={chartCanvas} />
