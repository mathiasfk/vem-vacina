const MILLISECONDS_IN_A_DAY = 1000 * 3600 * 24;

const daysBetween = function(date1, date2) {
    const time = new Date(date2).getTime() - new Date(date1).getTime();
    return time / MILLISECONDS_IN_A_DAY;
};

const formatNumber = function(numString) {
    return parseFloat(numString).toLocaleString();
};

const formatDate = function(dateString) {
    const timezone = new Date().toTimeString().slice(12, 17);
    return new Date(dateString + "T00:00:00" + timezone).toLocaleDateString()
};

const processData = (csv, location) => {

    if (!window.cachedCsv) window.cachedCsv = csv;

    const parsedResults = filterAndParseResults(csv, location);

    const firstData = parsedResults[0];
    let lastData;
    let lastValidIndex = parsedResults.length - 1;
    do {
        lastData = parsedResults[lastValidIndex--];
    }
    while(isNaN(lastData.people_fully_vaccinated_per_hundred)
        || isNaN(lastData.people_vaccinated_per_hundred));

    const timespan = daysBetween(firstData.date, lastData.date);

    document.querySelector("#vaccinated-num").textContent = formatNumber(lastData.people_vaccinated);
    document.querySelector("#vaccinated-percent").textContent = formatNumber(lastData.people_vaccinated_per_hundred);
    document.querySelector("#vaccination-period").textContent = timespan;
    document.querySelector("#last-available-day").textContent = formatDate(lastData.date);

    if (window.chartDaily) window.chartDaily.destroy();
    window.chartDaily = plotLineChart("chart-daily", parsedResults, [
        { field:"daily_vaccinations_raw", label:"Vacinações no dia", color:"black" },
        { field:"daily_vaccinations", label:"Média móvel", color:"lightslategray" }
    ]);
    if (window.chartTotal) window.chartTotal.destroy();
    window.chartTotal = plotLineChart("chart-total", parsedResults, [
        { field:"people_vaccinated", label:"Total de vacinados", color:"black" },
        { field:"people_fully_vaccinated", label:"Total de completamente vacinados", color:"green" }
    ]);

    window.barChart = plotBarChart("bar-chart", {
        "fully_vaccinated" : { label: "Completamente vacinados", value: lastData.people_fully_vaccinated_per_hundred, color: "green"},
        "vaccinated" : { label: "Parcialmente vacinados", value: lastData.people_vaccinated_per_hundred - lastData.people_fully_vaccinated_per_hundred, color: "black"},
        "non_vaccinated" : { label: "Não vacinados", value: 100 - lastData.people_vaccinated_per_hundred, color: "lightslategray"},
    });
};