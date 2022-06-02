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
    const chartLabels = Array.from([...data.map((x) => x.month)]);

    theme.subscribe((newTheme) => {
        if (chart) {
            colors = themeColors[newTheme];
            chart.data.datasets.forEach((dataset) => {
                dataset.backgroundColor = colors?.backgroundColors;
            });
            chart.options = {
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            color: colors?.ticks
                        },
                        grid: {
                            color: colors?.grid
                        }
                    },
                    x: {
                        ticks: {
                            color: colors?.ticks
                        },
                        grid: {
                            color: colors?.grid
                        }
                    }
                }
            };
            chart.update();
        }
    });

    onMount(async () => {
        let ctx = chartCanvas.getContext('2d');
        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartLabels,
                datasets: [
                    {
                        backgroundColor: colors?.backgroundColors,
                        data: chartValues
                    }
                ]
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            color: colors?.ticks
                        },
                        grid: {
                            color: colors?.grid
                        }
                    },
                    x: {
                        ticks: {
                            color: colors?.ticks
                        },
                        grid: {
                            color: colors?.grid
                        }
                    }
                }
            }
        });
    });
</script>

<canvas bind:this={chartCanvas} />
