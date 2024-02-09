let url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

d3.json(url).then(function(data) {
    
    console.log(data);
    
    let dropdownMenu = d3.select("#selDataset");
    let samples = data.samples;
    let metadata = data.metadata;

    samples.forEach(sample => {
      dropdownMenu.append("option").text(sample.id).property("value", sample.id);
    });

    function updateCharts(selectedSampleId) {
        let selectedSample = samples.find(sample => sample.id === selectedSampleId);
        let selectedMetadata = metadata.find(meta => meta.id.toString() === selectedSampleId);

        let trace1 = {
            x: selectedSample.sample_values.slice(0, 10).reverse(),
            y: selectedSample.otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse(),
            text: selectedSample.otu_labels.slice(0, 10).reverse(),
            type: 'bar',
            orientation: 'h'
        };

        let barData = [trace1];

        Plotly.newPlot("bar", barData);

        let trace2 = {
            x: selectedSample.otu_ids,
            y: selectedSample.sample_values,
            text: selectedSample.otu_labels,
            mode: 'markers',
            marker: {
                size: selectedSample.sample_values,
                color: selectedSample.otu_ids,
                colorscale: 'Viridis'
            }
        };

        let bubbleData = [trace2];

        let bubbleLayout = {
            xaxis: { title: "OTU ID" },
        };

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);

        let tableBody = d3.select("#sample-metadata");
        tableBody.html("");

        Object.entries(selectedMetadata).forEach(([key, value]) => {
            let row = tableBody.append("tr");
            row.append("td").text(key);
            row.append("td").text(value);
        });
    }

    updateCharts(samples[0].id);

    dropdownMenu.on("change", function() {
        let selectedSampleId = dropdownMenu.property("value");
        updateCharts(selectedSampleId);
    });

});
