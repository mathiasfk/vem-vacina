const getFieldArray = function(data, field) {
    return data.map(each => each[field]);
}

const plotChart = function(chartId, data, fields) {
    const ctx = document.getElementById(chartId).getContext("2d");
    new Chart(ctx, {
      type: "line",
      data: {
        labels: getFieldArray(data,"date"),
        datasets: fields.map(each => ({
          label: each.label,
          data: getFieldArray(data, each.field),
          borderColor: each.color,
        }))
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