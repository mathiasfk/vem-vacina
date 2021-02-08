const getFieldArray = function(data, field) {
    return data.map(each => each[field]);
}

const plotChart = function(data, field, label) {
    const ctx = document.getElementById("chart-" + field.replace("_","-")).getContext("2d");
    new Chart(ctx, {
      type: "line",
      data: {
        labels: getFieldArray(data,"date"),
        datasets: [{
          label: label,
          data: getFieldArray(data, field),
          borderColor: "black",
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
};