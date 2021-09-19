const CSV_SEPARATOR = ",";

const filterAndParseResults = function(csv, location) {
    const countryFilter = new RegExp((location + ".*"), "gi");
    const rows = [];

    let arrMatches;
    while (arrMatches = countryFilter.exec(csv)) {
        rows.push(parseRow(arrMatches[0]));
    }
    return rows;
};

const parseRow = function(row) {
    const fields = row.split(CSV_SEPARATOR);
    return {
        "location": fields[0],
        "iso_code": fields[1],
        "date": fields[2],
        "total_vaccinations": parseInt(fields[3]),
        "people_vaccinated": parseInt(fields[4]),
        "people_fully_vaccinated": parseInt(fields[5]),
        "total_boosters": parseInt(fields[6]),
        "daily_vaccinations_raw": parseInt(fields[7]),
        "daily_vaccinations": parseInt(fields[8]),
        "total_vaccinations_per_hundred": parseFloat(fields[9]),
        "people_vaccinated_per_hundred": parseFloat(fields[10]),
        "people_fully_vaccinated_per_hundred": parseFloat(fields[11]),
        "total_boosters_per_hundred": parseFloat(fields[12]),
        "daily_vaccinations_per_million": parseFloat(fields[13]),
    };
};