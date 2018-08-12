const parse = text => {
    const languages = {};
    text.trim()
        .split(" ")
        .forEach(string => {
            const [key, value] = string.split(":");
            languages[key] = parseInt(value);
        });
    return languages;
};

const sum = array => {
    if (array.length === 0) {
        return 0;
    }
    return array.reduce((acum, val) => (!isNaN(val) ? acum + val : 0), 0);
};

const colors = [
    "#63513d",
    "#002855",
    "#ef6079",
    "#84bd00",
    "#5f259f",
    "#f06400",
    "#00629b",
    "#aea8a5",
    "#ba0020",
    "#f1c400",
    "#008c95",
    "#007b3e",
    "#80276c",
    "#dc4405"
];

const chart = ({ limit, singleColor }) => {
    const canvasContainer = document.getElementById("canvas-container");
    const color = "white";
    const username = canvasContainer.dataset.username;
    const languages = JSON.parse(canvasContainer.dataset.languages);
    const colors = JSON.parse(canvasContainer.dataset.colors);
    const keys = Object.keys(languages);
    const values = Object.values(languages);
    if (typeof limit !== "number") {
        limit = keys.length;
    }
    const labels = keys.slice(0, limit);
    const data = values.slice(0, limit);
    if (keys.length > 20) {
        const valueOthers = sum(values.slice(limit, keys.length));
        labels.push("Others");
        data.push(valueOthers);
    }
    const canvas = document.getElementById("myChart");
    const chart = (window.chart = new Chart(canvas, {
        type: "bar",
        data: {
            labels,
            datasets: [
                {
                    label: "Language Stats",
                    backgroundColor: colors,
                    borderColor: "black",
                    borderWidth: 1,
                    data
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            legend: {
                display: singleColor ? true : false,
                labels: {
                    fontColor: color
                },
                position: "top"
            },
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                            fontColor: color
                        }
                    }
                ],
                xAxes: [
                    {
                        ticks: {
                            fontColor: color,
                            maxRotation: 90,
                            minRotation: 90
                        }
                    }
                ]
            },
            tooltips: {
                callbacks: {
                    afterBody: () =>
                        `Click to browse repos with the current language by ${username}`
                }
            }
        }
    }));

    const slugify = text => {
        return text
            .toString()
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/#/g, "%23")
            .replace(/\+/g, "%2B")
            .replace(/\-\-+/g, "-")
            .replace(/^-+/, "")
            .replace(/-+$/, "");
    };

    const onCanvasClick = e => {
        const activeElement = chart.getElementAtEvent(e)[0];

        if (activeElement) {
            let language = chart.data.labels[activeElement._index];
            language = slugify(language);
            const value =
                chart.data.datasets[activeElement._datasetIndex].data[
                    activeElement._index
                ];
            const url = `https://github.com/${username}?tab=repositories&type=&language=${language}`;
            window.open(url, "_blank");
        }
    };
    canvas.addEventListener("click", onCanvasClick);
    return singleColor;
};
