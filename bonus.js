(function () {
    //iife - this wraps the code in a function so it isn't accidentally exposed
    //to other javascript in other files. It is not required.

    var width=600, height=400

    //read in our csv file
    d3.csv("./cars.csv").then((data) => {
        // Your code goes here!
        //find the unique options for data.manufacturer
        const distinctValues = [...new Set(data.map((d) => d.hwy))]
        distinctValues.sort()

        var x = d3.scaleBand()
            .domain(distinctValues)
            .range([0, width])
            .padding(0.1);

        var y = d3.scaleLinear()
            .domain([0, d3.max(data, (d) => { return (+d.cyl) })])
            .range([height, 0]);

        //Creating an color scale for nominal (categorical data)
        var ordinal = d3.scaleOrdinal().domain(distinctValues) //use unique values as input domain
            .range(d3.schemeSet3); //use d3 Color Scheme #3 as possible output colors
        var svg = d3.select("#bonus")
        //create an svg g element and add 50px of padding
        const chart = svg.append("g")
            .attr("transform", `translate(50, 50)`);


        //add axes
        chart.append("g")
            //put our axis on the bottom
            .attr("transform", "translate(0," + (height) + ")")
            //ticks + tickSize adds grids
            .call(d3.axisBottom(x).ticks(10).tickSize(-height - 10))
            //Optional: remove the axis endpoints
            .call((g) => g.select(".domain").remove());

        //add y-axis
        chart.append("g")
            .call(d3.axisLeft(y).ticks(10).tickSize(-width - 10))
            //Optional: remove the axis endpoints
            .call((g) => g.select(".domain").remove());

        bars = chart.append('g')
            .selectAll("rect")
            .data(data)
            .join("rect")
            .attr("x", function (d) { return x(d.hwy); })
            .attr("y", function (d) { return y(d.cyl); })
            .attr("fill", function (d) { return ordinal(d.hwy); })
            .attr("width", x.bandwidth()) //use the bandwidth returned from our X scale
            .attr("height", function (d) { return height - y(+d.cyl); }) //full height - scaled y length
            .style("opacity", 0.75)

        chart.append('text') //x-axis
            .attr('class', 'axis-title') //Optional: change font size and font weight
            .attr('y', height + 25) //add to the bottom of graph (-25 to add it above axis)
            .attr('x', width - 100) //add to the end of X-axis (-60 offsets the width                     of text)
            .text('HWY'); //actual text to display

        chart.append('text') //y-axis
            .attr('class', 'axis-title') //Optional: change font size and font weight
            .attr('x', 10) //add some x padding to clear the y axis
            .attr('y', 25) //add some y padding to align the end of the axis with the text
            .text('CYL'); //actual text to displa

    });

})();
