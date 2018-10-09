function buildMetadata(sample) {

  // Build URL for samples
  var url = "/metadata/" + sample

  // d3.json to grab url data

  d3.json(url).then(function(data) {
      console.log(data);
    
    // Clear existing metadata
    var sampleMeta = d3.select("#sample-metadata");
    sampleMeta.html("");

    // Grab each Key and Value pair
        Object.entries(data).forEach(([key, value]) => {
          sampleMeta.append("h6").text(`${key}:${value}`)
      })
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  })
};
function buildCharts(sample) {
  // Build Plots
  
    var url = "/samples/" + sample
    d3.json(url).then(function(data) {
      // 
      const otu_ids = data.otu_ids;
      const otu_labels = data.otu_labels;
      const sample_values = data.sample_values;

      var pieTrace = {
        values: sample_values.slice(0,10),
        labels: otu_ids.slice(0,10),
        hovertext: otu_labels.slice(0,10),
        type: 'pie'
      }

      var pieLayout = {
        margin: { t: 0, l: 0 }
      };

      var bubbleTrace = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
          size: sample_values,
          color: otu_ids
        }
      
      }
      var bubbleLayout = {
        margin: { t: 0 },
        hovermode: "closest",
        xaxis: { title: "OTU ID" },
        // gridwidth=2
      };
    
  
  var pieData = [pieTrace]
  var bubbleData = [bubbleTrace]
    // Use Plotly to build Bubble and Pie charts
    Plotly.newPlot("bubble", pieData, bubbleLayout)

    Plotly.newPlot("pie", bubbleData, pieLayout)
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
