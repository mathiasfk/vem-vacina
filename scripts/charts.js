const getFieldArray = function(data, field) {
    return data.map(each => each[field]);
}

const plotLineChart = function(chartId, data, fields) {
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
              maxTicksLimit: 7,
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

const plotBarChart = function(chartId, data) {
  const ctx = document.getElementById(chartId).getContext("2d");

  const chartData = {
    datasets: [
      {
        label: data.fully_vaccinated.label,
        data: [data.fully_vaccinated.value],
        backgroundColor: data.fully_vaccinated.color,
        stack: 0
      },
      {
        label: data.vaccinated.label,
        data: [data.vaccinated.value],
        backgroundColor: data.vaccinated.color,
        stack: 0
      },
      {
        label: data.non_vaccinated.label,
        data: [data.non_vaccinated.value],
        backgroundColor: data.non_vaccinated.color,
        stack: 0
      }
    ]
  };

  const config = {
    type: 'horizontalBar',
    data: chartData,
    options: {
      tooltips: {
        callbacks: {
          title: function(tooltipItem, data) {
            return "Percentagem da população"
          },
          label: function(tooltipItem, data) {
            return `${data.datasets[tooltipItem.datasetIndex].label}  ${formatNumber(data.datasets[tooltipItem.datasetIndex].data[0])}%`;
          }
        }
      }
    }
  };

  new Chart(ctx, config);
};