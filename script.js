WORLD_DATA = 'https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/vaccinations.csv';
BRAZIL_POPULATION = 212000000;

filterResults = function(csv, location) {
    var countryFilter = new RegExp((location + ".*"), "gi");
    var rows = [];

    while (arrMatches = countryFilter.exec(csv)) {
        rows.push(parseResults(arrMatches[0]));
    }
    return rows;
}

parseResults = function(row) {
    fields = row.split(",");
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
}

daysBetween = function(date1, date2) {
    var time = new Date(date2).getTime() - new Date(date1).getTime();
    return time / (1000 * 3600 * 24);
}

movingAvg = function(data, field, period) {
    var sum = 0;
    var start = data.length - period;
    for (i = start; i < data.length; i++) {
        sum += parseInt(data[i][field]);
    }
    return sum / period;
}

fetch(WORLD_DATA)
    .then(function(response) {
        return response.text();
    })
    .then(function(text) {
        var parsedResults = filterResults(text, 'Brazil');
        console.log(parsedResults);

        var firstData = parsedResults[0];
        var lastData = parsedResults[parsedResults.length - 1];

        var movingAvgDaily = movingAvg(parsedResults, 'daily_vaccinations', 3);

        var timespan = daysBetween(firstData.date, lastData.date);
        var projection = Math.trunc((BRAZIL_POPULATION - lastData.people_vaccinated) / movingAvgDaily);

        document.querySelector("#vaccinated-num").textContent = lastData.people_vaccinated;
        document.querySelector("#vaccinated-percent").textContent = lastData.people_vaccinated_per_hundred;
        document.querySelector("#vaccination-period").textContent = timespan;
        document.querySelector("#projected-period").textContent = projection;
    });