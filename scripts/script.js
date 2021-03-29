const WORLD_DATA = "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/vaccinations.csv";
const LOCATION_NAME = "Brazil";
const LOCATION_POPULATION = 212000000;
const CSV_SEPARATOR = ",";
const MOVING_AVG_DAYS = 5;
const MILLISECONDS_IN_A_DAY = 1000 * 3600 * 24;

const filterResults = function(csv, location) {
    const countryFilter = new RegExp((location + ".*"), "gi");
    const rows = [];

    let arrMatches;
    while (arrMatches = countryFilter.exec(csv)) {
        rows.push(parseResults(arrMatches[0]));
    }
    return rows;
};

const parseResults = function(row) {
    const fields = row.split(CSV_SEPARATOR);
    return {
        "location": fields[0],
        "iso_code": fields[1],
        "date": fields[2],
        "total_vaccinations": parseInt(fields[3]),
        "people_vaccinated": parseInt(fields[4]),
        "people_fully_vaccinated": parseInt(fields[5]),
        "daily_vaccinations_raw": parseInt(fields[6]),
        "daily_vaccinations": parseInt(fields[7]),
        "total_vaccinations_per_hundred": parseFloat(fields[8]),
        "people_vaccinated_per_hundred": parseFloat(fields[9]),
        "people_fully_vaccinated_per_hundred": parseFloat(fields[10]),
        "daily_vaccinations_per_million": parseFloat(fields[11]),
    };
};

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

fetch(WORLD_DATA)
    .then(response => response.text())
    .then(text => {
        const parsedResults = filterResults(text, LOCATION_NAME);

        const firstData = parsedResults[0];
        const lastData = parsedResults[parsedResults.length - 1];

        const timespan = daysBetween(firstData.date, lastData.date);

        document.querySelector("#vaccinated-num").textContent = formatNumber(lastData.people_vaccinated);
        document.querySelector("#vaccinated-percent").textContent = formatNumber(lastData.people_vaccinated_per_hundred);
        document.querySelector("#vaccination-period").textContent = timespan;
        document.querySelector("#last-available-day").textContent = formatDate(lastData.date);

        plotChart("chart-daily", parsedResults, [
            { field:"daily_vaccinations_raw", label:"Vacinações no dia", color:"black" },
            { field:"daily_vaccinations", label:"Média móvel", color:"green" }
        ]);
        plotChart("chart-total", parsedResults, [
            { field:"people_vaccinated", label:"Total de vacinados (1ª dose)", color:"black" },
            { field:"people_fully_vaccinated", label:"Total de vacinados (2ª dose)", color:"green" }
        ]);
    });