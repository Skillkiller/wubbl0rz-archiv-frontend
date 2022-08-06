<script>
    import { onMount } from 'svelte';
    import { Chart, registerables } from 'chart.js/dist/chart.esm';
    import ChartDataLabels from 'chartjs-plugin-datalabels';
    import { theme } from '@stores/main';
    import { themeColors } from './StatsColors.svelte';

    Chart.register(...registerables);

    export let data;

    let chartCanvas;
    let chart;
    let colors = themeColors[$theme];
    const chartValues = Array.from([...data.map((x) => x.count)]);
    const chartLabels = Array.from([...data.map((x) => x.hour)]);

    theme.subscribe((newTheme) => {
        if (chart) {
            colors = themeColors[newTheme];
            chart.options.scales = {
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
                    title: {
                        color: colors?.ticks
                    },
                    grid: {
                        color: colors?.grid
                    }
                }
            };
            chart.options.plugins.datalabels = {
                color: colors?.ticks
            };
            chart.update();
        }
    });

    onMount(async () => {
        let ctx = chartCanvas.getContext('2d');
        chart = new Chart(ctx, {
            plugins: [ChartDataLabels],
            type: 'line',
            data: {
                labels: chartLabels,
                datasets: [
                    {
                        data: chartValues,
                        borderColor: '#F28E2B',
                        tension: 0.4
                    }
                ]
            },
            options: {
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    datalabels: {
                        color: colors?.ticks,
                        align: 'end'
                    }
                },
                interaction: {
                    intersect: false
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
                        title: {
                            display: true,
                            text: 'Uhrzeit',
                            color: colors?.ticks,
                            font: {
                                size: 16
                            }
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

<style lang="scss">
    canvas {
        max-height: 300px;
    }
</style>
