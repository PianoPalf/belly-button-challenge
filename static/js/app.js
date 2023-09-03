//########## BELLY BUTTON BIODIVERSITY DASHBOARD #############
//############################################################

//###### Explores a Dataset with Interactive Charts ##########

// Set URL for Data Import
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/\
14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ",dataPromise); 

// Set Global Variable
let user_choice;

////////// FETCH JSON DATA & PLOT INTERACTIVE CHARTS /////////
//////////////////////////////////////////////////////////////
d3.json(url).then(function(data) {
    
    // Check Data in Console
    console.log("Data: ", data);
    
    // Assign required data to variables
    let names = data.names;
    let samples = data.samples;
    let metadata = data.metadata;
    
    // Make Object of Metadata for Easy Access
    let metadataObject = metadata.map(metadatum =>({
        'id': metadatum.id,
        'ethnicity': metadatum.ethnicity,
        'gender': metadatum.gender,
        'age': metadatum.age,
        'location': metadatum.location,
        'bbtype': metadatum.bbtype,
        'wfreq': metadatum.wfreq
    }));
    
    // Check metadata
    console.log('Metadata: ', metadataObject);

    // Make Object of Sample Data for Easy Access
    let sample_object = samples.map(sample => ({
        'id': sample.id,
        'otu_ids': sample.otu_ids,
        'values': sample.sample_values,
        'labels': sample.otu_labels
    }));
    
    // Check Sample Object
    console.log("Data Object: ", sample_object);
    
    // Check first ID
    console.log('First ID: ', sample_object[0].id)
    
    // Check all IDs
    console.log('All IDs: ', names)

    // Call Dropdown Menu Function
    makeMenu()

    // Dropdown Menu Selection & Call getData Function
    d3.selectAll("#selDataset").on("change", getData);
    

    //////////////////////// FUNCTIONS ///////////////////////////

    ////////////// FUNCTION: Populate Dropdown Menu //////////////
    //////////////////////////////////////////////////////////////
    function makeMenu(){
        
        // Get reference to the Dropdown select element
        let dropdownMenu = d3.select("#selDataset");
      
        // Use the Array of Sample Names to populate the menu options
        let sampleIDs = names;
      
        // Append ID Array to Dropdown Menu
        sampleIDs.forEach((id) => {
        dropdownMenu
          .append("option")
          .text(id)
          .property("value", id);
    })};
    
    ///////////FUNCTION: DOM Changes & Plot Charts ////////////////
    ///////////////////////////////////////////////////////////////
    function getData(){
      
      // Select Dropdown Menu using D3
      let dropdownMenu = d3.select("#selDataset");
      
      // Assign the chosen ID to a variable
      user_choice = dropdownMenu.property("value");
      
      // Print the chosen id to the console
      console.log("User Choice: ", user_choice);
      
      // Create variables for filtered data
      let chartData = sample_object.find(field => field.id === user_choice);
      let demographicData = metadataObject.find(field => field.id == user_choice);
      
      /////////////////// DEMOGRAPHIC INFO BOX //////////////////////
      // Select Demographic Info Box
      let demographicInfo = document.getElementById("sample-metadata");
      
      // Populate Demographic Info
      let demoText = `<b>id:</b> ${demographicData.id}<br>\
                      <b>ethnicity:</b> ${demographicData.ethnicity}<br>\
                      <b>gender:</b> ${demographicData.gender}<br>\
                      <b>age:</b> ${demographicData.age}<br>\
                      <b>location:</b> ${demographicData.location}<br>\
                      <b>bbtype:</b> ${demographicData.bbtype}<br>\
                      <b>wfreq:</b> ${demographicData.wfreq}<br>`
      
      // Print Demographic Info to Demographic Info Box
      demographicInfo.innerHTML = demoText;
      
      /////////////////// HORIZONTAL BAR CHART //////////////////////
      // Set Trace for Horizontal Bar Chart 
      let traceBar = {
        x: chartData.values.slice(0,10).reverse(),
        y: chartData.otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse(),
        text: chartData.labels.slice(0,10).reverse(),
        type: "bar",
        orientation: "h",
        marker: {
          color: '#f09664'
        }
      };
  
      // Set Bar Chart Data to Trace
      let barData = [traceBar];

      // Set Bar Chart Layout Parameters
      let barLayout = {
        title: `<b>Belly Button Flora</b> - Subject ${demographicData.id}`,
        font: {size: 14},
        margin: {pad: 5},
      };
  
      // Plot Horizontal Bar Chart
      Plotly.newPlot("bar", barData, barLayout);

      //////////////////////// BUBBLE CHART /////////////////////////
      // Set Trace for Bubble Chart
      let traceBubble = {
        type: "scatter",
        mode: 'markers',
        x: chartData.otu_ids,
        y: chartData.values,
        text: chartData.labels,
        marker: {
          color: chartData.otu_ids,      
          size: chartData.values,
          showscale: true
        }
      };
      
      // Set Bubble Chart Data to Trace
      let bubbleData = [traceBubble];
      
      // Set Bubble Chart Layout Parameters
      var bubbleLayout = {
        title: `<b>Microbial Diversity</b> - Subject ${demographicData.id}`,
        font: {size: 14},
        showlegend: false,
        height: 600,
        width: 1150,
        xaxis: {title: {text: "OTU IDs"}},
        yaxis: {title: {text: "Sample Values"}}
      };
      
      // Plot Bubble Chart
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);

      //////////////////////// GAUGE CHART //////////////////////////
      // Set Trace for Gauge Chart
      let traceGauge = {
          domain: { x: [0, 1], y: [0, 1] },
          value: demographicData.wfreq,
          title: { text: `<b>Belly Button Washing Frequency</b> <br>Scrubs Per Week`},
          type: "indicator",
          mode: "gauge+number",
          gauge: { 
            axis: { range: [null, 9] },
            bar: { color: "#ffffff" },
            steps: [
              { range: [0, 1], color: '#ebceb7' },
              { range: [1, 2], color: '#f6bf96' },
              { range: [2, 3], color: '#f6ab7a' },
              { range: [3, 4], color: '#f09664' },
              { range: [4, 5], color: '#e57d57' },
              { range: [5, 6], color: '#d7634a' },
              { range: [6, 7], color: '#cd4b3a' },
              { range: [7, 8], color: '#c02f2c' },
              { range: [8, 9], color: '#b20d1c' },
            ]}
        };
      
      // Set Gauge Chart Data to Trace
      let gaugeData = [traceGauge];

      // Set Gauge Chart Layout Parameters
      let gaugeLayout = { 
        width: 515, 
        height: 500, 
        margin: { t: 0, b: 0} 
      };
        
      // Plot Gauge Chart
      Plotly.newPlot('gauge', gaugeData, gaugeLayout);
    };
});