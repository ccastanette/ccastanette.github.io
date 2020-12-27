function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samplesArray = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredNum = samplesArray.filter(number => number.id.toString() === sample)[0];
    console.log(filteredNum)
    //  5. Create a variable that holds the first sample in the array.
    var first = filteredNum[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = filteredNum.otu_ids;
    var otu_labels = filteredNum.otu_labels;
    var sample_values = filteredNum.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_top = otu_ids.slice(0,10).reverse();
    var otu_id = otu_top.map(i => "OTU" + i);
    
    var yticks = otu_id;

    var sample_value = sample_values.slice(0, 10).reverse();

    // 8. Create the trace for the bar chart. 
    var trace = {
      x: sample_value,
      y: otu_id,
      text: otu_labels,
      type: "bar",
      orientation: "h"
    };
    
    var barData = [trace];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacterial Cultures Found",
      margin: {
      l: 100,
      r: 50,
      t: 50,
      b: 50     
    }
    // 10. Use Plotly to plot the data with the layout. 
    
  };
  Plotly.newPlot("bar", barData, barLayout);

  //BUBBLE CHART

  // 1. Create the trace for the bubble chart.
  var bubbleData = {
   x: otu_ids,
   y: sample_values,
   text: otu_labels,
   mode: 'markers',
   marker: {
     color: otu_ids,
     size: sample_values,
     colorscale: 'Viridis'
   }
   };
  var chartData = [bubbleData];

  // 2. Create the layout for the bubble chart.
  var bubbleLayout = {
    title: "Bacteria Cultures per Sample",
    xaxis:{title: "OTU ID"},
    height: 700,
    width: 1400,
    hovertext: otu_labels     
  };

  // 3. Use Plotly to plot the data with the layout.
  Plotly.newPlot("bubble", chartData, bubbleLayout)

  // GAUGE CHART

  // 1. Create a variable that filters the metadata array for the object with the desired sample number.
  var metadata = data.metadata;

  // Create a variable that holds the first sample in the array.
  var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);

  // 2. Create a variable that holds the first sample in the metadata array.
  var result = resultArray[0];

  // 3. Create a variable that holds the washing frequency.
  var washFreq = result.wfreq; 

  var wFreqFlt = parseFloat(washFreq);

  // 4. Create the trace for the gauge chart.
  var gaugeData = [
    {
    domain: { x:[0, 1] , y: [0, 1] },
    value: wFreqFlt,
    title: { text: "Belly Button Washing Frequency<br> Scrubs per Week"},
    type: "indicator",
    mode: "gauge+number",
    gauge: {
      axis: { range: [0, 10] },
      bar: {color: "black" }, 
      steps: [
        { range: [0,2], color: "rgb(255,0,0)"},
        { range: [2,4], color: "rgb(255,165,0)"},
        { range: [4,6], color: "rgb(255,255,0)"},
        { range: [6,8], color: "rgb(0,255,0)"},
        { range: [8,10], color: "rgb(0,128,0)"},
    ]
      }
    }
  ];
      
  // 5. Create the layout for the gauge chart.
  var gaugeLayout = { 
    width: 800, 
    height: 550, 
    margin: { t: 0, b: 0 },
    line: {color: '600000'},
       
  };
  
  // 6. Use Plotly to plot the gauge data and layout.
  Plotly.newPlot("gauge", gaugeData, gaugeLayout);
      
  });
}
