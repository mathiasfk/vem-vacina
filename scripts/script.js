const WORLD_DATA = "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/vaccinations.csv";
const DEFAULT_LOCATION = "Brazil";

const data = fetch(WORLD_DATA)
.then(response => response.text())
.then(csv => processData(csv, DEFAULT_LOCATION))

const getSelectText = element => element.options[element.selectedIndex].text;

document.onreadystatechange = () => 
{
    document.querySelector("#country-select").addEventListener("change", e => {
        document.querySelector("#selected-country").textContent = getSelectText(e.target);
        processData(window.cachedCsv, e.target.value);
    });
}