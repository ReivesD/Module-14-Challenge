d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json")
  .then(data => {
    const sampleValues = data.samples.map(sample => sample.sample_values);
    const otuIds = data.samples.map(sample => sample.otu_ids);
    const otuLabels = data.samples.map(sample => sample.otu_labels);
    const metadata = data.metadata;

    function createBarChart(selectedIndex) {
      const top10SampleValues = sampleValues[selectedIndex].slice(0, 10).reverse();
      const top10OtuIds = otuIds[selectedIndex].slice(0, 10).reverse();
      const top10OtuLabels = otuLabels[selectedIndex].slice(0, 10).reverse();

      const trace = {
        x: top10SampleValues,
        y: top10OtuIds.map(otuId => `OTU ${otuId}`),
        text: top10OtuLabels,
        type: "bar",
        orientation: "h"
      };

      const data = [trace];

      const layout = {
        title: "Top 10 OTUs Found in the Individual",
        xaxis: { title: "Sample Values" },
        yaxis: { title: "OTU IDs" }
      };

      Plotly.newPlot("bar", data, layout);
    }

    function createBubbleChart(selectedIndex) {
      const sampleValuesSelected = sampleValues[selectedIndex];
      const otuIdsSelected = otuIds[selectedIndex];
      const otuLabelsSelected = otuLabels[selectedIndex];

      const trace = {
        x: otuIdsSelected,
        y: sampleValuesSelected,
        text: otuLabelsSelected,
        mode: "markers",
        marker: {
          size: sampleValuesSelected,
          color: otuIdsSelected,
          colorscale: "Earth"
        }
      };

      const data = [trace];

      const layout = {
        title: "Sample Values vs. OTU IDs",
        xaxis: { title: "OTU IDs" },
        yaxis: { title: "Sample Values" }
      };

      Plotly.newPlot("bubble", data, layout);
    }

    function displayMetadata(selectedIndex) {
      const metadataDiv = d3.select("#sample-metadata");

      metadataDiv.html("");

      const selectedMetadata = metadata[selectedIndex];

      Object.entries(selectedMetadata).forEach(([key, value]) => {
        metadataDiv.append("p").text(`${key}: ${value}`);
      });
    }

    const defaultSampleIndex = 0;
    createBarChart(defaultSampleIndex);
    createBubbleChart(defaultSampleIndex);
    displayMetadata(defaultSampleIndex);

    const dropdownMenu = d3.select("#selDataset");
    data.names.forEach((name, index) => {
      dropdownMenu
        .append("option")
        .text(name)
        .attr("value", index);
    });

    dropdownMenu.on("change", function () {
      const selectedIndex = this.value;
      createBarChart(selectedIndex);
      createBubbleChart(selectedIndex);
      displayMetadata(selectedIndex);
    });
  })
  .catch(error => console.log("Error fetching data:", error));
