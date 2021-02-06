const WORLD_DATA = "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/vaccinations.csv";
const LOCATION_NAME = "Brazil";
const LOCATION_POPULATION = 212000000;
const CSV_SEPARATOR = ",";
const MOVING_AVG_DAYS = 3;

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
        "total_vaccinations": fields[3],
        "people_vaccinated": fields[4],
        "people_fully_vaccinated": fields[5],
        "daily_vaccinations_raw": fields[6],
        "daily_vaccinations": fields[7],
        "total_vaccinations_per_hundred": fields[8],
        "people_vaccinated_per_hundred": fields[9],
        "people_fully_vaccinated_per_hundred": fields[10],
        "daily_vaccinations_per_million": fields[11],
    };
};

const daysBetween = function(date1, date2) {
    const time = new Date(date2).getTime() - new Date(date1).getTime();
    return time / (1000 * 3600 * 24);
};

const movingAvg = function(data, field, period) {
    let sum = 0;
    const start = data.length - period;
    for (let i = start; i < data.length; i++) {
        sum += parseInt(data[i][field]);
    }
    return sum / period;
};

const formatNumber = function(numString) {
    return parseFloat(numString).toLocaleString();
};

fetch(WORLD_DATA)
    .then(response => response.text())
    .then(text => {
        const parsedResults = filterResults(text, LOCATION_NAME);

        const firstData = parsedResults[0];
        const lastData = parsedResults[parsedResults.length - 1];

        const movingAvgDaily = movingAvg(parsedResults, "daily_vaccinations", MOVING_AVG_DAYS);

        const timespan = daysBetween(firstData.date, lastData.date);
        const projection = Math.trunc((LOCATION_POPULATION - lastData.people_vaccinated) / movingAvgDaily);

        document.querySelector("#vaccinated-num").textContent = formatNumber(lastData.people_vaccinated);
        document.querySelector("#vaccinated-percent").textContent = formatNumber(lastData.people_vaccinated_per_hundred);
        document.querySelector("#vaccination-period").textContent = timespan;
        document.querySelector("#projected-period").textContent = projection;
    });