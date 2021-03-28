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
              beginAtZero: true,
              callback: function(value, index, values) {
                return value.toLocaleString();
              }
            }
          }]
        },
        spanGaps: true,
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              return data.datasets[tooltipItem.datasetIndex].label + ": " + tooltipItem.yLabel.toLocaleString();
            },
            labelColor: function(tooltipItem, chart) {
              return {
                  borderColor: chart.config.data.datasets[tooltipItem.datasetIndex].borderColor,
                  backgroundColor: chart.config.data.datasets[tooltipItem.datasetIndex].borderColor,
              };
            },
          }
        }
      },
    });
};